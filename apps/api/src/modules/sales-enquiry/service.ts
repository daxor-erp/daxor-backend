import { SalesEnquiryRepository } from './repository'

export class SalesEnquiryService {
	private repository: SalesEnquiryRepository

	constructor() {
		this.repository = new SalesEnquiryRepository()
	}

	private async generateEnquiryNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null })
		const seqNumber = (count + 1).toString().padStart(4, '0')
		return `SE-${organizationId.slice(-6).toUpperCase()}-${seqNumber}`
	}

	async createSalesEnquiry(data: any, userId: string, organizationId: string): Promise<any> {
		const enquiryNumber = await this.generateEnquiryNumber(organizationId)
		return this.repository.create({
			...data,
			enquiryNumber,
			clientId: data.clientId || userId,
			organizationId,
			createdBy: userId,
		})
	}

	async updateSalesEnquiry(id: string, data: any): Promise<any> {
		return this.repository.update(id, { ...data, updatedAt: new Date() })
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async findByClientId(clientId: string): Promise<any[]> {
		return this.repository.findByClientId(clientId)
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.repository.findByStatus(status)
	}

	async findByAssignedTo(userId: string): Promise<any[]> {
		return this.repository.findByAssignedTo(userId)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}

	async softDelete(id: string, userId: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}
}
