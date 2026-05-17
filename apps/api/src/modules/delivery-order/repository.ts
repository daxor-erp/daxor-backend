import { MongoBaseRepository } from '../base/mongo-repository'
import { DeliveryOrder } from './model'

export class DeliveryOrderRepository extends MongoBaseRepository<any> {
	constructor() {
		super(DeliveryOrder)
	}

	async list(
		organizationId: string,
		filters: { status?: string; customerId?: string; salesOrderId?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.customerId) q.customerId = filters.customerId
		if (filters.salesOrderId) q.salesOrderId = filters.salesOrderId
		if (filters.search) {
			q.$or = [
				{ docNumber: { $regex: filters.search, $options: 'i' } },
				{ customerName: { $regex: filters.search, $options: 'i' } },
				{ trackingNumber: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ deliveryDate: -1, createdAt: -1 }).limit(500).exec()
	}
}
