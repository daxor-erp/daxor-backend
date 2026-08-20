import { GraphQLValidationError } from '@repo/errors'
import { DeliveryOrderRepository } from './repository'
import { InventoryControlService } from '../inventory-control/service'
import { accountingPosting } from '../../lib/accounting-posting'
import { SalesOrder } from '../sales-order/model'

const inventoryService = new InventoryControlService()

export interface DeliveryItemInput {
	itemId?: string | null
	itemName: string
	quantity: number
	unit?: string
	notes?: string
}

export interface DeliveryOrderInput {
	organizationId: string
	docNumber: string
	salesOrderId?: string | null
	customerId?: string | null
	customerName?: string
	deliveryDate: string | Date
	expectedArrival?: string | Date | null
	shippingAddress?: string
	carrier?: string
	trackingNumber?: string
	vehicleNumber?: string
	driverName?: string
	driverPhone?: string
	items: DeliveryItemInput[]
	notes?: string
	status?: string
}

export class DeliveryOrderService {
	private repository: DeliveryOrderRepository

	constructor() {
		this.repository = new DeliveryOrderRepository()
	}

	async create(input: DeliveryOrderInput): Promise<any> {
		this.validate(input)
		const totalQuantity = (input.items ?? []).reduce((s, i) => s + Number(i.quantity ?? 0), 0)
		return this.repository.create({
			...input,
			docNumber: input.docNumber.trim().toUpperCase(),
			items: (input.items ?? []).map((i) => ({
				...i,
				unit: i.unit ?? 'unit',
				quantity: Number(i.quantity),
			})),
			totalQuantity,
			status: input.status ?? 'DRAFT',
		})
	}

	async update(id: string, input: Partial<DeliveryOrderInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.docNumber) patch.docNumber = input.docNumber.trim().toUpperCase()
		if (Array.isArray(input.items)) {
			patch.totalQuantity = input.items.reduce((s, i) => s + Number(i.quantity ?? 0), 0)
		}
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: any = {}) {
		return this.repository.list(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	async cancel(id: string, userId = 'system'): Promise<any> {
		const doc = await this.repository.findById(id)
		if (!doc) throw new GraphQLValidationError('Delivery order not found')
		const st = String((doc as any).status ?? '').toUpperCase()
		if (st === 'DELIVERED') throw new GraphQLValidationError('Cannot cancel a delivery that has already been delivered')
		if (st === 'CANCELLED') throw new GraphQLValidationError('Delivery order is already cancelled')

		// If already dispatched, reverse the inventory deduction
		if (st === 'DISPATCHED') {
			const orgId = String((doc as any).organizationId ?? '')
			const items: any[] = (doc as any).items ?? []
			if (orgId && items.length > 0) {
				await inventoryService.applyReceiptLines({
					organizationId: orgId,
					userId,
					referenceModule: 'delivery_order_cancel',
					referenceId: id,
					lines: items.map((i: any) => ({
						itemId: i.itemId ? String(i.itemId) : undefined,
						itemDescription: String(i.itemName ?? 'Item'),
						quantity: Number(i.quantity ?? 0),
						unit: i.unit,
					})),
					direction: 'in', // reversal: stock comes back in
				})
				// Reverse SO delivered quantity if linked
				const salesOrderId = (doc as any).salesOrderId
				if (salesOrderId) {
					const totalDispatched = items.reduce((s: number, i: any) => s + Number(i.quantity ?? 0), 0)
					await SalesOrder.findByIdAndUpdate(salesOrderId, {
						$inc: { deliveredQuantity: -totalDispatched },
					}).exec()
				}
			}
		}

		return this.repository.update(id, { status: 'CANCELLED', cancelledAt: new Date(), cancelledBy: userId } as any)
	}

	async transitionStatus(id: string, status: string, signedBy?: string, userId = 'system'): Promise<any> {
		const doc = await this.repository.findById(id)
		if (!doc) throw new GraphQLValidationError('Delivery order not found')

		const patch: Record<string, unknown> = { status }
		const upper = status.toUpperCase()

		if (upper === 'DISPATCHED') {
			patch.dispatchedAt = new Date()

			// Odoo flow: Validate delivery → stock deducted immediately.
			// Deduct each item line from inventory-control at the source warehouse.
			const orgId = String(doc.organizationId ?? '')
			const items: any[] = (doc as any).items ?? []
			if (orgId && items.length > 0) {
				await inventoryService.applyReceiptLines({
					organizationId: orgId,
					userId,
					referenceModule: 'delivery_order',
					referenceId: id,
					lines: items.map((i: any) => ({
						itemId: i.itemId ? String(i.itemId) : undefined,
						itemDescription: String(i.itemName ?? 'Item'),
						quantity: Number(i.quantity ?? 0),
						unit: i.unit,
					})),
					direction: 'out',
				})

				// Post COGS journal entry: Dr COGS / Cr Inventory
				await accountingPosting.postDeliveryOrderDispatch(doc, userId)

				// Update the linked Sales Order's deliveredQuantity for invoicing policy enforcement.
				const salesOrderId = (doc as any).salesOrderId
				if (salesOrderId) {
					const totalDispatched = items.reduce((s: number, i: any) => s + Number(i.quantity ?? 0), 0)
					await SalesOrder.findByIdAndUpdate(salesOrderId, {
						$inc: { deliveredQuantity: totalDispatched },
					}).exec()
				}
			}
		}

		if (upper === 'DELIVERED') {
			patch.deliveredAt = new Date()
			patch.actualArrival = new Date()
			if (signedBy) {
				patch.signedBy = signedBy
				patch.signedAt = new Date()
			}
		}

		return this.repository.update(id, patch as any)
	}

	private validate(input: DeliveryOrderInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.docNumber?.trim()) throw new GraphQLValidationError('Doc number is required')
		if (!input.deliveryDate) throw new GraphQLValidationError('Delivery date is required')
		if (!Array.isArray(input.items) || input.items.length === 0) {
			throw new GraphQLValidationError('At least one delivery item is required')
		}
		for (const it of input.items) {
			if (!it.itemName?.trim()) throw new GraphQLValidationError('Each item needs a name')
			if (!Number.isFinite(it.quantity) || it.quantity <= 0) {
				throw new GraphQLValidationError(`Quantity must be > 0 for ${it.itemName}`)
			}
		}
	}
}
