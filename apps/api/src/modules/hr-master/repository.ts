import { MongoBaseRepository } from '../base/mongo-repository'
import { HrMaster } from './model'

export class HrMasterRepository extends MongoBaseRepository<any> {
	constructor() {
		super(HrMaster)
	}

	async list(
		organizationId: string,
		kind: string,
		filters: { active?: boolean; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, kind, deletedAt: null }
		if (typeof filters.active === 'boolean') q.active = filters.active
		if (filters.search) {
			q.$or = [
				{ code: { $regex: filters.search, $options: 'i' } },
				{ name: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ sortOrder: 1, name: 1 }).exec()
	}
}
