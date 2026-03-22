import { QuotationRepository } from './repository'

export class QuotationService {
	private repository: QuotationRepository

	constructor() {
		this.repository = new QuotationRepository()
	}

	private async generateQuotationNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null })
		const seq = (count + 1).toString().padStart(4, '0')
		return `QT-${organizationId.slice(-6).toUpperCase()}-${seq}`
	}

	async create(data: any, userId: string, organizationId: string): Promise<any> {
		const quotationNumber = await this.generateQuotationNumber(organizationId)
		return this.repository.create({
			...data,
			quotationNumber,
			organizationId,
			createdBy: userId,
		})
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async findPaginated(filter: any, page: number, limit: number, sort: any): Promise<any> {
		return this.repository.findPaginated(filter, page, limit, sort)
	}

	async update(id: string, data: any): Promise<any> {
		return this.repository.update(id, { ...data, updatedAt: new Date() })
	}

	async softDelete(id: string, userId: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}
}
