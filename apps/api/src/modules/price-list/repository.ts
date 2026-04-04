import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { PriceList } from './model'

export interface IPriceListDoc extends IBaseEntity {
	listNumber: string
	organizationId: string
	title: string
	categoryFilter?: string
	lines: any[]
	deletedAt?: Date | null
}

export class PriceListRepository extends MongoBaseRepository<IPriceListDoc> {
	constructor() {
		super(PriceList as any)
	}
}
