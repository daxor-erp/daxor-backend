import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { ProductVariant } from './model'

interface IProductVariantDocument extends IBaseEntity {
	productId: unknown
	displayName: string
	organizationId: unknown
}

export class ProductVariantRepository extends MongoBaseRepository<IProductVariantDocument> {
	constructor() {
		super(ProductVariant as any)
	}

	async findByProduct(productId: string) {
		return this.model.find({ productId, deletedAt: null }).exec()
	}

	async deleteAllForProduct(productId: string) {
		return this.model.updateMany({ productId, deletedAt: null }, { deletedAt: new Date() }).exec()
	}
}
