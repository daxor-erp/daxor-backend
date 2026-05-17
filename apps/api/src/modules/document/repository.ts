import { MongoBaseRepository } from '../base/mongo-repository'
import { Document } from './model'

export class DocumentRepository extends MongoBaseRepository<any> {
	constructor() {
		super(Document)
	}

	async listForParent(parentModule: string, parentId: string): Promise<any[]> {
		return this.model
			.find({ parentModule, parentId, deletedAt: null })
			.sort({ createdAt: -1 })
			.exec()
	}

	async listForOrganization(organizationId: string, parentModule?: string): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (parentModule) q.parentModule = parentModule
		return this.model.find(q).sort({ createdAt: -1 }).limit(500).exec()
	}
}
