import { MongoBaseRepository, type IBaseEntity } from '../base/mongo-repository'
import { CustomerRefund } from './model'

export interface ICustomerRefundDoc extends IBaseEntity {
	refundNumber: string
	organizationId: unknown
	customerId: unknown
	refundDate: Date
	refundMethod: string
	referenceNumber?: string
	amount: number
	customerInvoiceId?: unknown
	notes?: string
	status: string
	deletedAt?: Date | null
}

export class CustomerRefundRepository extends MongoBaseRepository<ICustomerRefundDoc> {
	constructor() {
		super(CustomerRefund as any)
	}
}
