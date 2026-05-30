import { ChartOfAccountsRepository, GeneralLedgerRepository } from '../modules/general-ledger/repository'
import { GeneralLedgerService } from '../modules/general-ledger/service'
import { JournalEntryRepository } from '../modules/journal-entry/repository'
import { JournalEntryService } from '../modules/journal-entry/service'
import { CustomerInvoiceRepository } from '../modules/customer-invoice/repository'
import { VendorBillRepository } from '../modules/vendor-bill/repository'
import type { IChartOfAccounts } from '../modules/general-ledger/model'
import { formatAccountingRef, legacyAccountingRefCandidates } from './accounting-ref'

type CoaRef = { accountCode: string; accountName: string }

const ROLE_DEFAULTS: Record<
	string,
	{ accountName: string; accountType: string; namePatterns: RegExp[] }
> = {
	accounts_receivable: {
		accountName: 'Accounts Receivable',
		accountType: 'asset',
		namePatterns: [/accounts receivable/i, /^ar$/i],
	},
	sales_revenue: {
		accountName: 'Sales Revenue',
		accountType: 'revenue',
		namePatterns: [/sales revenue/i, /^revenue$/i, /service revenue/i],
	},
	sales_tax_payable: {
		accountName: 'Sales Tax Payable',
		accountType: 'liability',
		namePatterns: [/sales tax payable/i, /tax payable/i, /output tax/i],
	},
	cash: {
		accountName: 'Cash',
		accountType: 'asset',
		namePatterns: [/^cash$/i, /cash and bank/i, /bank account/i],
	},
	accounts_payable: {
		accountName: 'Accounts Payable',
		accountType: 'liability',
		namePatterns: [/accounts payable/i, /^ap$/i],
	},
	operating_expense: {
		accountName: 'Operating Expense',
		accountType: 'expense',
		namePatterns: [/operating expense/i, /general expense/i, /^expense$/i],
	},
}

function roundMoney(n: number): number {
	return Math.round(Number(n) * 100) / 100
}

function fiscalFromDate(d: Date): { fiscalYear: string; fiscalPeriod: string } {
	return {
		fiscalYear: String(d.getFullYear()),
		fiscalPeriod: String(d.getMonth() + 1).padStart(2, '0'),
	}
}

function plainDoc(doc: any): any {
	if (!doc) return doc
	return doc.toObject ? doc.toObject() : doc
}

function orgIdOf(doc: any): string {
	return String(doc.organizationId ?? '')
}

function docId(doc: any): string {
	return String(doc._id ?? doc.id ?? '')
}

/**
 * Posts balanced journal entries and mirrored general-ledger rows when
 * operational documents (invoices, bills, payments) are approved or confirmed.
 */
export class AccountingPostingService {
	private coaRepo = new ChartOfAccountsRepository()
	private jeRepo = new JournalEntryRepository()
	private jeService = new JournalEntryService()
	private glService = new GeneralLedgerService()
	private glRepo = new GeneralLedgerRepository()
	private coaCache = new Map<string, Map<string, CoaRef>>()

	private async getAccounts(organizationId: string): Promise<Map<string, CoaRef>> {
		const cached = this.coaCache.get(organizationId)
		if (cached) return cached

		const all = await this.coaRepo.findByOrganization(organizationId)
		const map = new Map<string, CoaRef>()
		for (const [role, def] of Object.entries(ROLE_DEFAULTS)) {
			const match = all.find((a: IChartOfAccounts) => {
				const name = String(a.accountName ?? '')
				const type = String(a.accountType ?? '').toLowerCase()
				return (
					a.isActive !== false &&
					def.namePatterns.some((p) => p.test(name)) &&
					(!def.accountType || type === def.accountType)
				)
			})
			if (match) {
				map.set(role, {
					accountCode: String(match.accountCode),
					accountName: String(match.accountName),
				})
			}
		}
		this.coaCache.set(organizationId, map)
		return map
	}

	private async resolveAccount(organizationId: string, role: string): Promise<CoaRef> {
		const accounts = await this.getAccounts(organizationId)
		const existing = accounts.get(role)
		if (existing) return existing

		const def = ROLE_DEFAULTS[role]
		if (!def) throw new Error(`Unknown accounting role: ${role}`)

		const created = await this.glService.createChartOfAccount({
			organizationId,
			accountName: def.accountName,
			accountType: def.accountType,
			isActive: true,
			level: 1,
		} as Partial<IChartOfAccounts>)

		const ref: CoaRef = {
			accountCode: String(created.accountCode),
			accountName: String(created.accountName),
		}
		accounts.set(role, ref)
		this.coaCache.set(organizationId, accounts)
		return ref
	}

	private async alreadyPosted(referenceNumber: string, organizationId: string): Promise<boolean> {
		const existing = await this.jeRepo.findByReferenceNumber(referenceNumber, organizationId)
		if (existing) return true
		const byEntry = await this.jeRepo.findByEntryNumber(referenceNumber, organizationId)
		return Boolean(byEntry)
	}

