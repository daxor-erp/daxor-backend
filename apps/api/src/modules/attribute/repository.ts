import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Attribute } from './model'

interface IAttributeDocument extends IBaseEntity {
	name: string
	values: Array<{ _id: unknown; value: string }>
	isActive: boolean
	organizationId: unknown
}

export class AttributeRepository extends MongoBaseRepository<IAttributeDocument> {
	constructor() {
		super(Attribute as any)
	}

	async listForOrganization(organizationId: string, isActive?: boolean) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (isActive != null) q.isActive = isActive
		return this.model.find(q).sort({ name: 1 }).limit(500).exec()
	}
}
