import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Product } from './model'

interface IProductDocument extends IBaseEntity {
	seqNo?: string
	name: string
	internalReference?: string
	canBeSold: boolean
	canBePurchased: boolean
	organizationId: unknown
	status: string
}

export class ProductRepository extends MongoBaseRepository<IProductDocument> {
	constructor() {
		super(Product as any)
	}

	async findByOrganization(organizationId: string, filters: { search?: string; categoryId?: string; canBePurchased?: boolean; canBeSold?: boolean; status?: string } = {}) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.categoryId) q.categoryId = filters.categoryId
		if (filters.canBePurchased != null) q.canBePurchased = filters.canBePurchased
		if (filters.canBeSold != null) q.canBeSold = filters.canBeSold
		if (filters.status) q.status = filters.status
		if (filters.search?.trim()) {
			q.$or = [
				{ name: { $regex: filters.search.trim(), $options: 'i' } },
				{ internalReference: { $regex: filters.search.trim(), $options: 'i' } },
				{ barcode: { $regex: filters.search.trim(), $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ name: 1 }).limit(500).exec()
	}

	async findByInternalReference(internalReference: string, organizationId: string) {
		return this.model.findOne({ internalReference, organizationId, deletedAt: null })
	}
}
