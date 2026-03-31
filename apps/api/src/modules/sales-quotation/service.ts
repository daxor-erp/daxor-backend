import { SalesQuotationRepository } from './repository'

export class SalesQuotationService {
	private repository: SalesQuotationRepository

	constructor() {
		this.repository = new SalesQuotationRepository()
	}

	private async generateQuotationNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null })
		const seqNumber = (count + 1).toString().padStart(4, '0')
		return `SQ-${`${organizationId}`.slice(-6).toUpperCase()}-${seqNumber}`
	}

	private calculateTotals(items: any[]) {
		const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
		const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0)
		const totalTax = items.reduce((sum, item) => sum + (item.tax || 0), 0)
		const grandTotal = subtotal - totalDiscount + totalTax

		return { subtotal, totalDiscount, totalTax, grandTotal }
	}

	async createQuotation(data: any, userId: string, organizationId: string): Promise<any> {
		const quotationNumber = await this.generateQuotationNumber(organizationId)
		const totals = this.calculateTotals(data.items || [])

		return this.repository.create({
			...data,
			quotationNumber,
			...totals,
			organizationId,
			createdBy: userId,
		})
	}

	async updateQuotation(id: string, data: any): Promise<any> {
		if (data.items) {
			const totals = this.calculateTotals(data.items)
			data = { ...data, ...totals }
		}
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

	async findByEnquiryId(enquiryId: string): Promise<any[]> {
		return this.repository.findByEnquiryId(enquiryId)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}

	async softDelete(id: string, userId: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}
}
