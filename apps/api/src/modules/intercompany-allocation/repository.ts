import { MongoBaseRepository } from '../base/mongo-repository'
import { IntercompanyAllocation } from './model'

export class IntercompanyAllocationRepository extends MongoBaseRepository<any> {
	constructor() {
		super(IntercompanyAllocation)
	}

	async list(
		organizationId: string,
		filters: { status?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.search) {
			q.$or = [
				{ scheduleCode: { $regex: filters.search, $options: 'i' } },
				{ name: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ createdAt: -1 }).limit(500).exec()
	}
}
