import { CustomerInvoiceService } from '../customer-invoice/service'
import { CustomerRefundRepository } from './repository'

export class CustomerRefundService {
	private repository: CustomerRefundRepository
	private invoiceService: CustomerInvoiceService

	constructor() {
		this.repository = new CustomerRefundRepository()
		this.invoiceService = new CustomerInvoiceService()
	}

	private async generateRefundNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		const seq = (count + 1).toString().padStart(5, '0')
		return `CREF-${`${organizationId}`.slice(-6).toUpperCase()}-${seq}`
	}

	async create(data: any, userId: string) {
		const amount = Math.round(Number(data.amount) * 100) / 100
		if (!(amount > 0)) throw new Error('Refund amount must be positive')

		const customerId = String(data.customerId)
		const orgId = data.organizationId

		let customerInvoiceId: string | undefined
		if (data.customerInvoiceId) {
			customerInvoiceId = String(data.customerInvoiceId)
			const inv = await this.invoiceService.findById(customerInvoiceId)
			if (!inv) throw new Error('Invoice not found')
			const invCustomer = String((inv as any).customerId ?? (inv as any).clientId ?? '')
			if (invCustomer !== customerId) {
				throw new Error('Invoice does not belong to the selected bill-to party')
			}
			const paid = Number((inv as any).paidAmount ?? 0)
			if (amount > paid + 0.01) {
				throw new Error('Refund amount cannot exceed paid amount on the selected invoice')
			}
			await this.invoiceService.reversePayment(customerInvoiceId, amount)
		}

		const refundNumber = await this.generateRefundNumber(orgId)

		return this.repository.create({
			organizationId: orgId,
			customerId,
			refundDate: data.refundDate ? new Date(data.refundDate) : new Date(),
			refundMethod: String(data.refundMethod),
			referenceNumber: data.referenceNumber?.trim() || undefined,
			amount,
			customerInvoiceId: customerInvoiceId || undefined,
			notes: data.notes?.trim() || undefined,
			status: 'issued',
			refundNumber,
			createdBy: userId,
			updatedBy: userId,
		} as any)
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async list(organizationId: string, filter: Record<string, unknown> = {}, page = 1, limit = 100) {
		const result = await this.repository.findPaginated(
			{ organizationId, deletedAt: null, ...filter } as any,
			page,
			limit,
			{ refundDate: -1 },
		)
		return result.data
	}

	async cancel(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Refund not found')
		if ((doc as any).deletedAt) throw new Error('Refund was already removed')
		if ((doc as any).status !== 'issued') throw new Error('Only issued refunds can be cancelled')

		const plain = doc as any
		const invId = plain.customerInvoiceId
		const amount = Number(plain.amount ?? 0)
		if (invId && amount > 0) {
			await this.invoiceService.applyPayment(String(invId), amount)
		}

		return this.repository.update(id, {
			status: 'cancelled',
			deletedAt: new Date(),
			updatedBy: userId,
		} as any)
	}
}
