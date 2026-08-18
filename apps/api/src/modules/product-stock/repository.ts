import { MongoBaseRepository } from '../base/mongo-repository'
import { ProductStock, ProductStockMovement } from './model'

export class ProductStockRepository extends MongoBaseRepository<any> {
	constructor() {
		super(ProductStock)
	}

	async findByProductAndWarehouse(productId: string, warehouseId?: string | null) {
		return this.model.findOne({ productId, warehouseId: warehouseId ?? null }).exec()
	}

	async findByProduct(productId: string) {
		return this.model.find({ productId }).exec()
	}

	async sumOnHandForProduct(productId: string): Promise<number> {
		const rows = await this.model.find({ productId }).exec()
		return rows.reduce((s, r: any) => s + (r.onHandQty ?? 0), 0)
	}
}

export class ProductStockMovementRepository extends MongoBaseRepository<any> {
	constructor() {
		super(ProductStockMovement)
	}

	async findByProduct(productId: string, limit = 50) {
		return this.model.find({ productId }).sort({ createdAt: -1 }).limit(limit).exec()
	}
}
