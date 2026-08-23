import { ReturnAuthorizationRepository } from './repository'
import { InventoryControlService } from '../inventory-control/service'
import { accountingPosting } from '../../lib/accounting-posting'
import { CustomerInvoice } from '../customer-invoice/model'

const inventoryService = new InventoryControlService()

export class ReturnAuthorizationService {
	private repository: ReturnAuthorizationRepository

	constructor() {
		this.repository = new ReturnAuthorizationRepository()
	}

	private async generateRaNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({
			organizationId,
			deletedAt: null,
		} as any)
		return `RA-${`${organizationId}`.slice(-4).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
	}

	async create(data: any, userId: string) {
		const lines = data.lines ?? []
		if (!lines.length) throw new Error('At least one line item is required')
		for (const line of lines) {
			if (!line.description?.trim()) throw new Error('Each line must have a description')
			if (!(Number(line.quantity) > 0)) throw new Error('Each line must have a positive quantity')
		}
		const raNumber = await this.generateRaNumber(data.organizationId)
		return this.repository.create({
			...data,
			raNumber,
			status: 'pending',
			requestedDate: data.requestedDate ? new Date(data.requestedDate) : new Date(),
			lines: lines.map((line: any) => ({
				itemId: line.itemId || undefined,
				description: String(line.description ?? '').trim(),
				quantity: Number(line.quantity),
				quantityReceived: 0,
			})),
			createdBy: userId,
			updatedBy: userId,
		})
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async list(organizationId: string, filter: Record<string, unknown> = {}, page = 1, limit = 100) {
		const f: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filter.status) f.status = filter.status
		if (filter.customerId) f.customerId = filter.customerId
		if (filter.receiptComplete === true) {
			f.receiptComplete = true
		} else if (filter.receiptComplete === false) {
			// Include legacy docs without the field (treated as not complete)
			f.receiptComplete = { $ne: true } as any
		}
		const result = await this.repository.findPaginated(f as any, page, limit, { requestedDate: -1 })
		return result.data
	}

	async receiveGoods(
		input: {
			returnAuthorizationId: string
			receivedDate: string
			notes?: string
			lines: Array<{ lineId: string; quantityReceived: number }>
		},
		userId: string,
	) {
		const linesIn = input.lines ?? []
		if (!linesIn.length) throw new Error('At least one line is required')

		const doc = await this.repository.findById(input.returnAuthorizationId)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'approved') throw new Error('Only approved return authorizations can receive goods')

		const receivedDate = new Date(input.receivedDate)
		if (Number.isNaN(receivedDate.getTime())) throw new Error('Invalid received date')

		// Accumulate per-line received quantities for inventory update below.
		const inventoryLines: Array<{ lineId: string; itemId?: string; description: string; qty: number }> = []

		for (const row of linesIn) {
			const sub = (doc as any).lines.id(row.lineId)
			if (!sub) throw new Error(`Line ${row.lineId} not found`)
			const add = Number(row.quantityReceived)
			if (!(add > 0)) throw new Error('Each line must have a positive quantity received')
			const max = Number(sub.quantity)
			const prev = Number(sub.quantityReceived ?? 0)
			const newQty = Math.min(max, prev + add)
			sub.quantityReceived = newQty
			// Track how much we're actually adding this call (capped at max).
			const actualAdded = newQty - prev
			if (actualAdded > 0) {
				inventoryLines.push({
					lineId: row.lineId,
					itemId: sub.itemId ? String(sub.itemId) : undefined,
					description: String(sub.description ?? 'Item'),
					qty: actualAdded,
				})
			}
		}

		;(doc as any).markModified('lines')
		if (!(doc as any).goodsReceivedAt) (doc as any).goodsReceivedAt = receivedDate
		if (input.notes?.trim()) (doc as any).receiptNotes = input.notes.trim()
		const allComplete = (doc as any).lines.every(
			(l: any) => Number(l.quantityReceived ?? 0) >= Number(l.quantity),
		)
		;(doc as any).receiptComplete = allComplete
		;(doc as any).goodsReceivedBy = userId
		;(doc as any).updatedBy = userId
		await (doc as any).save()

		// Odoo flow: when returned goods are received back into the warehouse,
		// stock is immediately increased (direction: 'in').
		// The RA's organizationId is a plain string — pass it directly.
		const orgId = String((doc as any).organizationId ?? '')
		if (orgId && inventoryLines.length > 0) {
			await inventoryService.applyReceiptLines({
				organizationId: orgId,
				userId,
				referenceModule: 'return_authorization',
				referenceId: String((doc as any)._id ?? input.returnAuthorizationId),
				lines: inventoryLines.map((l) => ({
					itemId: l.itemId,
					itemDescription: l.description,
					quantity: l.qty,
				})),
				direction: 'in',
			})

			// Post revenue reversal journal entry: Dr Revenue / Cr AR.
			// Uses the existing postSalesReturn helper — the RA acts as the sales return doc.
			const raDoc = await this.repository.findById(input.returnAuthorizationId)
			if (raDoc) {
				await accountingPosting.postSalesReturn(raDoc, userId)
			}

			// Odoo flow: on receipt of returned goods, automatically create a credit note
			// (reverse invoice) so AR is credited and the customer gets a refund/credit.
			if (allComplete || inventoryLines.length > 0) {
				await this.createCreditNoteForRA(doc as any, userId)
			}
		}

		return doc
	}

	/**
	 * Auto-create a Customer Invoice credit note for the returned amount.
	 * Matches Odoo behaviour: when returned goods are received back, a credit note
	 * is auto-generated in draft status for the AR team to review and post.
	 */
	private async createCreditNoteForRA(ra: any, userId: string): Promise<void> {
		try {
			// Build unique invoice number for the credit note
			const count = await CustomerInvoice.countDocuments({
				organizationId: ra.organizationId,
				deletedAt: null,
			})
			const seq = (count + 1).toString().padStart(4, '0')
			const orgSlice = String(ra.organizationId ?? '').slice(-6).toUpperCase()
			const invoiceNumber = `CN-RA-${orgSlice}-${seq}`

			// Sum the returned line totals
			const lines = ra.lines ?? []
			const totalAmount = lines.reduce(
				(sum: number, l: any) => sum + Number(l.quantityReceived ?? 0) * Number(l.unitPrice ?? l.rate ?? 0),
				0,
			)

			await CustomerInvoice.create({
				invoiceNumber,
				organizationId: ra.organizationId,
				customerId: ra.customerId,
				clientId: ra.customerId,
				salesOrderId: ra.salesOrderId ?? undefined,
				invoiceDate: new Date(),
				subtotal: totalAmount,
				taxAmount: 0,
				totalAmount: totalAmount,
				status: 'draft',
				// Credit notes have negative totals in Odoo; mark for UI identification
				items: lines.map((l: any) => ({
					itemId: l.itemId ?? undefined,
					itemDescription: String(l.description ?? 'Returned item'),
					quantity: Number(l.quantityReceived ?? 0),
					unitPrice: Number(l.unitPrice ?? l.rate ?? 0),
					lineTotal: Number(l.quantityReceived ?? 0) * Number(l.unitPrice ?? l.rate ?? 0),
				})),
				createdBy: userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		} catch (err) {
			// Non-fatal: log but do not fail the goods receipt if credit note creation fails
			console.error('[RA] Failed to auto-create credit note:', err)
		}
	}

	async approve(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'pending') throw new Error('Only pending return authorizations can be approved')
		return this.repository.update(id, {
			status: 'approved',
			approvedAt: new Date(),
			approvedBy: userId,
			updatedBy: userId,
		})
	}

	async reject(id: string, userId: string, rejectionReason?: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'pending') throw new Error('Only pending return authorizations can be rejected')
		return this.repository.update(id, {
			status: 'rejected',
			rejectionReason: rejectionReason ?? '',
			rejectedAt: new Date(),
			rejectedBy: userId,
			updatedBy: userId,
		})
	}

	async cancel(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'pending') throw new Error('Only pending return authorizations can be cancelled')
		return this.repository.update(id, {
			status: 'cancelled',
			updatedBy: userId,
		})
	}

	async softDelete(id: string, userId: string) {
		return this.repository.update(id, { deletedAt: new Date(), updatedBy: userId })
	}
}
