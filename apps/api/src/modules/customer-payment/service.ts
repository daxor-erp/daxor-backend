import { CustomerPaymentRepository } from './repository'
import { CustomerInvoiceService } from '../customer-invoice/service'
import { accountingPosting } from '../../lib/accounting-posting'

export class CustomerPaymentService {
	private repository: CustomerPaymentRepository
	private invoiceService: CustomerInvoiceService

	constructor() {
		this.repository = new CustomerPaymentRepository()
		this.invoiceService = new CustomerInvoiceService()
	}

	private async generatePaymentNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		const seq = (count + 1).toString().padStart(5, '0')
		return `CPAY-${`${organizationId}`.slice(-6).toUpperCase()}-${seq}`
	}

	async createPayment(data: any, userId: string) {
		const { allocations, totalAmount, customerId } = data

		const allocTotal = allocations.reduce((sum: number, a: any) => sum + a.amount, 0)
		if (Math.abs(allocTotal - totalAmount) > 0.01) {
			throw new Error(`Allocation total (${allocTotal}) must equal payment total (${totalAmount})`)
		}

		const enriched: Array<{ invoiceId: string; amount: number; invoiceNumber?: string }> = []
		for (const a of allocations) {
			const inv = await this.invoiceService.findById(a.invoiceId)
			if (!inv) throw new Error(`Invoice ${a.invoiceId} not found`)
			const invCustomer = String(inv.customerId ?? inv.clientId ?? '')
			if (invCustomer !== String(customerId)) {
				throw new Error(
					`Invoice ${inv.invoiceNumber || inv.seqNo} does not belong to the selected customer`,
				)
			}
			enriched.push({
				invoiceId: a.invoiceId,
				amount: a.amount,
				invoiceNumber: inv.invoiceNumber || inv.seqNo,
			})
		}

		const paymentNumber = await this.generatePaymentNumber(data.organizationId)

		const payment = await this.repository.create({
			...data,
			allocations: enriched,
			paymentNumber,
			status: 'confirmed',
			createdBy: userId,
			updatedBy: userId,
		})

		for (const alloc of enriched) {
			await this.invoiceService.applyPayment(alloc.invoiceId, alloc.amount)
		}

		await accountingPosting.postCustomerPayment(payment, userId)

		return payment
	}

	async getPaymentById(id: string) {
		return this.repository.findById(id)
	}

	async getPayments(organizationId: string, filter: any = {}, page = 1, limit = 100) {
		const result = await this.repository.findPaginated(
			{ organizationId, deletedAt: null, ...filter } as any,
			page,
			limit,
			{ paymentDate: -1 },
		)
		return result.data
	}

	async getPaymentsByCustomer(customerId: string) {
		return this.repository.findByCustomer(customerId)
	}

	async updatePayment(id: string, data: any, userId: string) {
		return this.repository.update(id, { ...data, updatedBy: userId })
	}

	async deletePayment(id: string, userId: string) {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}
}
