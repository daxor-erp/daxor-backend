import { CustomerInvoiceService } from '../customer-invoice/service'
import { CustomerPaymentService } from '../customer-payment/service'

export class CustomerStatementService {
	private invoiceService: CustomerInvoiceService
	private paymentService: CustomerPaymentService

	constructor() {
		this.invoiceService = new CustomerInvoiceService()
		this.paymentService = new CustomerPaymentService()
	}

	async generate(organizationId: string, customerId: string, dateFrom: string, dateTo: string) {
		const from = new Date(dateFrom)
		from.setHours(0, 0, 0, 0)
		const to = new Date(dateTo)
		to.setHours(23, 59, 59, 999)

		if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
			throw new Error('Invalid date range')
		}
		if (from > to) throw new Error('dateFrom must be before or equal to dateTo')

		const invFilter = {
			organizationId,
			deletedAt: null,
			$or: [{ customerId }, { clientId: customerId }],
		}

		const invResult = await this.invoiceService.findWithPagination(invFilter, {
			page: 1,
			limit: 5000,
			sortBy: 'invoiceDate',
			sortOrder: 'asc',
		})

		const allInvoices = invResult.data ?? []

		const invoices = allInvoices.filter((inv: any) => {
			const d = inv.invoiceDate ? new Date(inv.invoiceDate) : null
			if (!d) return false
			return d >= from && d <= to
		})

		const payments = await this.paymentService.getPayments(organizationId, { customerId }, 1, 5000)

		const paymentsInRange = (payments ?? []).filter((p: any) => {
			const d = p.paymentDate ? new Date(p.paymentDate) : null
			if (!d) return false
			return d >= from && d <= to
		})

		const lines: Array<{
			date: string
			kind: string
			reference: string
			description: string
			debit: number
			credit: number
		}> = []

		for (const inv of invoices) {
			const invDate = inv.invoiceDate ? new Date(inv.invoiceDate) : new Date()
			const total = Number(inv.totalAmount ?? 0)
			lines.push({
				date: invDate.toISOString(),
				kind: 'invoice',
				reference: String(inv.invoiceNumber || inv.seqNo || inv._id),
				description: `Invoice ${inv.seqNo || inv.invoiceNumber || ''}`.trim(),
				debit: Math.round(total * 100) / 100,
				credit: 0,
			})
		}

		for (const p of paymentsInRange) {
			const pDate = p.paymentDate ? new Date(p.paymentDate) : new Date()
			const amt = Number(p.totalAmount ?? 0)
			lines.push({
				date: pDate.toISOString(),
				kind: 'payment',
				reference: String(p.paymentNumber ?? p._id),
				description: `Payment (${p.paymentMethod || '—'})`,
				debit: 0,
				credit: Math.round(amt * 100) / 100,
			})
		}

		lines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

		const periodInvoicesTotal = invoices.reduce(
			(s: number, inv: any) => s + Number(inv.totalAmount ?? 0),
			0,
		)
		const periodPaymentsTotal = paymentsInRange.reduce(
			(s: number, p: any) => s + Number(p.totalAmount ?? 0),
			0,
		)

		let currentBalance = 0
		for (const inv of allInvoices) {
			if (inv.status === 'cancelled') continue
			const o = Number(inv.totalAmount ?? 0) - Number(inv.paidAmount ?? 0)
			currentBalance += Math.max(0, o)
		}
		currentBalance = Math.round(currentBalance * 100) / 100

		return {
			customerId,
			dateFrom: from.toISOString(),
			dateTo: to.toISOString(),
			lines,
			periodInvoicesTotal: Math.round(periodInvoicesTotal * 100) / 100,
			periodPaymentsTotal: Math.round(periodPaymentsTotal * 100) / 100,
			currentBalance,
		}
	}
}
