import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Uom } from './model'

interface IUomDocument extends IBaseEntity {
	name: string
	category: string
	ratio: number
	type: string
	gstUqc?: string
	isActive: boolean
	organizationId: unknown
}

export class UomRepository extends MongoBaseRepository<IUomDocument> {
	constructor() {
		super(Uom as any)
	}

	async listForOrganization(organizationId: string, filters: { category?: string; isActive?: boolean } = {}) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.category) q.category = filters.category
		if (filters.isActive != null) q.isActive = filters.isActive
		return this.model.find(q).sort({ category: 1, name: 1 }).limit(500).exec()
	}
}
