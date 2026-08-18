import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { ProductCategory } from './model'

interface IProductCategoryDocument extends IBaseEntity {
	name: string
	parentId?: unknown
	fullPath?: string
	isActive: boolean
	organizationId: unknown
}

export class ProductCategoryRepository extends MongoBaseRepository<IProductCategoryDocument> {
	constructor() {
		super(ProductCategory as any)
	}

	async listForOrganization(organizationId: string, isActive?: boolean) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (isActive != null) q.isActive = isActive
		return this.model.find(q).sort({ fullPath: 1, name: 1 }).limit(1000).exec()
	}

	async findChildren(parentId: string) {
		return this.model.find({ parentId, deletedAt: null }).exec()
	}
}
