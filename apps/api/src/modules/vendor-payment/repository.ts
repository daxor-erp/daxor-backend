import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { VendorPayment } from './model'

export interface IVendorPaymentDocument extends IBaseEntity {
  paymentNumber: string
  vendorId: any
  paymentDate: Date
  paymentMethod: string
  referenceNumber?: string
  totalAmount: number
  allocations: Array<{ billId: any; amount: number }>
  notes?: string
  status: string
  organizationId: any
}

export class VendorPaymentRepository extends MongoBaseRepository<IVendorPaymentDocument> {
  constructor() {
    super(VendorPayment as any)
  }

  async findByVendor(vendorId: string) {
    return this.model
      .find({ vendorId, deletedAt: null })
      .populate('vendorId', 'id name email')
      .sort({ paymentDate: -1 })
  }

  async findByOrganization(organizationId: string, filter: any = {}) {
    return this.model
      .find({ organizationId, deletedAt: null, ...filter })
      .populate('vendorId', 'id name email')
      .sort({ paymentDate: -1 })
  }
}
