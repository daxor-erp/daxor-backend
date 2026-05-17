import { GraphQLValidationError } from '@repo/errors'
import { IntercompanyAllocationRepository } from './repository'

export interface AllocationLineInput {
	targetOrganizationId: string
	targetOrganizationName?: string
	percentage: number
	costCenter?: string
	notes?: string
}

export interface IntercompanyAllocationInput {
	organizationId: string
	scheduleCode: string
	name: string
	description?: string
	sourceAccount: string
	basisAmount: number
	basisDate: string | Date
	allocationMethod?: string
	lines: AllocationLineInput[]
	notes?: string
	status?: string
}

export class IntercompanyAllocationService {
	private repository: IntercompanyAllocationRepository

	constructor() {
		this.repository = new IntercompanyAllocationRepository()
	}

	async create(input: IntercompanyAllocationInput): Promise<any> {
		this.validate(input)
		const linesWithAmounts = input.lines.map((l) => ({
			...l,
			amount: Math.round((Number(input.basisAmount) * Number(l.percentage)) / 100 * 100) / 100,
		}))
		const totalAllocated = linesWithAmounts.reduce((s, l) => s + l.amount, 0)
		return this.repository.create({
			...input,
			scheduleCode: input.scheduleCode.trim().toUpperCase(),
			lines: linesWithAmounts,
			totalAllocated,
		})
	}

	async update(id: string, input: Partial<IntercompanyAllocationInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.scheduleCode) patch.scheduleCode = input.scheduleCode.trim().toUpperCase()
		if (Array.isArray(input.lines)) {
			const basis = Number(input.basisAmount ?? 0)
			const recomputed = input.lines.map((l) => ({
				...l,
				amount: Math.round((basis * Number(l.percentage)) / 100 * 100) / 100,
			}))
			patch.lines = recomputed
			patch.totalAllocated = recomputed.reduce((s, l) => s + l.amount, 0)
		}
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: any = {}) {
		return this.repository.list(organizationId, filters)
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

	async reverse(id: string): Promise<any> {
		return this.repository.update(id, { status: 'REVERSED' } as any)
	}

	private validate(input: IntercompanyAllocationInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.scheduleCode?.trim()) throw new GraphQLValidationError('Schedule code is required')
		if (!input.name?.trim()) throw new GraphQLValidationError('Name is required')
		if (!input.sourceAccount?.trim()) throw new GraphQLValidationError('Source account is required')
		if (!Number.isFinite(input.basisAmount) || input.basisAmount < 0) {
			throw new GraphQLValidationError('Basis amount must be ≥ 0')
		}
		if (!Array.isArray(input.lines) || input.lines.length === 0) {
			throw new GraphQLValidationError('At least one allocation line is required')
		}
		const totalPct = input.lines.reduce((s, l) => s + Number(l.percentage ?? 0), 0)
		if (Math.abs(totalPct - 100) > 0.01) {
			throw new GraphQLValidationError(`Allocation percentages must sum to 100 (currently ${totalPct.toFixed(2)})`)
		}
	}
}
