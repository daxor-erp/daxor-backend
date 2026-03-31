import { MongoBaseRepository } from '../base/mongo-repository'
import { PurchaseOrder } from './model'

export class PurchaseOrderRepository extends MongoBaseRepository<any> {
  constructor() {
    super(PurchaseOrder)
  }

  async findPaginatedWithPopulate(filter: any, page: number, limit: number, sort: any) {
    const skip = (page - 1) * limit
    const query = { ...filter, deletedAt: null }
    const data = await this.model
      .find(query)
      .populate('vendorId', 'id name email phone')
      .populate('projectId', 'id name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()
    const total = await this.model.countDocuments(query).exec()
    return { data, total, page, pages: Math.ceil(total / limit) }
  }
}
