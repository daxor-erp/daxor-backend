import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { ReturnAuthorization } from './model'

export interface IReturnAuthorizationDoc extends IBaseEntity {
	raNumber: string
	organizationId: string
	customerId: any
	salesOrderId?: any
	reason?: string
	notes?: string
	status: string
	requestedDate: Date
	lines: any[]
	rejectionReason?: string
	approvedAt?: Date
	approvedBy?: any
	rejectedAt?: Date
	rejectedBy?: any
	deletedAt?: Date | null
}

export class ReturnAuthorizationRepository extends MongoBaseRepository<IReturnAuthorizationDoc> {
	constructor() {
		super(ReturnAuthorization as any)
	}
}
