import { CustomerInvoiceService } from '../customer-invoice/service'
import { FinanceChargeAssessmentRepository } from './repository'

const DAY_MS = 86_400_000

function addDays(d: Date, days: number): Date {
	const x = new Date(d)
	x.setDate(x.getDate() + days)
	return x
}

export class FinanceChargeAssessmentService {
	private repository: FinanceChargeAssessmentRepository
	private invoiceService: CustomerInvoiceService

	constructor() {
		this.repository = new FinanceChargeAssessmentRepository()
		this.invoiceService = new CustomerInvoiceService()
	}

	private async generateAssessmentNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		return `FC-${`${organizationId}`.slice(-4).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
	}

	private async buildLines(
		organizationId: string,
		asOfDate: Date,
		annualRatePercent: number,
	): Promise<
		Array<{
			invoiceId: any
			invoiceNumber: string
			customerId: any
			daysOverdue: number
			outstandingBefore: number
			chargeAmount: number
		}>
	> {
		const filter = {
			organizationId,
			deletedAt: null,
			status: { $in: ['sent', 'partially_paid', 'overdue', 'approved'] },
		}
		const result = await this.invoiceService.findWithPagination(filter, {
			page: 1,
			limit: 5000,
			sortBy: 'dueDate',
			sortOrder: 'asc',
		})
		const data = result.data ?? []
		const lines: Array<{
			invoiceId: any
			invoiceNumber: string
			customerId: any
			daysOverdue: number
			outstandingBefore: number
			chargeAmount: number
		}> = []

		const asOfDay = new Date(asOfDate)
		asOfDay.setHours(0, 0, 0, 0)

		for (const inv of data) {
			const outstanding = Number(inv.totalAmount ?? 0) - Number(inv.paidAmount ?? 0)
			if (outstanding <= 0.01) continue

			const invDate = inv.invoiceDate ? new Date(inv.invoiceDate) : new Date()
			const due = inv.dueDate ? new Date(inv.dueDate) : addDays(invDate, 30)
			due.setHours(0, 0, 0, 0)

			if (asOfDay <= due) continue

			const daysOverdue = Math.floor((asOfDay.getTime() - due.getTime()) / DAY_MS)
			if (daysOverdue < 1) continue

			const charge =
				Math.round(outstanding * (annualRatePercent / 100) * (daysOverdue / 365) * 100) / 100
			if (charge < 0.01) continue

			const cid = inv.customerId ?? inv.clientId
			if (!cid) continue

			lines.push({
				invoiceId: inv._id,
				invoiceNumber: String(inv.invoiceNumber || inv.seqNo || ''),
				customerId: cid,
				daysOverdue,
				outstandingBefore: Math.round(outstanding * 100) / 100,
				chargeAmount: charge,
			})
		}

		return lines
	}

	async createDraft(input: {
		organizationId: string
		asOfDate: string
		annualRatePercent: number
		notes?: string
	}, userId: string) {
		const asOf = new Date(input.asOfDate)
		const lines = await this.buildLines(input.organizationId, asOf, input.annualRatePercent)
		const totalChargeAmount = Math.round(lines.reduce((s, l) => s + l.chargeAmount, 0) * 100) / 100
		const assessmentNumber = await this.generateAssessmentNumber(input.organizationId)

		return this.repository.create({
			assessmentNumber,
			organizationId: input.organizationId,
			asOfDate: asOf,
			annualRatePercent: input.annualRatePercent,
			status: 'draft',
			lines,
			totalChargeAmount,
			notes: input.notes,
			createdBy: userId,
			updatedBy: userId,
		})
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async list(organizationId: string, filter: Record<string, unknown> = {}, page = 1, limit = 100) {
		const f = { organizationId, deletedAt: null, ...filter }
		const result = await this.repository.findPaginated(f as any, page, limit, { createdAt: -1 })
		return result.data
	}

	async post(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Finance charge assessment not found')
		if ((doc as any).deletedAt) throw new Error('Assessment was deleted')
		if (doc.status !== 'draft') throw new Error('Only draft assessments can be posted')
		const lines = doc.lines ?? []
		if (!lines.length) throw new Error('Nothing to post — no charge lines in this assessment')

		const assessmentNumber = doc.assessmentNumber

		for (const line of lines) {
			const invoiceId = line.invoiceId?.toString?.() ?? String(line.invoiceId)
			await this.invoiceService.applyFinanceCharge(invoiceId, line.chargeAmount, assessmentNumber)
		}

		await this.repository.update(id, {
			status: 'posted',
			postedAt: new Date(),
			postedBy: userId,
			updatedBy: userId,
		})
		return this.repository.findById(id)
	}

	async cancel(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Finance charge assessment not found')
		if ((doc as any).deletedAt) throw new Error('Assessment was deleted')
		if (doc.status !== 'draft') throw new Error('Only draft assessments can be cancelled')
		await this.repository.update(id, {
			status: 'cancelled',
			updatedBy: userId,
		})
		return this.repository.findById(id)
	}

	async softDelete(id: string, userId: string) {
		return this.repository.update(id, { deletedAt: new Date(), updatedBy: userId })
	}
}
