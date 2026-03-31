import { MongoBaseRepository } from '../base/mongo-repository'
import { GRN } from './model'

export class GRNRepository extends MongoBaseRepository<any> {
  constructor() { super(GRN as any) }

  async findByOrganization(organizationId: string, page = 1, limit = 100) {
    return this.findPaginated({ organizationId, deletedAt: null }, page, limit, { createdAt: -1 })
  }

  async findByPO(purchaseOrderId: string) {
    return this.model.find({ purchaseOrderId, deletedAt: null }).sort({ createdAt: -1 })
  }
}