	/** Idempotent post: accept current doc-number ref and legacy ObjectId-suffix refs. */
	private async alreadyPostedAny(organizationId: string, refs: string[]): Promise<boolean> {
		for (const ref of refs) {
			if (ref && (await this.alreadyPosted(ref, organizationId))) return true
		}
		return false
	}

	private async createPostedJournal(params: {
		organizationId: string
		userId: string
		referenceNumber: string
		entryDate: Date
		description: string
		lines: Array<{ accountCode: string; accountName: string; debit: number; credit: number; description?: string }>
		glPairs: Array<{ debit: CoaRef; credit: CoaRef; amount: number; description: string }>
		referenceModule: string
		referenceId: string
		transactionType: string
	}) {
		if (await this.alreadyPostedAny(params.organizationId, [params.referenceNumber])) {
			return null
		}

		const entryNumber = params.referenceNumber
		const je = await this.jeService.create(
			{
				entryNumber,
				entryDate: params.entryDate,
				referenceNumber: params.referenceNumber,
				description: params.description,
				lines: params.lines,
				organizationId: params.organizationId,
				status: 'draft',
			} as any,
			params.userId,
		)

		const jeId = docId(je)
		await this.jeService.post(jeId, params.userId)

		const fiscal = fiscalFromDate(params.entryDate)
		const existingGl = await this.glRepo.findByReferenceModule(
			params.organizationId,
			params.referenceModule,
			params.referenceId,
		)
		for (const pair of params.glPairs) {
			const dup = (existingGl ?? []).some(
				(g: any) => g.description === pair.description && roundMoney(g.amount) === pair.amount,
			)
			if (dup) continue

			await this.glService.createTransaction(
				{
					organizationId: params.organizationId,
					transactionDate: params.entryDate,
					transactionType: params.transactionType,
					referenceModule: params.referenceModule,
					referenceId: params.referenceId,
					debitAccount: pair.debit.accountCode,
					creditAccount: pair.credit.accountCode,
					amount: pair.amount,
					description: pair.description,
					...fiscal,
				},
				params.userId,
			)
		}

		return je
	}

