import { GraphQLValidationError } from '@repo/errors'
import { TaxRateRepository } from './repository'

export interface TaxRateInput {
	name: string
	code: string
	ratePercent: number
	taxType?: string
	appliesTo?: string
	hsnSacCode?: string
	description?: string
	isCompound?: boolean
	isInclusive?: boolean
	status?: string
	effectiveFrom?: string | Date
	effectiveTo?: string | Date
	organizationId: string
}

export class TaxRateService {
	private repository: TaxRateRepository
	constructor() {
		this.repository = new TaxRateRepository()
	}

	async create(input: TaxRateInput): Promise<any> {
		if (!input.name?.trim()) throw new GraphQLValidationError('Tax rate name is required')
		if (!input.code?.trim()) throw new GraphQLValidationError('Tax rate code is required')
		if (typeof input.ratePercent !== 'number' || input.ratePercent < 0 || input.ratePercent > 100) {
			throw new GraphQLValidationError('Rate percent must be between 0 and 100')
		}
		return this.repository.create({
			...input,
			name: input.name.trim(),
			code: input.code.trim().toUpperCase(),
		})
	}

	async update(id: string, input: Partial<TaxRateInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		if (typeof patch.code === 'string') patch.code = (patch.code as string).trim().toUpperCase()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: { status?: string; appliesTo?: string; search?: string } = {}) {
		return this.repository.listForOrganization(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}
}
