import { MongoBaseRepository } from '../base/mongo-repository'
import { StockTransfer } from './model'

export class StockTransferRepository extends MongoBaseRepository<any> {
  constructor() {
    super(StockTransfer as any)
  }

  async findByOrg(organizationId: string, page = 1, limit = 100) {
    return this.findPaginated({ organizationId, deletedAt: null }, page, limit, { createdAt: -1 })
  }
}
