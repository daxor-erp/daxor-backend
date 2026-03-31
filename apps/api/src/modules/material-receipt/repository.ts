import { MongoBaseRepository } from '../base/mongo-repository'
import { MaterialReceipt } from './model'

export class MaterialReceiptRepository extends MongoBaseRepository<any> {
  constructor() {
    super(MaterialReceipt as any)
  }

  async findByOrganization(organizationId: string, page = 1, limit = 100, status?: string) {
    const filter: any = { organizationId, deletedAt: null }
    if (status) filter.status = status
    return this.findPaginated(filter, page, limit, { createdAt: -1 })
  }

  async findByPO(purchaseOrderId: string) {
    return this.model.find({ purchaseOrderId, deletedAt: null }).sort({ createdAt: -1 })
  }
}
