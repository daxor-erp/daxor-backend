import { SalesOrderRepository } from './repository'

export class SalesOrderService {
	private repository: SalesOrderRepository

	constructor() {
		this.repository = new SalesOrderRepository()
	}

	private async generateSalesOrderNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		const seq = (count + 1).toString().padStart(4, '0')
		return `SO-${organizationId.slice(-6).toUpperCase()}-${seq}`
	}

	async create(data: any): Promise<any> {
		const normalizedCustomerId = data.customerId || data.clientId
		const salesOrderNumber = data.salesOrderNumber || await this.generateSalesOrderNumber(data.organizationId)
		const seqNo = data.seqNo || salesOrderNumber

		return this.repository.create({
			...data,
			seqNo,
			salesOrderNumber,
			customerId: normalizedCustomerId,
			// Keep duplicated id for backward compatibility with existing consumers.
			clientId: normalizedCustomerId,
		})
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async update(id: string, data: any): Promise<any> {
		return this.repository.update(id, data)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}
}
