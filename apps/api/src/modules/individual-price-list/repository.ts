import { MongoBaseRepository, type IBaseEntity } from '../base/mongo-repository'
import { IndividualPriceList } from './model'

export interface IIndividualPriceListDoc extends IBaseEntity {
	listNumber: string
	organizationId: string
	customerId: unknown
	title: string
	lines: unknown[]
	notes?: string
	deletedAt?: Date | null
}

export class IndividualPriceListRepository extends MongoBaseRepository<IIndividualPriceListDoc> {
	constructor() {
		super(IndividualPriceList as any)
	}
}
