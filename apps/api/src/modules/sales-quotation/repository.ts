import { MongoBaseRepository } from '../base/mongo-repository'
import { SalesQuotation } from './model'

export class SalesQuotationRepository extends MongoBaseRepository<any> {
	constructor() {
		super(SalesQuotation)
	}

	async findByClientId(clientId: string): Promise<any[]> {
		return this.model.find({ clientId, deletedAt: null })
			.populate('createdBy', 'email firstName lastName')
			.populate('enquiryId', 'enquiryNumber subject')
			.sort({ createdAt: -1 })
			.exec()
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.model.find({ status, deletedAt: null })
			.populate('createdBy', 'email firstName lastName')
			.populate('clientId', 'name email')
			.sort({ createdAt: -1 })
			.exec()
	}

	async findByEnquiryId(enquiryId: string): Promise<any[]> {
		return this.model.find({ enquiryId, deletedAt: null })
			.populate('createdBy', 'email firstName lastName')
			.sort({ createdAt: -1 })
			.exec()
	}

	async findByQuotationNumber(quotationNumber: string): Promise<any | null> {
		return this.findOne({ quotationNumber, deletedAt: null })
	}

	async findByOrganization(organizationId: string): Promise<any[]> {
		return this.findAllActive({ organizationId })
	}
}
