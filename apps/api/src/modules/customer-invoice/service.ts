import { CustomerInvoiceRepository } from './repository'

export class CustomerInvoiceService {
	private repository: CustomerInvoiceRepository

	constructor() {
		this.repository = new CustomerInvoiceRepository()
	}

	private async generateInvoiceNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		const seq = (count + 1).toString().padStart(4, '0')
		return `INV-${organizationId.slice(-6).toUpperCase()}-${seq}`
	}

	async create(data: any): Promise<any> {
		const normalizedCustomerId = data.customerId || data.clientId
		const invoiceNumber = data.invoiceNumber || await this.generateInvoiceNumber(data.organizationId)
		const seqNo = data.seqNo || invoiceNumber
		return this.repository.create({
			...data,
			seqNo,
			invoiceNumber,
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

	/**
	 * Called when recording a customer payment allocation against this invoice.
	 */
	async applyPayment(invoiceId: string, amount: number): Promise<void> {
		const bill = await this.repository.findById(invoiceId)
		if (!bill) throw new Error('Invoice not found')
		const status = bill.status as string
		if (['draft', 'cancelled', 'paid', 'submitted', 'approval_declined'].includes(status)) {
			throw new Error(`Cannot apply payment to invoice in status "${status}"`)
		}
		const total = Number(bill.totalAmount ?? 0)
		const paid = Number(bill.paidAmount ?? 0)
		const outstanding = total - paid
		if (amount > outstanding + 0.01) {
			throw new Error(
				`Payment amount exceeds outstanding balance on invoice ${bill.invoiceNumber || bill.seqNo}`,
			)
		}
		const newPaid = paid + amount
		const newOutstanding = total - newPaid
		const newStatus = newOutstanding <= 0.01 ? 'paid' : 'partially_paid'
		await this.repository.update(invoiceId, { paidAmount: newPaid, status: newStatus })
	}

	/**
	 * Reduces applied payment on an invoice (e.g. when issuing a customer refund linked to the invoice).
	 */
	async reversePayment(invoiceId: string, amount: number): Promise<void> {
		const bill = await this.repository.findById(invoiceId)
		if (!bill) throw new Error('Invoice not found')
		const paid = Number(bill.paidAmount ?? 0)
		const amt = Math.round(Number(amount) * 100) / 100
		if (amt <= 0) throw new Error('Refund amount must be positive')
		if (amt > paid + 0.01) {
			throw new Error(
				`Refund cannot exceed paid amount on invoice ${bill.invoiceNumber || bill.seqNo}`,
			)
		}
		const newPaid = Math.round((paid - amt) * 100) / 100
		const total = Number(bill.totalAmount ?? 0)
		const outstanding = Math.round((total - newPaid) * 100) / 100
		const prevStatus = String(bill.status ?? '')
		let newStatus: string
		if (outstanding <= 0.01) newStatus = 'paid'
		else if (newPaid <= 0.01) {
			newStatus = ['draft', 'cancelled'].includes(prevStatus) ? prevStatus : 'sent'
		} else {
			newStatus = 'partially_paid'
		}
		await this.repository.update(invoiceId, { paidAmount: newPaid, status: newStatus })
	}

	/**
	 * Adds a finance charge line item and increases invoice totals (posted from finance charge assessment).
	 */
	async applyFinanceCharge(invoiceId: string, chargeAmount: number, assessmentNumber: string): Promise<void> {
		const bill = await this.repository.findById(invoiceId)
		if (!bill) throw new Error('Invoice not found')
		const status = bill.status as string
		if (['draft', 'cancelled', 'paid', 'submitted', 'approval_declined'].includes(status)) {
			throw new Error(`Cannot apply finance charge to invoice in status "${status}"`)
		}
		const charge = Math.round(Number(chargeAmount) * 100) / 100
		if (charge <= 0) return
		const plain = bill.toObject ? bill.toObject() : bill
		const existingItems = (plain.items || []).map((it: any) => ({
			itemId: it.itemId,
			itemDescription: it.itemDescription,
			quantity: it.quantity,
			unitPrice: it.unitPrice,
			lineTotal: it.lineTotal,
		}))
		const line = {
			itemDescription: `Finance charge — ${assessmentNumber}`,
			quantity: 1,
			unitPrice: charge,
			lineTotal: charge,
		}
		const items = [...existingItems, line]
		const subtotal = Number(plain.subtotal ?? 0) + charge
		const totalAmount = Number(plain.totalAmount ?? 0) + charge
		await this.repository.update(invoiceId, {
			items,
			subtotal,
			totalAmount,
			updatedAt: new Date(),
		})
	}

	async submitForApproval(id: string, userId: string): Promise<any> {
		const bill = await this.repository.findById(id)
		if (!bill || (bill as any).deletedAt) throw new Error('Invoice not found')
		const st = String((bill as any).status)
		if (st !== 'draft' && st !== 'approval_declined') {
			throw new Error('Only draft or declined invoices can be submitted for approval')
		}
		return this.repository.update(id, { status: 'submitted', updatedBy: userId, updatedAt: new Date() })
	}

	async approveApproval(id: string, userId: string): Promise<any> {
		const bill = await this.repository.findById(id)
		if (!bill || (bill as any).deletedAt) throw new Error('Invoice not found')
		if (String((bill as any).status) !== 'submitted') {
			throw new Error('Only invoices pending approval can be approved')
		}
		return this.repository.update(id, { status: 'approved', updatedBy: userId, updatedAt: new Date() })
	}

	async declineApproval(id: string, userId: string): Promise<any> {
		const bill = await this.repository.findById(id)
		if (!bill || (bill as any).deletedAt) throw new Error('Invoice not found')
		if (String((bill as any).status) !== 'submitted') {
			throw new Error('Only invoices pending approval can be declined')
		}
		return this.repository.update(id, { status: 'approval_declined', updatedBy: userId, updatedAt: new Date() })
	}
}
