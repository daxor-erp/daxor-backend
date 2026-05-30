import { ChartOfAccountsRepository, GeneralLedgerRepository } from '../modules/general-ledger/repository'
import { GeneralLedgerService } from '../modules/general-ledger/service'
import { JournalEntryRepository } from '../modules/journal-entry/repository'
import { JournalEntryService } from '../modules/journal-entry/service'
import { CustomerInvoiceRepository } from '../modules/customer-invoice/repository'
import { VendorBillRepository } from '../modules/vendor-bill/repository'
import type { IChartOfAccounts } from '../modules/general-ledger/model'
import { PayrollManagement } from '../modules/payroll-management/model'
import { Payslip } from '../modules/payslip/model'
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
	inventory_asset: {
		accountName: 'Inventory',
		accountType: 'asset',
		namePatterns: [/^inventory$/i, /inventory asset/i, /stock on hand/i],
	},
	inventory_clearing: {
		accountName: 'Goods Received Clearing',
		accountType: 'liability',
		namePatterns: [/goods received clearing/i, /grn clearing/i, /inventory clearing/i],
	},
	cogs: {
		accountName: 'Cost of Goods Sold',
		accountType: 'expense',
		namePatterns: [/cost of goods sold/i, /^cogs$/i],
	},
	inventory_shrinkage: {
		accountName: 'Inventory Shrinkage',
		accountType: 'expense',
		namePatterns: [/inventory shrinkage/i, /stock write-off/i],
	},
	inventory_gain: {
		accountName: 'Inventory Adjustment Gain',
		accountType: 'revenue',
		namePatterns: [/inventory adjustment gain/i, /inventory gain/i],
	},
	payroll_expense: {
		accountName: 'Payroll Expense',
		accountType: 'expense',
		namePatterns: [/payroll expense/i, /salary expense/i],
	},
	payroll_payable: {
		accountName: 'Payroll Payable',
		accountType: 'liability',
		namePatterns: [/payroll payable/i, /salaries payable/i],
	},
	statutory_payable: {
		accountName: 'Statutory Payables',
		accountType: 'liability',
		namePatterns: [/statutory payable/i, /pf payable/i, /esi payable/i, /tds payable/i],
	},
	wip: {
		accountName: 'Work in Progress',
		accountType: 'asset',
		namePatterns: [/work in progress/i, /^wip$/i],
	},
	finished_goods: {
		accountName: 'Finished Goods',
		accountType: 'asset',
		namePatterns: [/finished goods/i, /finished goods inventory/i],
	},
	accumulated_depreciation: {
		accountName: 'Accumulated Depreciation',
		accountType: 'asset',
		namePatterns: [/accumulated depreciation/i],
	},
	depreciation_expense: {
		accountName: 'Depreciation Expense',
		accountType: 'expense',
		namePatterns: [/depreciation expense/i],
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

	/** Reverse revenue / AR for credit memo or cancellation (partial or full). */
	async postCustomerInvoiceReversal(invoice: any, userId: string, creditAmount?: number) {
		const inv = plainDoc(invoice)
		const organizationId = orgIdOf(inv)
		const id = docId(inv)
		if (!organizationId || !id) return null

		const invNo = String(inv.invoiceNumber || inv.seqNo || '').trim() || id
		const ref = formatAccountingRef('AR-CM', invNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AR-CM', invNo, id))) {
			return null
		}

		const total = roundMoney(inv.totalAmount ?? 0)
		const amount = roundMoney(creditAmount ?? total)
		if (amount <= 0 || amount > total + 0.01) return null

		const ratio = total > 0 ? amount / total : 1
		const subtotal = roundMoney(inv.subtotal ?? total)
		const tax = roundMoney(inv.taxAmount ?? Math.max(0, total - subtotal))
		const revenueAmount = roundMoney((tax > 0 ? subtotal : total) * ratio)
		const taxRev = roundMoney(tax * ratio)

		const ar = await this.resolveAccount(organizationId, 'accounts_receivable')
		const revenue = await this.resolveAccount(organizationId, 'sales_revenue')
		const entryDate = new Date()

		const lines: Array<{
			accountCode: string
			accountName: string
			debit: number
			credit: number
			description?: string
		}> = [
			{
				accountCode: revenue.accountCode,
				accountName: revenue.accountName,
				debit: revenueAmount,
				credit: 0,
				description: `Credit memo ${invNo}`,
			},
			{
				accountCode: ar.accountCode,
				accountName: ar.accountName,
				debit: 0,
				credit: amount,
				description: `Credit memo ${invNo}`,
			},
		]
		const glPairs: Array<{ debit: CoaRef; credit: CoaRef; amount: number; description: string }> = [
			{
				debit: revenue,
				credit: ar,
				amount: revenueAmount,
				description: `Credit memo ${invNo} — revenue reversal`,
			},
		]

		if (taxRev > 0.009) {
			const taxAcct = await this.resolveAccount(organizationId, 'sales_tax_payable')
			lines.push({
				accountCode: taxAcct.accountCode,
				accountName: taxAcct.accountName,
				debit: taxRev,
				credit: 0,
				description: `Tax reversal — ${invNo}`,
			})
			glPairs.push({
				debit: taxAcct,
				credit: ar,
				amount: taxRev,
				description: `Credit memo ${invNo} — tax reversal`,
			})
		}

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Customer credit memo ${invNo}`,
			lines,
			glPairs,
			referenceModule: 'customer_invoice',
			referenceId: id,
			transactionType: 'CUSTOMER_CREDIT_MEMO',
		})
	}

	/** Approved sales return: Dr Revenue, Cr AR (and optional COGS/Inventory if returnValue set). */
	async postSalesReturn(salesReturn: any, userId: string) {
		const sr = plainDoc(salesReturn)
		const organizationId = orgIdOf(sr)
		const id = docId(sr)
		if (!organizationId || !id) return null
		if (String(sr.status ?? '').toUpperCase() !== 'APPROVED') return null

		const docNo = String(sr.docNumber || '').trim() || id
		const ref = formatAccountingRef('AR-RET', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AR-RET', docNo, id))) {
			return null
		}

		const amount = roundMoney(sr.totalAmount ?? 0)
		if (amount <= 0) return null

		const ar = await this.resolveAccount(organizationId, 'accounts_receivable')
		const revenue = await this.resolveAccount(organizationId, 'sales_revenue')
		const entryDate = sr.docDate ? new Date(sr.docDate) : new Date()

		const lines: Array<{
			accountCode: string
			accountName: string
			debit: number
			credit: number
			description?: string
		}> = [
			{
				accountCode: revenue.accountCode,
				accountName: revenue.accountName,
				debit: amount,
				credit: 0,
				description: docNo,
			},
			{
				accountCode: ar.accountCode,
				accountName: ar.accountName,
				debit: 0,
				credit: amount,
				description: docNo,
			},
		]
		const glPairs = [
			{
				debit: revenue,
				credit: ar,
				amount,
				description: `Sales return ${docNo}`,
			},
		]

		const cogsAmount = roundMoney(sr.cogsAmount ?? 0)
		if (cogsAmount > 0.009) {
			const cogs = await this.resolveAccount(organizationId, 'cogs')
			const inv = await this.resolveAccount(organizationId, 'inventory_asset')
			lines.push(
				{ accountCode: inv.accountCode, accountName: inv.accountName, debit: cogsAmount, credit: 0, description: docNo },
				{ accountCode: cogs.accountCode, accountName: cogs.accountName, debit: 0, credit: cogsAmount, description: docNo },
			)
			glPairs.push({
				debit: inv,
				credit: cogs,
				amount: cogsAmount,
				description: `Sales return ${docNo} — inventory`,
			})
		}

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Sales return ${docNo}`,
			lines,
			glPairs,
			referenceModule: 'sales_return',
			referenceId: id,
			transactionType: 'SALES_RETURN',
		})
	}

	/** Vendor credit: Dr AP, Cr Expense (reduces liability). */
	/** Vendor debit note: Dr AP, Cr Expense (vendor chargeback). */
	async postVendorDebitNote(debitNote: any, userId: string) {
		const c = plainDoc(debitNote)
		const organizationId = orgIdOf(c)
		const id = docId(c)
		if (!organizationId || !id) return null
		if (String(c.status ?? '') === 'cancelled') return null

		const docNo = String(c.debitNumber || '').trim() || id
		const ref = formatAccountingRef('AP-VDN', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AP-VDN', docNo, id))) {
			return null
		}

		const total = roundMoney(c.totalAmount ?? 0)
		if (total <= 0) return null

		const ap = await this.resolveAccount(organizationId, 'accounts_payable')
		const expense = await this.resolveAccount(organizationId, 'operating_expense')
		const entryDate = c.debitDate ? new Date(c.debitDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Vendor debit note ${docNo}`,
			lines: [
				{ accountCode: ap.accountCode, accountName: ap.accountName, debit: total, credit: 0, description: docNo },
				{ accountCode: expense.accountCode, accountName: expense.accountName, debit: 0, credit: total, description: docNo },
			],
			glPairs: [{ debit: ap, credit: expense, amount: total, description: `Debit note ${docNo}` }],
			referenceModule: 'vendor_debit_note',
			referenceId: id,
			transactionType: 'VENDOR_DEBIT_NOTE',
		})
	}

	async postVendorCredit(credit: any, userId: string) {
		const c = plainDoc(credit)
		const organizationId = orgIdOf(c)
		const id = docId(c)
		if (!organizationId || !id) return null
		if (String(c.status ?? '') === 'cancelled') return null

		const docNo = String(c.creditNumber || '').trim() || id
		const ref = formatAccountingRef('AP-VC', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('AP-VC', docNo, id))) {
			return null
		}

		const total = roundMoney(c.totalAmount ?? 0)
		if (total <= 0) return null

		const ap = await this.resolveAccount(organizationId, 'accounts_payable')
		const expense = await this.resolveAccount(organizationId, 'operating_expense')
		const entryDate = c.creditDate ? new Date(c.creditDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Vendor credit ${docNo}`,
			lines: [
				{ accountCode: ap.accountCode, accountName: ap.accountName, debit: total, credit: 0, description: docNo },
				{ accountCode: expense.accountCode, accountName: expense.accountName, debit: 0, credit: total, description: docNo },
			],
			glPairs: [{ debit: ap, credit: expense, amount: total, description: `Vendor credit ${docNo}` }],
			referenceModule: 'vendor_credit',
			referenceId: id,
			transactionType: 'VENDOR_CREDIT',
		})
	}

	/** GRN confirmed: Dr Inventory, Cr GRN clearing. */
	async postGrnReceipt(grn: any, userId: string) {
		const g = plainDoc(grn)
		const organizationId = orgIdOf(g)
		const id = docId(g)
		if (!organizationId || !id) return null
		if (String(g.status ?? '') !== 'confirmed') return null

		const docNo = String(g.grnNumber || '').trim() || id
		const ref = formatAccountingRef('INV-GRN', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('INV-GRN', docNo, id))) {
			return null
		}

		const lines: any[] = g.lineItems ?? []
		const total = roundMoney(
			lines.reduce(
				(s: number, l: any) => s + (Number(l.receivedQty) || 0) * (Number(l.unitPrice) || 0),
				0,
			),
		)
		if (total <= 0) return null

		const inventory = await this.resolveAccount(organizationId, 'inventory_asset')
		const clearing = await this.resolveAccount(organizationId, 'inventory_clearing')
		const entryDate = g.receivedDate ? new Date(g.receivedDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `GRN receipt ${docNo}`,
			lines: [
				{ accountCode: inventory.accountCode, accountName: inventory.accountName, debit: total, credit: 0, description: docNo },
				{ accountCode: clearing.accountCode, accountName: clearing.accountName, debit: 0, credit: total, description: docNo },
			],
			glPairs: [{ debit: inventory, credit: clearing, amount: total, description: `GRN ${docNo}` }],
			referenceModule: 'grn',
			referenceId: id,
			transactionType: 'GRN_RECEIPT',
		})
	}

	/** Material receipt confirmed: Dr Inventory, Cr clearing (same pattern as GRN). */
	async postMaterialReceipt(mrn: any, userId: string) {
		const g = plainDoc(mrn)
		const organizationId = orgIdOf(g)
		const id = docId(g)
		if (!organizationId || !id) return null
		if (String(g.status ?? '') !== 'confirmed') return null

		const docNo = String(g.mrnNumber || '').trim() || id
		const ref = formatAccountingRef('INV-MRN', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('INV-MRN', docNo, id))) {
			return null
		}

		const total = roundMoney(
			Number(g.totalAmount) ||
				(g.lineItems ?? []).reduce(
					(s: number, l: any) => s + (Number(l.receivedQty) || 0) * (Number(l.unitPrice) || 0),
					0,
				),
		)
		if (total <= 0) return null

		const inventory = await this.resolveAccount(organizationId, 'inventory_asset')
		const clearing = await this.resolveAccount(organizationId, 'inventory_clearing')
		const entryDate = g.receiptDate ? new Date(g.receiptDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Material receipt ${docNo}`,
			lines: [
				{ accountCode: inventory.accountCode, accountName: inventory.accountName, debit: total, credit: 0, description: docNo },
				{ accountCode: clearing.accountCode, accountName: clearing.accountName, debit: 0, credit: total, description: docNo },
			],
			glPairs: [{ debit: inventory, credit: clearing, amount: total, description: `MRN ${docNo}` }],
			referenceModule: 'material_receipt',
			referenceId: id,
			transactionType: 'MATERIAL_RECEIPT',
		})
	}

	/** Stock adjustment confirmed. */
	async postStockAdjustment(adjustment: any, userId: string) {
		const adj = plainDoc(adjustment)
		const organizationId = orgIdOf(adj)
		const id = docId(adj)
		if (!organizationId || !id) return null
		if (String(adj.status ?? '') !== 'confirmed') return null

		const docNo = String(adj.adjNumber || '').trim() || id
		const ref = formatAccountingRef('INV-SA', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('INV-SA', docNo, id))) {
			return null
		}

		const lineItems: any[] = adj.lineItems ?? []
		let increaseVal = 0
		let decreaseVal = 0
		for (const line of lineItems) {
			const diff = Number(line.difference ?? 0)
			const qty = Math.abs(diff) || Math.abs(Number(line.adjustedQty) - Number(line.currentQty)) || 0
			const val = roundMoney(qty * (Number(line.unitCost) || 1))
			if (diff > 0 || ['increase', 'recount'].includes(String(adj.adjustmentType)) && diff >= 0) {
				increaseVal += val
			} else {
				decreaseVal += val
			}
		}
		if (String(adj.adjustmentType) === 'decrease' || adj.adjustmentType === 'write-off') {
			decreaseVal = decreaseVal || roundMoney(lineItems.length)
		}

		const inventory = await this.resolveAccount(organizationId, 'inventory_asset')
		const entryDate = adj.adjDate ? new Date(adj.adjDate) : new Date()
		const lines: Array<{ accountCode: string; accountName: string; debit: number; credit: number; description?: string }> = []
		const glPairs: Array<{ debit: CoaRef; credit: CoaRef; amount: number; description: string }> = []

		if (increaseVal > 0.009) {
			const gain = await this.resolveAccount(organizationId, 'inventory_gain')
			lines.push(
				{ accountCode: inventory.accountCode, accountName: inventory.accountName, debit: increaseVal, credit: 0, description: docNo },
				{ accountCode: gain.accountCode, accountName: gain.accountName, debit: 0, credit: increaseVal, description: docNo },
			)
			glPairs.push({ debit: inventory, credit: gain, amount: increaseVal, description: `Stock adj ${docNo} gain` })
		}
		if (decreaseVal > 0.009) {
			const shrink = await this.resolveAccount(organizationId, 'inventory_shrinkage')
			lines.push(
				{ accountCode: shrink.accountCode, accountName: shrink.accountName, debit: decreaseVal, credit: 0, description: docNo },
				{ accountCode: inventory.accountCode, accountName: inventory.accountName, debit: 0, credit: decreaseVal, description: docNo },
			)
			glPairs.push({ debit: shrink, credit: inventory, amount: decreaseVal, description: `Stock adj ${docNo} loss` })
		}
		if (lines.length === 0) return null

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Stock adjustment ${docNo}`,
			lines,
			glPairs,
			referenceModule: 'stock_adjustment',
			referenceId: id,
			transactionType: 'STOCK_ADJUSTMENT',
		})
	}

	/** Payroll run accrual after compute. */
	async postPayrollRun(payrollRunId: string, userId: string) {
		const run = await PayrollManagement.findById(payrollRunId).exec()
		if (!run) return null
		const organizationId = String(run.organizationId)
		const docNo = String(run.docNumber || '').trim() || payrollRunId
		const ref = formatAccountingRef('PR-PAY', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('PR-PAY', docNo, payrollRunId))) {
			return null
		}

		const slips = await Payslip.find({ payrollRunId, isDeleted: false }).exec()
		let gross = 0
		let net = 0
		let statutory = 0
		for (const s of slips) {
			gross += Number((s as any).grossEarnings) || 0
			net += Number((s as any).netPay) || 0
			statutory +=
				(Number((s as any).pfEmployee) || 0) +
				(Number((s as any).pfEmployer) || 0) +
				(Number((s as any).esiEmployee) || 0) +
				(Number((s as any).esiEmployer) || 0) +
				(Number((s as any).tds) || 0)
		}
		gross = roundMoney(gross)
		net = roundMoney(net)
		statutory = roundMoney(statutory)
		if (gross <= 0) return null

		const expense = await this.resolveAccount(organizationId, 'payroll_expense')
		const payable = await this.resolveAccount(organizationId, 'payroll_payable')
		const statAcct = await this.resolveAccount(organizationId, 'statutory_payable')
		const entryDate = run.payPeriodEnd ? new Date(run.payPeriodEnd) : new Date()

		const lines: Array<{ accountCode: string; accountName: string; debit: number; credit: number; description?: string }> = [
			{ accountCode: expense.accountCode, accountName: expense.accountName, debit: gross, credit: 0, description: docNo },
			{ accountCode: payable.accountCode, accountName: payable.accountName, debit: 0, credit: net, description: docNo },
		]
		const glPairs: Array<{ debit: CoaRef; credit: CoaRef; amount: number; description: string }> = [
			{ debit: expense, credit: payable, amount: net, description: `Payroll ${docNo} — net` },
		]

		if (statutory > 0.009) {
			lines.push({ accountCode: statAcct.accountCode, accountName: statAcct.accountName, debit: 0, credit: statutory, description: docNo })
			glPairs.push({ debit: expense, credit: statAcct, amount: statutory, description: `Payroll ${docNo} — statutory` })
		}

		const remainder = roundMoney(gross - net - statutory)
		if (remainder > 0.009) {
			lines.push({ accountCode: payable.accountCode, accountName: payable.accountName, debit: 0, credit: remainder, description: `${docNo} other` })
			glPairs.push({ debit: expense, credit: payable, amount: remainder, description: `Payroll ${docNo} — deductions` })
		}

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Payroll accrual ${docNo}`,
			lines,
			glPairs,
			referenceModule: 'payroll_run',
			referenceId: payrollRunId,
			transactionType: 'PAYROLL_ACCRUAL',
		})
	}

	/** Fixed asset depreciation for a period. */
	async postFixedAssetDepreciation(asset: any, amount: number, userId: string, periodLabel?: string) {
		const a = plainDoc(asset)
		const organizationId = orgIdOf(a)
		const id = docId(a)
		if (!organizationId || !id) return null

		const amt = roundMoney(amount)
		if (amt <= 0) return null

		const docNo = String(a.assetCode || id).trim()
		const suffix = periodLabel ? `${docNo}-${periodLabel}` : `${docNo}-DEP`
		const ref = formatAccountingRef('FA-DEP', suffix)
		if (await this.alreadyPostedAny(organizationId, [ref])) return null

		const depExp = await this.resolveAccount(organizationId, 'depreciation_expense')
		const accDep = await this.resolveAccount(organizationId, 'accumulated_depreciation')
		const entryDate = new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Depreciation ${docNo}`,
			lines: [
				{ accountCode: depExp.accountCode, accountName: depExp.accountName, debit: amt, credit: 0, description: docNo },
				{ accountCode: accDep.accountCode, accountName: accDep.accountName, debit: 0, credit: amt, description: docNo },
			],
			glPairs: [{ debit: depExp, credit: accDep, amount: amt, description: `Depreciation ${docNo}` }],
			referenceModule: 'fixed_asset',
			referenceId: id,
			transactionType: 'DEPRECIATION',
		})
	}

	async syncVendorBillAccounting(billId: string, userId: string) {
		return this.ensureVendorBillPosted(billId, userId)
	}

	private async resolveBankGlAccount(organizationId: string, bankAccountNumber: string): Promise<CoaRef> {
		const all = await this.coaRepo.findByOrganization(organizationId)
		const no = String(bankAccountNumber).trim()
		const match = all.find(
			(a: IChartOfAccounts) =>
				a.isActive !== false && new RegExp(no.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(String(a.accountName ?? '')),
		)
		if (match) {
			return { accountCode: String(match.accountCode), accountName: String(match.accountName) }
		}
		const created = await this.glService.createChartOfAccount({
			organizationId,
			accountName: `Bank ${no}`,
			accountType: 'asset',
			isActive: true,
			level: 2,
		} as Partial<IChartOfAccounts>)
		return { accountCode: String(created.accountCode), accountName: String(created.accountName) }
	}

	/** Internal bank transfer: Dr destination bank GL, Cr source bank GL. */
	async postBankTransfer(
		input: {
			organizationId: string
			transferDate: Date | string
			fromAccountNumber: string
			toAccountNumber: string
			amount: number
			transferId: string
			description?: string
		},
		userId: string,
	) {
		const organizationId = String(input.organizationId)
		const ref = formatAccountingRef('BNK-TF', input.transferId)
		if (await this.alreadyPostedAny(organizationId, [ref])) return null

		const amt = roundMoney(input.amount)
		if (amt <= 0) return null

		const fromAcct = await this.resolveBankGlAccount(organizationId, input.fromAccountNumber)
		const toAcct = await this.resolveBankGlAccount(organizationId, input.toAccountNumber)
		const entryDate = input.transferDate ? new Date(input.transferDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: input.description || `Bank transfer ${input.transferId}`,
			lines: [
				{ accountCode: toAcct.accountCode, accountName: toAcct.accountName, debit: amt, credit: 0 },
				{ accountCode: fromAcct.accountCode, accountName: fromAcct.accountName, debit: 0, credit: amt },
			],
			glPairs: [{ debit: toAcct, credit: fromAcct, amount: amt, description: `Bank transfer ${input.transferId}` }],
			referenceModule: 'bank_transfer',
			referenceId: input.transferId,
			transactionType: 'BANK_TRANSFER',
		})
	}

	/** Inter-location stock transfer: Dr Inventory (destination), Cr Inventory (source). */
	async postStockTransfer(transfer: any, userId: string, transferValue: number) {
		const t = plainDoc(transfer)
		const organizationId = orgIdOf(t)
		const id = docId(t)
		if (!organizationId || !id) return null

		const docNo = String(t.transferNumber || '').trim() || id
		const ref = formatAccountingRef('INV-ST', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('INV-ST', docNo, id))) {
			return null
		}

		const amount = roundMoney(transferValue)
		if (amount <= 0) return null

		const fromBin = String(t.fromWarehouseName || t.fromWarehouseId || 'MAIN').trim() || 'MAIN'
		const toBin = String(t.toWarehouseName || t.toWarehouseId || 'MAIN').trim() || 'MAIN'

		const fromInv = await this.resolveInventoryLocationAccount(organizationId, fromBin)
		const toInv = await this.resolveInventoryLocationAccount(organizationId, toBin)
		const entryDate = t.transferDate ? new Date(t.transferDate) : new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Stock transfer ${docNo}`,
			lines: [
				{ accountCode: toInv.accountCode, accountName: toInv.accountName, debit: amount, credit: 0, description: docNo },
				{ accountCode: fromInv.accountCode, accountName: fromInv.accountName, debit: 0, credit: amount, description: docNo },
			],
			glPairs: [{ debit: toInv, credit: fromInv, amount, description: `Stock transfer ${docNo}` }],
			referenceModule: 'stock_transfer',
			referenceId: id,
			transactionType: 'STOCK_TRANSFER',
		})
	}

	private async resolveInventoryLocationAccount(
		organizationId: string,
		locationLabel: string,
	): Promise<CoaRef> {
		const all = await this.coaRepo.findByOrganization(organizationId)
		const label = String(locationLabel).trim()
		const match = all.find(
			(a: IChartOfAccounts) =>
				a.isActive !== false &&
				new RegExp(`inventory.*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(
					String(a.accountName ?? ''),
				),
		)
		if (match) {
			return { accountCode: String(match.accountCode), accountName: String(match.accountName) }
		}
		const created = await this.glService.createChartOfAccount({
			organizationId,
			accountName: `Inventory — ${label}`,
			accountType: 'asset',
			isActive: true,
			level: 2,
		} as Partial<IChartOfAccounts>)
		return { accountCode: String(created.accountCode), accountName: String(created.accountName) }
	}

	/** Production plan completed: capitalize WIP to finished goods. */
	async postProductionCompletion(plan: any, userId: string) {
		const p = plainDoc(plan)
		const organizationId = orgIdOf(p)
		const id = docId(p)
		if (!organizationId || !id) return null

		const docNo = String(p.docNumber || '').trim() || id
		const ref = formatAccountingRef('PRD-COMP', docNo)
		if (await this.alreadyPostedAny(organizationId, legacyAccountingRefCandidates('PRD-COMP', docNo, id))) {
			return null
		}

		const amount = roundMoney(p.actualCost ?? 0)
		if (amount <= 0) return null

		const fg = await this.resolveAccount(organizationId, 'finished_goods')
		const wip = await this.resolveAccount(organizationId, 'wip')
		const entryDate = new Date()

		return this.createPostedJournal({
			organizationId,
			userId,
			referenceNumber: ref,
			entryDate,
			description: `Production complete ${docNo}`,
			lines: [
				{ accountCode: fg.accountCode, accountName: fg.accountName, debit: amount, credit: 0, description: docNo },
				{ accountCode: wip.accountCode, accountName: wip.accountName, debit: 0, credit: amount, description: docNo },
			],
			glPairs: [{ debit: fg, credit: wip, amount, description: `Production ${docNo}` }],
			referenceModule: 'production_planning',
			referenceId: id,
			transactionType: 'PRODUCTION_COMPLETE',
		})
	}
}

export const accountingPosting = new AccountingPostingService()
