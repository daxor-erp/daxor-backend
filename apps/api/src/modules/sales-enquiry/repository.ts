import { MongoBaseRepository } from '../base/mongo-repository'
import { SalesEnquiry } from './model'

export class SalesEnquiryRepository extends MongoBaseRepository<any> {
	constructor() {
		super(SalesEnquiry)
	}

	async findByClientId(clientId: string): Promise<any[]> {
		return this.findAllActive({ clientId })
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.findAllActive({ status })
	}

	async findByAssignedTo(userId: string): Promise<any[]> {
		return this.findAllActive({ assignedTo: userId })
	}

	async findByEnquiryNumber(enquiryNumber: string): Promise<any | null> {
		return this.findOne({ enquiryNumber, deletedAt: null })
	}

	async findByOrganization(organizationId: string): Promise<any[]> {
		return this.findAllActive({ organizationId })
	}
}
