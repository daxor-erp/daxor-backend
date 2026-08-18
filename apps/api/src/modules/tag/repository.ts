import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Tag } from './model'

interface ITagDocument extends IBaseEntity {
	name: string
	color?: string
	category?: string
	isActive: boolean
	organizationId: unknown
}

export class TagRepository extends MongoBaseRepository<ITagDocument> {
	constructor() {
		super(Tag as any)
	}

	async listForOrganization(
		organizationId: string,
		filters: { search?: string; category?: string; isActive?: boolean } = {},
	) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.category) q.category = filters.category
		if (filters.isActive != null) q.isActive = filters.isActive
		if (filters.search?.trim()) q.name = { $regex: filters.search.trim(), $options: 'i' }
		return this.model.find(q).sort({ name: 1 }).limit(500).exec()
	}
}
