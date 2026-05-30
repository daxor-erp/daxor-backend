import { MongoBaseRepository } from '../base/mongo-repository'
import { VendorDebitNote } from './model'

export class VendorDebitNoteRepository extends MongoBaseRepository<any> {
  constructor() {
    super(VendorDebitNote as any)
  }

  async findByOrganization(organizationId: string, filter: Record<string, unknown> = {}) {
    return this.model
      .find({ organizationId, deletedAt: null, ...filter })
      .populate('vendorId', 'id name email')
      .sort({ createdAt: -1 })
  }

  async findByPurchaseOrderId(purchaseOrderId: string) {
    return this.model.find({ purchaseOrderId, deletedAt: null })
  }
}
