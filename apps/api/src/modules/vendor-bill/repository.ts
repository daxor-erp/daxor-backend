import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { VendorBill } from './model'

export interface IVendorBillDocument extends IBaseEntity {
  billNumber: string
  vendorId: any
  purchaseOrderId?: any
  billDate: Date
  dueDate: Date
  lineItems: any[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  notes?: string
  status: string
  organizationId: any
}

export class VendorBillRepository extends MongoBaseRepository<IVendorBillDocument> {
  constructor() {
    super(VendorBill as any)
  }

  async findByVendor(vendorId: string) {
    return this.model.find({ vendorId, deletedAt: null }).populate('vendorId', 'id name email')
  }

  async findByOrganization(organizationId: string, filter: any = {}) {
    return this.model
      .find({ organizationId, deletedAt: null, ...filter })
      .populate('vendorId', 'id name email')
      .sort({ createdAt: -1 })
  }

  async findOutstanding(organizationId: string) {
    return this.model
      .find({ organizationId, deletedAt: null, status: { $in: ['approved', 'partially_paid'] } })
      .populate('vendorId', 'id name email')
      .sort({ dueDate: 1 })
  }

  async findByPurchaseOrderId(purchaseOrderId: string) {
    return this.model.find({ purchaseOrderId, deletedAt: null })
  }
}
