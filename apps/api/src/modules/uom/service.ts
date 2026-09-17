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

function isDuplicateKeyError(err: unknown): boolean {
	const e = err as { code?: number; message?: string }
	return e?.code === 11000 || /E11000|duplicate key/i.test(String(e?.message ?? ''))
}

export class UomService {
	private repository: UomRepository

	constructor() {
		this.repository = new UomRepository()
	}

	async create(input: UomInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('UoM name is required')
		if (!input.category?.trim()) throw new GraphQLValidationError('UoM category is required')
		try {
			return await this.repository.create({
				...input,
				name: input.name.trim(),
				category: input.category.trim(),
				ratio: input.ratio ?? 1,
				type: input.type ?? 'reference',
				gstUqc: input.gstUqc?.trim() || '',
				isActive: input.isActive !== false,
			} as any)
		} catch (err) {
			if (isDuplicateKeyError(err)) {
				throw new GraphQLValidationError(`A unit of measure named "${input.name.trim()}" already exists`)
			}
			throw err
		}
	}

	async update(id: string, input: Partial<UomInput>) {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		if (typeof patch.category === 'string') patch.category = patch.category.trim()
		try {
			return await this.repository.update(id, patch as any)
		} catch (err) {
			if (isDuplicateKeyError(err)) {
				throw new GraphQLValidationError('A unit of measure with that name already exists')
			}
			throw err
		}
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

	/**
	 * Idempotent seed of common Indian-GST-aligned UoMs.
	 * Skips names that already exist (including soft-deleted) and restores soft-deleted defaults.
	 */
	async ensureDefaultsForOrganization(organizationId: string, userId?: string) {
		for (const u of DEFAULT_UOMS) {
			const existing = await this.repository.findByNameIncludingDeleted(organizationId, u.name)
			if (existing) {
				const deleted = (existing as any).deletedAt != null
				if (deleted || (existing as any).isActive === false) {
					await this.repository.update(String((existing as any)._id ?? (existing as any).id), {
						deletedAt: null,
						isActive: true,
						category: u.category,
						ratio: u.ratio,
						type: u.type,
						gstUqc: u.gstUqc,
						...(userId ? { updatedBy: userId } : {}),
					} as any)
				}
				continue
			}

			try {
				await this.repository.create({
					...u,
					isActive: true,
					organizationId,
					...(userId ? { createdBy: userId, updatedBy: userId } : {}),
				} as any)
			} catch (err) {
				// Concurrent ensureDefaults (e.g. React Strict Mode) — treat as success
				if (isDuplicateKeyError(err)) continue
				throw err
			}
		}

		return this.repository.listForOrganization(organizationId)
	}
}
