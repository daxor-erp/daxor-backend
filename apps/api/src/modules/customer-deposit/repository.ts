import { MongoBaseRepository, type IBaseEntity } from '../base/mongo-repository'
import { CustomerDeposit } from './model'

export interface ICustomerDepositDoc extends IBaseEntity {
	depositNumber: string
	organizationId: unknown
	customerId: unknown
	depositDate: Date
	depositMethod: string
	referenceNumber?: string
	amount: number
	notes?: string
	status: string
	deletedAt?: Date | null
}

export class CustomerDepositRepository extends MongoBaseRepository<ICustomerDepositDoc> {
	constructor() {
		super(CustomerDeposit as any)
	}
}
