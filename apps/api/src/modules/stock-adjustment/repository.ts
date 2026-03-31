import { MongoBaseRepository } from '../base/mongo-repository'
import { StockAdjustment } from './model'

export class StockAdjustmentRepository extends MongoBaseRepository<any> {
  constructor() {
    super(StockAdjustment as any)
  }

  async findByOrg(organizationId: string, page = 1, limit = 100) {
    return this.findPaginated({ organizationId, deletedAt: null }, page, limit, { createdAt: -1 })
  }
}
