import { GraphQLValidationError } from '@repo/errors'
import { IntercompanyJournalRepository } from './repository'

export interface JournalLineInput {
	organizationId: string
	account: string
	accountName?: string
	costCenter?: string
	debit?: number
	credit?: number
	description?: string
}

export interface JournalEntryInput {
	originatingOrganizationId: string
	docNumber: string
	entryDate: string | Date
	description?: string
	allocationId?: string | null
	lines: JournalLineInput[]
	notes?: string
	status?: string
}

export class IntercompanyJournalService {
	private repository: IntercompanyJournalRepository

	constructor() {
		this.repository = new IntercompanyJournalRepository()
	}

	async create(input: JournalEntryInput): Promise<any> {
		this.validate(input)
		const totals = input.lines.reduce(
			(s, l) => ({ debit: s.debit + Number(l.debit ?? 0), credit: s.credit + Number(l.credit ?? 0) }),
			{ debit: 0, credit: 0 },
		)
		return this.repository.create({
			...input,
			docNumber: input.docNumber.trim().toUpperCase(),
			lines: input.lines.map((l) => ({
				...l,
				debit: Number(l.debit ?? 0),
				credit: Number(l.credit ?? 0),
			})),
			totalDebit: Math.round(totals.debit * 100) / 100,
			totalCredit: Math.round(totals.credit * 100) / 100,
		})
	}

	async update(id: string, input: Partial<JournalEntryInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.docNumber) patch.docNumber = input.docNumber.trim().toUpperCase()
		if (Array.isArray(input.lines)) {
			const totals = input.lines.reduce(
				(s, l) => ({ debit: s.debit + Number(l.debit ?? 0), credit: s.credit + Number(l.credit ?? 0) }),
				{ debit: 0, credit: 0 },
			)
			patch.totalDebit = Math.round(totals.debit * 100) / 100
			patch.totalCredit = Math.round(totals.credit * 100) / 100
		}
		return this.repository.update(id, patch as any)
	}

	async list(originatingOrganizationId: string, filters: any = {}) {
		return this.repository.list(originatingOrganizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	async post(id: string, userId: string): Promise<any> {
		return this.repository.update(id, {
			status: 'POSTED',
			postedAt: new Date(),
			postedByUserId: userId,
		} as any)
	}

	async reverse(id: string, userId: string): Promise<any> {
		const original = await this.repository.findById(id)
		if (!original || original.deletedAt) throw new GraphQLValidationError('Journal not found')
		// Create reversal: swap debit↔credit, link via reversalOfId
		const reversal = await this.repository.create({
			originatingOrganizationId: original.originatingOrganizationId,
			docNumber: `${original.docNumber}-REV`,
			entryDate: new Date(),
			description: `Reversal of ${original.docNumber}`,
			allocationId: original.allocationId,
			lines: (original.lines ?? []).map((l: any) => ({
				organizationId: l.organizationId,
				account: l.account,
				accountName: l.accountName,
				costCenter: l.costCenter,
				debit: Number(l.credit ?? 0),
				credit: Number(l.debit ?? 0),
				description: l.description,
			})),
			totalDebit: Number(original.totalCredit ?? 0),
			totalCredit: Number(original.totalDebit ?? 0),
			status: 'POSTED',
			postedAt: new Date(),
			postedByUserId: userId,
			reversalOfId: original._id,
		})
		await this.repository.update(id, { status: 'REVERSED' } as any)
		return reversal
	}

	private validate(input: JournalEntryInput) {
		if (!input.originatingOrganizationId) throw new GraphQLValidationError('originatingOrganizationId is required')
		if (!input.docNumber?.trim()) throw new GraphQLValidationError('Doc number is required')
		if (!input.entryDate) throw new GraphQLValidationError('Entry date is required')
		if (!Array.isArray(input.lines) || input.lines.length < 2) {
			throw new GraphQLValidationError('A journal entry needs at least 2 lines')
		}
		const orgIds = new Set(input.lines.map((l) => String(l.organizationId)))
		if (orgIds.size < 2) {
			throw new GraphQLValidationError('Intercompany journal must touch at least 2 organizations')
		}
		const totals = input.lines.reduce(
			(s, l) => ({ debit: s.debit + Number(l.debit ?? 0), credit: s.credit + Number(l.credit ?? 0) }),
			{ debit: 0, credit: 0 },
		)
		if (Math.abs(totals.debit - totals.credit) > 0.01) {
			throw new GraphQLValidationError(`Journal is unbalanced (debit ${totals.debit.toFixed(2)} vs credit ${totals.credit.toFixed(2)})`)
		}
		for (const l of input.lines) {
			if (!l.account?.trim()) throw new GraphQLValidationError('Each line needs an account')
			if (!l.organizationId) throw new GraphQLValidationError('Each line needs an organizationId')
			if (Number(l.debit ?? 0) > 0 && Number(l.credit ?? 0) > 0) {
				throw new GraphQLValidationError('A line can be debit OR credit, not both')
			}
		}
	}
}
