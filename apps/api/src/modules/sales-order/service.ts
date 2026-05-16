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

		const cashSale = data.cashSale === true

		return this.repository.create({
			...data,
			seqNo,
			salesOrderNumber,
			customerId: normalizedCustomerId,
			// Keep duplicated id for backward compatibility with existing consumers.
			clientId: normalizedCustomerId,
			cashSale,
			status: data.status ?? (cashSale ? 'active' : 'draft'),
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

	async listCashSaleRefundCandidates(organizationId: string): Promise<any[]> {
		return this.repository.findAllActive({
			organizationId,
			cashSale: true,
			status: { $nin: ['refunded', 'cancelled', 'draft'] },
		} as any)
	}

	async submit(id: string, userId: string): Promise<any> {
		const so = await this.repository.findById(id)
		if (!so) throw new Error('Sales order not found')
		if ((so as any).deletedAt) throw new Error('Sales order was deleted')
		if ((so as any).cashSale === true) throw new Error('Cash sales skip this submission step')
		const st = String((so as any).status)
		if (st !== 'draft' && st !== 'rejected') throw new Error('Only draft or rejected sales orders can be sent for approval')
		return this.repository.update(id, { status: 'submitted', updatedBy: userId, updatedAt: new Date() } as any)
	}

	async approve(id: string, userId: string): Promise<any> {
		const so = await this.repository.findById(id)
		if (!so) throw new Error('Sales order not found')
		if ((so as any).deletedAt) throw new Error('Sales order was deleted')
		if ((so as any).cashSale === true) throw new Error('Only regular sales orders use this approve action')
		if (String((so as any).status) !== 'submitted') throw new Error('Only submitted sales orders can be approved')
		return this.repository.update(id, { status: 'approved', updatedBy: userId, updatedAt: new Date() } as any)
	}

	async reject(id: string, userId: string): Promise<any> {
		const so = await this.repository.findById(id)
		if (!so) throw new Error('Sales order not found')
		if ((so as any).deletedAt) throw new Error('Sales order was deleted')
		if ((so as any).cashSale === true) throw new Error('Only regular sales orders use this decline action')
		if (String((so as any).status) !== 'submitted') throw new Error('Only submitted sales orders can be declined')
		return this.repository.update(id, { status: 'rejected', updatedBy: userId, updatedAt: new Date() } as any)
	}

	async refundCashSale(
		input: {
			salesOrderId: string
			refundDate: string
			refundMethod: string
			referenceNumber?: string
			amount: number
			notes?: string
		},
		userId: string,
	) {
		const doc = await this.repository.findById(input.salesOrderId)
		if (!doc) throw new Error('Sales order not found')
		if ((doc as any).deletedAt) throw new Error('Sales order was deleted')
		if (!(doc as any).cashSale) throw new Error('Only cash sales can be refunded with this action')
		if ((doc as any).status === 'refunded') throw new Error('This cash sale was already refunded')
		const status = String((doc as any).status ?? '')
		if (!['active', 'completed', 'approved'].includes(status)) {
			throw new Error(`Cannot refund sales order in status "${status}"`)
		}

		const total = Math.round(Number((doc as any).totalAmount ?? 0) * 100) / 100
		const amt = Math.round(Number(input.amount) * 100) / 100
		if (!(amt > 0)) throw new Error('Refund amount must be positive')
		if (amt > total + 0.01) throw new Error('Refund cannot exceed the cash sale total')

		const refundDate = new Date(input.refundDate)
		if (Number.isNaN(refundDate.getTime())) throw new Error('Invalid refund date')

		return this.repository.update(input.salesOrderId, {
			status: 'refunded',
			refundedAt: refundDate,
			refundAmount: amt,
			refundMethod: String(input.refundMethod),
			refundReferenceNumber: input.referenceNumber?.trim() || undefined,
			refundNotes: input.notes?.trim() || undefined,
			refundedBy: userId,
			updatedBy: userId,
		} as any)
	}
}
