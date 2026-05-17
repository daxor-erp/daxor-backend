import { GraphQLValidationError } from '@repo/errors'
import { DeliveryOrderRepository } from './repository'

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

	async transitionStatus(id: string, status: string, signedBy?: string): Promise<any> {
		const patch: Record<string, unknown> = { status }
		const upper = status.toUpperCase()
		if (upper === 'DISPATCHED') patch.dispatchedAt = new Date()
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
