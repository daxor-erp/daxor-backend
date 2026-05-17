import { MongoBaseRepository } from '../base/mongo-repository'
import { BillOfMaterials } from './model'

export class BOMRepository extends MongoBaseRepository<any> {
	constructor() {
		super(BillOfMaterials)
	}

	async list(
		organizationId: string,
		filters: { status?: string; parentItemId?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.parentItemId) q.parentItemId = filters.parentItemId
		if (filters.search) {
			q.$or = [
				{ bomCode: { $regex: filters.search, $options: 'i' } },
				{ parentItemName: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ createdAt: -1 }).exec()
	}
}
