import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { CustomerPayment } from './model'

export interface ICustomerPaymentDocument extends IBaseEntity {
	paymentNumber: string
	customerId: any
	paymentDate: Date
	paymentMethod: string
	referenceNumber?: string
	totalAmount: number
	allocations: Array<{ invoiceId: any; amount: number; invoiceNumber?: string }>
	notes?: string
	status: string
	organizationId: any
}

export class CustomerPaymentRepository extends MongoBaseRepository<ICustomerPaymentDocument> {
	constructor() {
		super(CustomerPayment as any)
	}

	async findByCustomer(customerId: string) {
		return this.model.find({ customerId, deletedAt: null }).sort({ paymentDate: -1 })
	}

	async findByOrganization(organizationId: string, filter: any = {}) {
		return this.model.find({ organizationId, deletedAt: null, ...filter }).sort({ paymentDate: -1 })
	}
}
