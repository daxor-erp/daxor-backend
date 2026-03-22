import { MongoBaseRepository } from '../base/mongo-repository'
import { Quotation } from './model'

export class QuotationRepository extends MongoBaseRepository<any> {
	constructor() {
		super(Quotation)
	}

	async findByOrganization(organizationId: string): Promise<any[]> {
		return this.findAllActive({ organizationId })
	}

	async findByClient(clientId: string): Promise<any[]> {
		return this.findAllActive({ clientId })
	}
}
