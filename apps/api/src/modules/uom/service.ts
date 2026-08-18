import { GraphQLValidationError } from '@repo/errors'
import { UomRepository } from './repository'

export interface UomInput {
	name: string
	category: string
	ratio?: number
	type?: 'reference' | 'bigger' | 'smaller'
	gstUqc?: string
	isActive?: boolean
	organizationId: string
}

const DEFAULT_UOMS: Array<{ name: string; category: string; ratio: number; type: 'reference' | 'bigger' | 'smaller'; gstUqc: string }> = [
	{ name: 'Nos', category: 'Unit', ratio: 1, type: 'reference', gstUqc: 'NOS' },
	{ name: 'Box', category: 'Unit', ratio: 1, type: 'reference', gstUqc: 'BOX' },
	{ name: 'kg', category: 'Weight', ratio: 1, type: 'reference', gstUqc: 'KGS' },
	{ name: 'g', category: 'Weight', ratio: 0.001, type: 'smaller', gstUqc: 'GMS' },
	{ name: 'Litre', category: 'Volume', ratio: 1, type: 'reference', gstUqc: 'LTR' },
	{ name: 'Meter', category: 'Length', ratio: 1, type: 'reference', gstUqc: 'MTR' },
]

export class UomService {
	private repository: UomRepository

	constructor() {
		this.repository = new UomRepository()
	}

	async create(input: UomInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('UoM name is required')
		if (!input.category?.trim()) throw new GraphQLValidationError('UoM category is required')
		return this.repository.create({
			...input,
			name: input.name.trim(),
			category: input.category.trim(),
			ratio: input.ratio ?? 1,
			type: input.type ?? 'reference',
			gstUqc: input.gstUqc?.trim() || '',
			isActive: input.isActive !== false,
		} as any)
	}

	async update(id: string, input: Partial<UomInput>) {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		if (typeof patch.category === 'string') patch.category = patch.category.trim()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: { category?: string; isActive?: boolean } = {}) {
		return this.repository.listForOrganization(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	/** Idempotent seed of common Indian-GST-aligned UoMs (Nos/Box/kg/g/Litre/Meter) for a new org. */
	async ensureDefaultsForOrganization(organizationId: string, userId?: string) {
		const existing = await this.repository.listForOrganization(organizationId)
		if (existing.length) return existing
		const created = []
		for (const u of DEFAULT_UOMS) {
			created.push(
				await this.repository.create({
					...u,
					isActive: true,
					organizationId,
					...(userId ? { createdBy: userId, updatedBy: userId } : {}),
				} as any),
			)
		}
		return created
	}
}
