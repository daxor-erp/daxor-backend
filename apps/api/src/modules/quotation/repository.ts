import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Quotation } from './model'
import { QUOTATION_PARTY_POPULATE } from './party'

interface IQuotationDocument extends IBaseEntity {
  seqNo?: string
  quotationNumber: string
  customerId?: any
  clientId?: any
  subject: string
  quotationDate: Date
  validUntil: Date
  lineItems: any[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  terms?: string
  notes?: string
  status: string
  sentAt?: Date
  sentBy?: any
  organizationId: any
}

export class QuotationRepository extends MongoBaseRepository<IQuotationDocument> {
  constructor() {
    super(Quotation as any)
  }

  async findByOrganization(organizationId: string) {
    return this.model.find({ organizationId, deletedAt: null }).populate('clientId', 'name email').populate('sentBy')
  }

  async findByClient(clientId: string) {
    return this.model.find({ clientId, deletedAt: null }).populate('clientId', 'name email').populate('sentBy')
  }

  async findByStatus(status: string, organizationId: string) {
    return this.model.find({ status, organizationId, deletedAt: null }).populate('clientId', 'name email').populate('sentBy')
  }

  async findByQuotationNumber(quotationNumber: string, organizationId: string) {
    return this.model.findOne({ quotationNumber, organizationId, deletedAt: null }).populate('clientId', 'name email')
  }
}
