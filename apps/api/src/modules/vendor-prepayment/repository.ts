import { MongoBaseRepository } from '../base/mongo-repository'
import { VendorPrepayment } from './model'

export class VendorPrepaymentRepository extends MongoBaseRepository<any> {
  constructor() { super(VendorPrepayment as any) }

  async findByOrganization(organizationId: string, filter: any = {}) {
    return this.model.find({ organizationId, deletedAt: null, ...filter })
      .populate('vendorId', 'id name email').sort({ prepaymentDate: -1 })
  }

  async findAvailable(organizationId: string, vendorId: string) {
    return this.model.find({ organizationId, vendorId, status: 'open', deletedAt: null })
      .populate('vendorId', 'id name email')
  }
}
