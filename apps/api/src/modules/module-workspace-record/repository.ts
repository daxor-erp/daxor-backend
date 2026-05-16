import { MongoBaseRepository } from '../base/mongo-repository'
import { ModuleWorkspaceRecord } from './model'

export class ModuleWorkspaceRecordRepository extends MongoBaseRepository<any> {
	constructor() {
		super(ModuleWorkspaceRecord as any)
	}

	async findByOrganizationAndRoute(
		organizationId: string,
		routePath: string,
		limit = 100,
	): Promise<any[]> {
		return this.model
			.find({
				organizationId,
				routePath,
				deletedAt: null,
			})
			.sort({ createdAt: -1 })
			.limit(limit)
			.lean()
			.exec()
	}
}
