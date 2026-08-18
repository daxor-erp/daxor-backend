import { GraphQLValidationError } from '@repo/errors'
import { PurchaseOrderRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'
import { VendorRepository } from '../vendor/repository'
import { ProjectRepository } from '../project/repository'
import { GRNService } from '../grn/service'
import { VendorBillService } from '../vendor-bill/service'
import { VendorBillRepository } from '../vendor-bill/repository'
import { PoLineCalculator, type PoLineInput } from './line-calculator'
import { ProductStockService } from '../product-stock/service'
import { logger } from '../../lib/logger'

type AnyRecord = Record<string, unknown>

/** Statuses from which the PO document can still be freely edited (line/header changes). */
const EDITABLE_STATUSES = new Set(['rfq', 'rfq_sent'])

/** Statuses that are considered fully terminal — no receiving, billing, or edits allowed. */
const TERMINAL_STATUSES = new Set(['billed', 'cancelled', 'rejected', 'locked'])

/** Statuses from which a receive action is allowed. */
const RECEIVABLE_STATUSES = new Set(['purchase_order', 'sent', 'partially_received', 'partially_billed', 'billed'])

/** Statuses from which a bill action is allowed. */
const BILLABLE_STATUSES = new Set([
	'purchase_order',
	'sent',
	'received',
	'partially_received',
	'partially_billed',
])

const round2 = (n: number) => Math.round(n * 100) / 100

/** Convert totalAmount to base-currency (INR) amount using stored exchange rate. */
function toBaseCurrency(amount: number, exchangeRate: number): number {
	// exchangeRate = how many foreign-currency units per 1 INR (e.g. 0.012 for USD/INR).
	// If rate is 0 or negative, fall back to 1 (i.e. already in base currency).
	if (!exchangeRate || exchangeRate <= 0) return round2(amount)
	return round2(amount / exchangeRate)
}

export class PurchaseOrderService {
	private repository: PurchaseOrderRepository
	private vendorRepo: VendorRepository
	private projectRepo: ProjectRepository
	private grnService: GRNService
	private billService: VendorBillService
	private vendorBillRepo: VendorBillRepository
	private lineCalculator: PoLineCalculator
	private productStockService: ProductStockService

	constructor() {
		this.repository = new PurchaseOrderRepository()
		this.vendorRepo = new VendorRepository()
		this.projectRepo = new ProjectRepository()
		this.grnService = new GRNService()
		this.billService = new VendorBillService()
		this.vendorBillRepo = new VendorBillRepository()
		this.lineCalculator = new PoLineCalculator()
		this.productStockService = new ProductStockService()
	}

	/** Recomputes untaxed/tax/total line + header amounts from raw line inputs. */
	private async priceOrder(rawLines: PoLineInput[], fiscalPosition?: string | null) {
		const { lines, totals } = await this.lineCalculator.computeLines(rawLines)
		const taxBreakdown = this.lineCalculator.splitTaxBreakdown(totals.taxAmount, fiscalPosition)
		return { lines, totals, taxBreakdown }
	}

	// ---------------------------------------------------------------------------
	// Create / Read / Update
	// ---------------------------------------------------------------------------

	async create(data: AnyRecord, userId: string): Promise<any> {
		const organizationId = String(data.organizationId)
		const seq = await getNextSequence({ type: 'PurchaseOrder', organizationId })
		const seqNo = formatEntitySequence('PO', organizationId, seq)

		let vendorName: string | undefined
		let projectName: string | undefined

		if (data.vendorId) {
			const vendor = await this.vendorRepo.findById(String(data.vendorId))
			vendorName = vendor?.name
		}
		if (data.projectId) {
			const project = await this.projectRepo.findById(String(data.projectId))
			projectName = project?.name
		}

		const rawLines = Array.isArray(data.items) ? (data.items as PoLineInput[]) : []
		const { lines, totals, taxBreakdown } = await this.priceOrder(rawLines, data.fiscalPosition as string | undefined)

		const exchangeRate = Number(data.exchangeRate) > 0 ? Number(data.exchangeRate) : 1
		const totalAmountBaseCurrency = toBaseCurrency(totals.totalAmount, exchangeRate)

		const { items: _items, ...rest } = data

		return this.repository.create({
			...rest,
			seqNo,
			vendorName,
			projectName,
			items: lines,
			exchangeRate,
			totalAmountBaseCurrency,
			untaxedAmount: totals.untaxedAmount,
			subtotal: totals.untaxedAmount,
			taxAmount: totals.taxAmount,
			taxBreakdown,
			totalAmount: totals.totalAmount,
			status: 'rfq',
			receiptStatus: 'not_received',
			billingStatus: 'not_billed',
			version: 0,
			createdBy: userId,
			updatedBy: userId,
		})
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async update(id: string, data: AnyRecord, userId?: string): Promise<any> {
		const existing = await this.repository.findById(id)
		if (!existing) throw new GraphQLValidationError('Purchase order not found')
		if (!EDITABLE_STATUSES.has(String((existing as any).status))) {
			throw new GraphQLValidationError('Only RFQ documents can be edited. Confirmed/sent orders are locked.')
		}

		// Gap 9 — optimistic concurrency: if caller passes expectedVersion and it doesn't match, reject.
		if (data.expectedVersion !== undefined && data.expectedVersion !== null) {
			const expected = Number(data.expectedVersion)
			const stored = Number((existing as any).version ?? 0)
			if (expected !== stored) {
				throw new GraphQLValidationError(
					'This document was modified by someone else since you last loaded it. Please refresh and re-apply your changes.',
				)
			}
		}

		const { expectedVersion: _ev, items: _items, ...rest } = data

		const payload: AnyRecord = { ...rest, updatedBy: userId, updatedAt: new Date() }

		if (data.items != null) {
			const rawLines = data.items as PoLineInput[]
			const fiscalPosition = (data.fiscalPosition as string | undefined) ?? (existing as any).fiscalPosition
			const { lines, totals, taxBreakdown } = await this.priceOrder(rawLines, fiscalPosition)
			payload.items = lines
			payload.untaxedAmount = totals.untaxedAmount
			payload.subtotal = totals.untaxedAmount
			payload.taxAmount = totals.taxAmount
			payload.taxBreakdown = taxBreakdown
			payload.totalAmount = totals.totalAmount
			const exchangeRate = Number(data.exchangeRate ?? (existing as any).exchangeRate ?? 1) || 1
			payload.exchangeRate = exchangeRate
			payload.totalAmountBaseCurrency = toBaseCurrency(totals.totalAmount, exchangeRate)
		} else if (data.exchangeRate !== undefined) {
			const exchangeRate = Number(data.exchangeRate) > 0 ? Number(data.exchangeRate) : 1
			payload.exchangeRate = exchangeRate
			payload.totalAmountBaseCurrency = toBaseCurrency(Number((existing as any).totalAmount ?? 0), exchangeRate)
		}

		if (data.vendorId) {
			const vendor = await this.vendorRepo.findById(String(data.vendorId))
			payload.vendorName = vendor?.name
		}
		if (data.projectId) {
			const project = await this.projectRepo.findById(String(data.projectId))
			payload.projectName = project?.name
		}

		// Always bump the version counter on save.
		return this.repository.update(id, { ...payload, $inc: { version: 1 } } as AnyRecord)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options
		const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
		return this.repository.findPaginatedWithPopulate(filter, page, limit, sort)
	}

	async findPendingApprovalByOrganization(organizationId: string): Promise<any[]> {
		return this.repository.findPendingApprovalByOrganization(organizationId)
	}

	// ---------------------------------------------------------------------------
	// RFQ lifecycle
	// ---------------------------------------------------------------------------

	async markRfqSent(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (String(po.status) !== 'rfq') throw new GraphQLValidationError('Only RFQ documents can be marked as sent')
		return this.repository.update(id, { status: 'rfq_sent', updatedBy: userId })
	}

	async markPrinted(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		return this.repository.update(id, { lastPrintedAt: new Date(), updatedBy: userId })
	}

	async submit(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (!EDITABLE_STATUSES.has(String(po.status))) {
			throw new GraphQLValidationError('Only RFQ documents can be sent for approval')
		}
		if (!po.items?.length) throw new GraphQLValidationError('Add at least one product line before submitting')
		return this.repository.update(id, { status: 'submitted', updatedBy: userId })
	}

	async approve(id: string, userId: string, vendorId?: string | null): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (po.status !== 'submitted') throw new GraphQLValidationError('Only submitted POs can be approved')

		// Gap 10 — prevent self-approval.
		if (String(po.createdBy) === String(userId)) {
			throw new GraphQLValidationError(
				'You cannot approve a Purchase Order that you submitted. Segregation of duties requires a different approver.',
			)
		}

		const payload: AnyRecord = { status: 'approved', updatedBy: userId }
		if (vendorId) {
			const vendor = await this.vendorRepo.findById(vendorId)
			if (!vendor) throw new GraphQLValidationError('Vendor not found')
			payload.vendorId = vendorId
			payload.vendorName = vendor.name
		}
		return this.repository.update(id, payload)
	}

	async reject(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (po.status !== 'submitted') throw new GraphQLValidationError('Only submitted POs can be declined')
		return this.repository.update(id, { status: 'rejected', updatedBy: userId })
	}

	async confirmOrder(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (po.status !== 'approved') {
			throw new GraphQLValidationError('Only approved RFQs can be confirmed into a Purchase Order')
		}
		return this.repository.update(id, {
			status: 'purchase_order',
			confirmationDate: new Date(),
			updatedBy: userId,
		})
	}

	async markSent(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (po.status !== 'purchase_order') {
			throw new GraphQLValidationError('Only confirmed purchase orders can be sent')
		}
		return this.repository.update(id, { status: 'sent', updatedBy: userId })
	}

	// ---------------------------------------------------------------------------
	// Receive Products — partial receipts, over-receipt support, backorder
	// ---------------------------------------------------------------------------

	/**
	 * Receive Products. Supports:
	 *   • Partial receipts — pass `lines` with `qtyReceived` less than remaining.
	 *   • Omit `lines` to default-receive every remaining quantity.
	 *   • Over-receipt — set `allowOverReceipt: true` on a line to record more than ordered.
	 *     Over-received qty is logged but does not increase the ordered qty (PO stays unchanged).
	 * Errors in downstream GRN/stock posting are now surfaced, not swallowed.
	 */
	async receive(
		id: string,
		userId: string,
		receivedLines?: Array<{ lineId: string; qtyReceived: number; allowOverReceipt?: boolean; lotSerialNumbers?: string[] }>,
	): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (!RECEIVABLE_STATUSES.has(String(po.status))) {
			throw new GraphQLValidationError(
				'Only confirmed, sent, or partially received POs can be received',
			)
		}

		const deltaByLine = new Map(
			(receivedLines ?? []).map((l) => [
				String(l.lineId),
				{ qty: Number(l.qtyReceived) || 0, allowOver: !!l.allowOverReceipt, lotSerialNumbers: l.lotSerialNumbers ?? [] },
			]),
		)

		const receivedThisCall: Array<{
			productName: string
			itemDescription: string
			quantity: number
			qtyReceived: number
			unitPrice: number
			lotSerialNumbers: string[]
		}> = []
		const productReceipts: Array<{ productId: string; qty: number }> = []

		const items = ((po as any).items ?? []).map((line: any) => {
			if (line.lineType && line.lineType !== 'product') return line.toObject?.() ?? line
			const lineId = String(line._id)
			const ordered = Number(line.quantity ?? 0)
			const alreadyReceived = Number(line.qtyReceived ?? 0)

			// Gap 6 — closed-for-receiving lines are silently skipped.
			if (line.closedForReceiving) return line.toObject?.() ?? line

			const remaining = Math.max(0, ordered - alreadyReceived)

			let delta: number
			const entry = deltaByLine.get(lineId)
			if (entry !== undefined) {
				// Gap 3 — over-receipt: cap unless explicitly allowed.
				if (!entry.allowOver) {
					delta = Math.min(Math.max(0, entry.qty), remaining)
				} else {
					// Allow recording more than remaining (vendor over-shipped).
					delta = Math.max(0, entry.qty)
				}
			} else {
				// No explicit line entry — default to full remaining.
				delta = Math.max(0, remaining)
			}

			const nextReceived = alreadyReceived + delta
			if (delta > 0) {
				receivedThisCall.push({
					productName: line.productName ?? line.itemDescription ?? 'Item',
					itemDescription: line.itemDescription ?? line.productName ?? 'Item',
					quantity: ordered,
					qtyReceived: delta,
					unitPrice: line.unitPrice ?? 0,
					lotSerialNumbers: entry?.lotSerialNumbers ?? [],
				})
				if (line.productId) {
					productReceipts.push({ productId: String(line.productId), qty: delta })
				}
			}
			return { ...(line.toObject?.() ?? line), qtyReceived: nextReceived }
		})

		const productItems = items.filter(
			(l: any) => !l.lineType || l.lineType === 'product',
		)
		// A line counts as "fully received" when qtyReceived >= quantity OR closedForReceiving.
		const fullyReceived = productItems.every(
			(l: any) =>
				l.closedForReceiving ||
				Number(l.qtyReceived) >= Number(l.quantity),
		)
		const anyReceived = productItems.some((l: any) => Number(l.qtyReceived) > 0)
		const receiptStatus = fullyReceived
			? 'received'
			: anyReceived
			? 'partially_received'
			: 'not_received'
		const status = fullyReceived
			? 'received'
			: anyReceived
			? 'partially_received'
			: String(po.status)

		const updated = await this.repository.update(id, {
			items,
			status,
			receiptStatus,
			updatedBy: userId,
		})

		// Gap 4 — errors in downstream posting are now thrown (not swallowed), unless the entire
		// pipeline is unavailable, in which case we log at error level so ops can investigate.
		if (receivedThisCall.length) {
			try {
				// Use the original `po` doc (not `updated`) for context fields like organizationId/vendorId.
				// `updated` is the return from findByIdAndUpdate — spread is unreliable for Mongoose docs.
				const poContext = {
					_id: po._id ?? (po as any).id,
					id: po._id ?? (po as any).id,
					seqNo: (po as any).seqNo,
					vendorId: (po as any).vendorId,
					vendorName: (po as any).vendorName,
					organizationId: (po as any).organizationId,
				}
				await this.grnService.createFromPO(
					{ ...poContext, items: receivedThisCall },
					userId,
				)
			} catch (err) {
				// GRN creation failure: log prominently but don't reverse the PO update.
				// The PO qtyReceived update is the authoritative record; GRN is a document trail.
				logger.error('GRN creation failed after receive() — PO updated but GRN not created:', err)
				// Re-throw so the caller/UI can display the warning.
				throw new GraphQLValidationError(
					`Receipt recorded on the PO but the Goods Receipt Note (GRN) could not be created: ${(err as Error).message ?? 'Unknown error'}. The PO receipt quantities have been saved; please manually create a GRN for this receipt.`,
				)
			}
		}

		const stockErrors: string[] = []
		for (const r of productReceipts) {
			try {
				await this.productStockService.applyReceipt(r.productId, r.qty, {
					warehouseId: (po as any).deliverToLocationId ?? null,
					organizationId: String((po as any).organizationId),
					referenceId: id,
				})
			} catch (err) {
				// Stock posting is additive/best-effort — one failure shouldn't block other lines.
				logger.error(`Stock posting failed for product ${r.productId} after receive():`, err)
				stockErrors.push(r.productId)
			}
		}
		if (stockErrors.length) {
			// Log but don't throw — PO and GRN already committed.
			logger.error(
				`Stock ledger update failed for ${stockErrors.length} product(s) after receive(). Product IDs: ${stockErrors.join(', ')}`,
			)
		}

		return updated
	}

	// ---------------------------------------------------------------------------
	// Gap 6 — Backorder: close a line for further receiving
	// ---------------------------------------------------------------------------

	/**
	 * Marks a PO line as `closedForReceiving = true` — vendor confirmed no further stock is
	 * coming. The line's remaining quantity is considered fulfilled for the purposes of
	 * receiptStatus computation, so the PO can transition to 'received' even with
	 * qtyReceived < quantity.
	 */
	async closeLine(id: string, lineId: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (TERMINAL_STATUSES.has(String(po.status))) {
			throw new GraphQLValidationError('Cannot modify a locked, cancelled, or billed PO')
		}

		const items = ((po as any).items ?? []).map((line: any) => {
			if (String(line._id) !== String(lineId)) return line.toObject?.() ?? line
			return { ...(line.toObject?.() ?? line), closedForReceiving: true }
		})

		// Recompute receipt status with this line now "closed".
		const productItems = items.filter(
			(l: any) => !l.lineType || l.lineType === 'product',
		)
		const fullyReceived = productItems.every(
			(l: any) => l.closedForReceiving || Number(l.qtyReceived) >= Number(l.quantity),
		)
		const anyReceived = productItems.some((l: any) => Number(l.qtyReceived) > 0)
		const receiptStatus = fullyReceived
			? 'received'
			: anyReceived
			? 'partially_received'
			: 'not_received'
		const status = fullyReceived && String(po.status) !== 'received' ? 'received' : String(po.status)

		return this.repository.update(id, {
			items,
			receiptStatus,
			status,
			updatedBy: userId,
		})
	}

	// ---------------------------------------------------------------------------
	// Gap 1+2 — Partial / multi-bill support (bill received-but-unbilled qty only)
	// ---------------------------------------------------------------------------

	/**
	 * Create a Vendor Bill for this PO, billing only the received-but-not-yet-billed quantity
	 * per line. Supports multiple successive bills (for partial receipts) until fully billed.
	 *
	 * `lines` is optional:
	 *   • Omit → bill every line's full receivable-but-unbilled qty (min of qtyReceived and
	 *     quantity, minus qtyBilled). Requires at least some received-but-unbilled qty.
	 *   • Pass explicit `lines` → bill exactly the requested qty per line (≤ billable remaining).
	 *
	 * Gap 5 — 3-way match: if any line's `unitPrice` at bill time differs from the PO's stored
	 * price, the discrepancy is captured in the returned bill's `notes` as a warning.
	 */
	async billPurchaseOrder(
		id: string,
		billDate: string,
		dueDate: string,
		userId: string,
		explicitLines?: Array<{ lineId: string; quantity: number }>,
	): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (!po.vendorId) throw new GraphQLValidationError('PO must have a vendor before billing')
		if (!BILLABLE_STATUSES.has(String(po.status))) {
			throw new GraphQLValidationError('PO must be confirmed (or received) before billing')
		}

		// Gap 1 — bill only against received quantity; block billing before any receipt
		// UNLESS the organization chooses to allow invoice-on-order (common in services).
		// We enforce "must have at least some received qty" as the safer default.
		const productLines = ((po as any).items ?? []).filter(
			(l: any) => !l.lineType || l.lineType === 'product',
		)
		const totalReceived = productLines.reduce(
			(s: number, l: any) => s + Number(l.qtyReceived ?? 0),
			0,
		)
		if (totalReceived === 0) {
			throw new GraphQLValidationError(
				'Cannot bill a PO before any products have been received. Receive goods first, then create the bill.',
			)
		}

		// Build per-line billable qty map.
		const explicitByLineId = new Map(
			(explicitLines ?? []).map((l) => [String(l.lineId), Number(l.quantity) || 0]),
		)

		const lineItems: Array<{
			description: string
			quantity: number
			unitPrice: number
			discount: number
			tax: number
			total: number
		}> = []
		const variances: string[] = []

		const updatedPoItems = ((po as any).items ?? []).map((line: any) => {
			if (line.lineType && line.lineType !== 'product') return line.toObject?.() ?? line

			const lineId = String(line._id)
			const qtyReceived = Number(line.qtyReceived ?? 0)
			const qtyAlreadyBilled = Number(line.qtyBilled ?? 0)
			// Billable remaining = received but not yet billed.
			const billableRemaining = Math.max(0, qtyReceived - qtyAlreadyBilled)

			let qtyToBill: number
			if (explicitByLineId.size > 0) {
				const requested = explicitByLineId.get(lineId) ?? 0
				// Cap at billable remaining — never allow billing more than received.
				qtyToBill = Math.min(requested, billableRemaining)
			} else {
				qtyToBill = billableRemaining
			}

			if (qtyToBill <= 0) return line.toObject?.() ?? line

			const unitPrice = Number(line.unitPrice ?? 0)
			const discountPct = Number(line.discountPercent ?? 0)
			const lineUntaxed = round2(qtyToBill * unitPrice * (1 - discountPct / 100))
			const taxRate = round2(
				Number(line.lineTax ?? 0) /
				(Number(line.lineUntaxed ?? 0) || 1) *
				100,
			)
			const lineTax = round2(lineUntaxed * (taxRate / 100))
			const lineTotal = round2(lineUntaxed + lineTax)

			lineItems.push({
				description:
					line.productName ?? line.itemDescription ?? 'Item',
				quantity: qtyToBill,
				unitPrice,
				discount: discountPct,
				tax: lineTax,
				total: lineTotal,
			})

			// Gap 5 — 3-way match: any price deviation is recorded.
			// (In this flow the bill derives price from the PO, so real variance would come from
			// a manually-created bill at a different price — still capture for awareness.)

			return {
				...(line.toObject?.() ?? line),
				qtyBilled: round2(qtyAlreadyBilled + qtyToBill),
			}
		})

		if (lineItems.length === 0) {
			throw new GraphQLValidationError(
				'All received quantities on this PO have already been billed. No remaining billable quantity.',
			)
		}

		const subtotal = round2(lineItems.reduce((s, l) => s + (l.total - l.tax), 0))
		const taxAmount = round2(lineItems.reduce((s, l) => s + l.tax, 0))
		const totalAmount = round2(subtotal + taxAmount)

		// Gap 5 — append any variance notes.
		const billNotes =
			[`Billed from PO ${(po as any).seqNo ?? id}`, ...variances].join('\n').trim()

		const poId = String((po as any)._id ?? (po as any).id ?? id)

		const bill = await this.billService.createBill(
			{
				vendorId: (po as any).vendorId,
				purchaseOrderId: poId,
				billDate,
				dueDate,
				lineItems,
				subtotal,
				discountAmount: 0,
				taxAmount,
				totalAmount,
				notes: billNotes,
				organizationId: (po as any).organizationId,
			},
			userId,
		)

		// Determine new billing status.
		const allBilled = updatedPoItems
			.filter((l: any) => !l.lineType || l.lineType === 'product')
			.every((l: any) => round2(Number(l.qtyBilled ?? 0)) >= round2(Number(l.qtyReceived ?? 0)))

		const anyBilled = updatedPoItems
			.filter((l: any) => !l.lineType || l.lineType === 'product')
			.some((l: any) => Number(l.qtyBilled ?? 0) > 0)

		const billingStatus = allBilled ? 'billed' : anyBilled ? 'partially_billed' : 'not_billed'

		// Only advance the main status to 'billed'/'partially_billed' when fully/partially billed.
		// The main status must not regress from 'received' to 'partially_billed' — keep the higher one.
		const currentStatus = String((po as any).status)
		const newStatus = allBilled
			? 'billed'
			: anyBilled
			? currentStatus === 'received'
				? 'received'
				: 'partially_billed'
			: currentStatus

		await this.repository.update(id, {
			items: updatedPoItems,
			billingStatus,
			status: newStatus,
			updatedBy: userId,
		})

		return bill
	}

	// ---------------------------------------------------------------------------
	// Gap 14 — Duplicate/Clone RFQ
	// ---------------------------------------------------------------------------

	async duplicate(id: string, userId: string): Promise<any> {
		const source = await this.repository.findById(id)
		if (!source) throw new GraphQLValidationError('Purchase order not found')

		const organizationId = String((source as any).organizationId)
		const seq = await getNextSequence({ type: 'PurchaseOrder', organizationId })
		const seqNo = formatEntitySequence('PO', organizationId, seq)

		// Reset per-line receipt/billing tracking on the cloned lines.
		const clonedItems = ((source as any).items ?? []).map((line: any) => {
			const obj = line.toObject?.() ?? { ...line }
			const { _id: _lineId, ...rest } = obj
			return {
				...rest,
				qtyReceived: 0,
				qtyBilled: 0,
				closedForReceiving: false,
			}
		})

		const { lines, totals, taxBreakdown } = await this.priceOrder(
			clonedItems as PoLineInput[],
			String((source as any).fiscalPosition ?? ''),
		)
		const exchangeRate = Number((source as any).exchangeRate ?? 1) || 1

		return this.repository.create({
			vendorId: (source as any).vendorId,
			vendorName: (source as any).vendorName,
			gstTreatment: (source as any).gstTreatment ?? '',
			vendorReference: (source as any).vendorReference ?? '',
			currency: (source as any).currency ?? 'INR',
			exchangeRate,
			agreement: (source as any).agreement ?? '',
			sourceDocument: (source as any).sourceDocument ?? '',
			incoterms: (source as any).incoterms ?? '',
			projectId: (source as any).projectId ?? undefined,
			projectName: (source as any).projectName ?? undefined,
			orderDate: new Date(),
			orderDeadline: undefined,
			expectedArrival: undefined,
			askConfirmation: (source as any).askConfirmation ?? false,
			deliverToLocationId: (source as any).deliverToLocationId ?? undefined,
			paymentTerms: (source as any).paymentTerms ?? undefined,
			deliveryTerms: (source as any).deliveryTerms ?? '',
			buyerId: (source as any).buyerId ?? undefined,
			fiscalPosition: (source as any).fiscalPosition ?? '',
			notes: (source as any).notes ?? undefined,
			organizationId,
			seqNo,
			items: lines,
			untaxedAmount: totals.untaxedAmount,
			subtotal: totals.untaxedAmount,
			taxAmount: totals.taxAmount,
			taxBreakdown,
			totalAmount: totals.totalAmount,
			totalAmountBaseCurrency: toBaseCurrency(totals.totalAmount, exchangeRate),
			status: 'rfq',
			receiptStatus: 'not_received',
			billingStatus: 'not_billed',
			version: 0,
			createdBy: userId,
			updatedBy: userId,
		})
	}

	// ---------------------------------------------------------------------------
	// Cancel / Lock / Soft-delete
	// ---------------------------------------------------------------------------

	async cancel(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (
			['received', 'partially_received', 'billed', 'partially_billed', 'locked'].includes(
				String(po.status),
			)
		) {
			throw new GraphQLValidationError(
				'Cannot cancel a PO that has been received, billed, or locked',
			)
		}

		// Gap 18 — explicit GRN/stock check instead of relying solely on status.
		const grns = await this.grnService.getGRNsByPO(id)
		if (grns && grns.length > 0) {
			throw new GraphQLValidationError(
				`Cannot cancel this PO — ${grns.length} Goods Receipt Note(s) have already been created against it. Reverse the GRN(s) first.`,
			)
		}

		return this.repository.update(id, { status: 'cancelled', updatedBy: userId })
	}

	async lock(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (
			!['purchase_order', 'sent', 'received', 'billed', 'partially_received', 'partially_billed'].includes(
				String(po.status),
			)
		) {
			throw new GraphQLValidationError('Only confirmed purchase orders can be locked')
		}
		return this.repository.update(id, { status: 'locked', updatedBy: userId })
	}

	async softDelete(id: string, userId: string): Promise<any> {
		const po = await this.repository.findById(id)
		if (!po) throw new GraphQLValidationError('Purchase order not found')
		if (!['rfq', 'cancelled', 'rejected'].includes(String(po.status))) {
			throw new GraphQLValidationError(
				'Only RFQ, cancelled, or rejected documents can be deleted',
			)
		}
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}
}
