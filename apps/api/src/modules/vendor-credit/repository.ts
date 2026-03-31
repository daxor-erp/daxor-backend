import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { VendorCredit } from './model'

export class VendorCreditRepository extends MongoBaseRepository<any> {
  constructor() { super(VendorCredit as any) }

  async findByOrganization(organizationId: string, filter: any = {}) {
    return this.model.find({ organizationId, deletedAt: null, ...filter })
      .populate('vendorId', 'id name email').sort({ createdAt: -1 })
  }

  async findAvailable(organizationId: string, vendorId: string) {
    return this.model.find({ organizationId, vendorId, status: 'open', deletedAt: null })
      .populate('vendorId', 'id name email')
  }
}