	/** Recognize revenue: Dr AR, Cr Revenue (+ tax payable if applicable). */
	async postCustomerInvoiceRevenue(invoice: any, userId: string) {
		const inv = plainDoc(invoice)
		const organizationId = orgIdOf(inv)
		const id = docId(inv)
		if (!organizationId || !id) return null

		const status = String(inv.status ?? '')
		if (!['approved', 'sent', 'partially_paid', 'paid', 'overdue'].includes(status)) {
			return null
		}

		const invNo = String(inv.invoiceNumber || inv.seqNo || '').trim() || id
		const ref = formatAccountingRef('AR-INV', invNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AR-INV', invNo, id))) {
			return null
		}

		const total = roundMoney(inv.totalAmount ?? 0)
		if (total <= 0) return null

		const subtotal = roundMoney(inv.subtotal ?? total)
		const tax = roundMoney(inv.taxAmount ?? Math.max(0, total - subtotal))
		const revenueAmount = tax > 0 ? subtotal : total

		const ar = await this.resolveAccount(organizationId, 'accounts_receivable')
		const revenue = await this.resolveAccount(organizationId, 'sales_revenue')

		const entryDate = inv.invoiceDate ? new Date(inv.invoiceDate) : new Date()
		const lines: Array<{
			accountCode: string
			accountName: string
			debit: number
			credit: number
			description?: string
		}> = [
			{
				accountCode: ar.accountCode,
				accountName: ar.accountName,
				debit: total,
				credit: 0,
				description: `Invoice ${invNo}`,
			},
			{
				accountCode: revenue.accountCode,
				accountName: revenue.accountName,
				debit: 0,
				credit: revenueAmount,
				description: `Revenue — ${invNo}`,
			},
		]

		const glPairs: Array<{ debit: CoaRef; credit: CoaRef; amount: number; description: string }> = [
			{
				debit: ar,
				credit: revenue,
				amount: revenueAmount,
				description: `Invoice ${invNo} — revenue`,
			},
		]

		if (tax > 0.009) {
			const taxAcct = await this.resolveAccount(organizationId, 'sales_tax_payable')
			lines.push({
				accountCode: taxAcct.accountCode,
				accountName: taxAcct.accountName,
				debit: 0,
				credit: tax,
				description: `Tax — ${invNo}`,
			})
			glPairs.push({
				debit: ar,
				credit: taxAcct,
				amount: tax,
				description: `Invoice ${invNo} — tax`,
			})
		}

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Customer invoice ${invNo}`,
			lines,
			glPairs,
			referenceModule: 'customer_invoice',
			referenceId: id,
			transactionType: 'CUSTOMER_INVOICE',
		})
	}

	async ensureCustomerInvoiceRevenuePosted(invoiceId: string, userId: string) {
		const repo = new CustomerInvoiceRepository()
		const inv = await repo.findById(invoiceId)
		if (!inv) return null
		return this.postCustomerInvoiceRevenue(inv, userId)
	}

	/** Customer receipt: Dr Cash, Cr AR. */
	async postCustomerPayment(payment: any, userId: string) {
		const p = plainDoc(payment)
		const organizationId = orgIdOf(p)
		const id = docId(p)
		if (!organizationId || !id) return null

		const total = roundMoney(p.totalAmount ?? 0)
		if (total <= 0) return null

		const allocations: any[] = p.allocations ?? []
		for (const a of allocations) {
			if (a.invoiceId) {
				await this.ensureCustomerInvoiceRevenuePosted(String(a.invoiceId), userId)
			}
		}

		const payNo = String(p.paymentNumber || p.seqNo || '').trim() || id
		const ref = formatAccountingRef('AR-PAY', payNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AR-PAY', payNo, id))) {
			return null
		}

		const cash = await this.resolveAccount(organizationId, 'cash')
		const ar = await this.resolveAccount(organizationId, 'accounts_receivable')
		const entryDate = p.paymentDate ? new Date(p.paymentDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Customer payment ${payNo}`,
			lines: [
				{
					accountCode: cash.accountCode,
					accountName: cash.accountName,
					debit: total,
					credit: 0,
					description: payNo,
				},
				{
					accountCode: ar.accountCode,
					accountName: ar.accountName,
					debit: 0,
					credit: total,
					description: payNo,
				},
			],
			glPairs: [
				{
					debit: cash,
					credit: ar,
					amount: total,
					description: `Customer payment ${payNo}`,
				},
			],
			referenceModule: 'customer_payment',
			referenceId: id,
			transactionType: 'CUSTOMER_PAYMENT',
		})
	}

	/** Vendor bill accrual: Dr Expense, Cr AP. */
	async postVendorBill(bill: any, userId: string) {
		const b = plainDoc(bill)
		const organizationId = orgIdOf(b)
		const id = docId(b)
		if (!organizationId || !id) return null

		if (String(b.status ?? '') !== 'approved') return null

		const billNo = String(b.billNumber || b.seqNo || '').trim() || id
		const ref = formatAccountingRef('AP-BILL', billNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AP-BILL', billNo, id))) {
			return null
		}

		const total = roundMoney(b.totalAmount ?? 0)
		if (total <= 0) return null

		const expense = await this.resolveAccount(organizationId, 'operating_expense')
		const ap = await this.resolveAccount(organizationId, 'accounts_payable')
		const entryDate = b.billDate ? new Date(b.billDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Vendor bill ${billNo}`,
			lines: [
				{
					accountCode: expense.accountCode,
					accountName: expense.accountName,
					debit: total,
					credit: 0,
					description: billNo,
				},
				{
					accountCode: ap.accountCode,
					accountName: ap.accountName,
					debit: 0,
					credit: total,
					description: billNo,
				},
			],
			glPairs: [
				{
					debit: expense,
					credit: ap,
					amount: total,
					description: `Vendor bill ${billNo}`,
				},
			],
			referenceModule: 'vendor_bill',
			referenceId: id,
			transactionType: 'VENDOR_BILL',
		})
	}

	async ensureVendorBillPosted(billId: string, userId: string) {
		const repo = new VendorBillRepository()
		const bill = await repo.findById(billId)
		if (!bill) return null
		return this.postVendorBill(bill, userId)
	}

	/** Vendor payment: Dr AP, Cr Cash. */
	async postVendorPayment(payment: any, userId: string) {
		const p = plainDoc(payment)
		const organizationId = orgIdOf(p)
		const id = docId(p)
		if (!organizationId || !id) return null

		const total = roundMoney(p.totalAmount ?? 0)
		if (total <= 0) return null

		for (const a of p.allocations ?? []) {
			if (a.billId) await this.ensureVendorBillPosted(String(a.billId), userId)
		}

		const payNo = String(p.paymentNumber || p.seqNo || '').trim() || id
		const ref = formatAccountingRef('AP-PAY', payNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AP-PAY', payNo, id))) {
			return null
		}

		const ap = await this.resolveAccount(organizationId, 'accounts_payable')
		const cash = await this.resolveAccount(organizationId, 'cash')
		const entryDate = p.paymentDate ? new Date(p.paymentDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Vendor payment ${payNo}`,
			lines: [
				{
					accountCode: ap.accountCode,
					accountName: ap.accountName,
					debit: total,
					credit: 0,
					description: payNo,
				},
				{
					accountCode: cash.accountCode,
					accountName: cash.accountName,
					debit: 0,
					credit: total,
					description: payNo,
				},
			],
			glPairs: [
				{
					debit: ap,
					credit: cash,
					amount: total,
					description: `Vendor payment ${payNo}`,
				},
			],
			referenceModule: 'vendor_payment',
			referenceId: id,
			transactionType: 'VENDOR_PAYMENT',
		})
	}
}

export const accountingPosting = new AccountingPostingService()
