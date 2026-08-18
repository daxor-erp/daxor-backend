import { GraphQLValidationError } from '@repo/errors'
import { PaymentTermRepository } from './repository'

export interface PaymentTermInput {
	name: string
	dueDays?: number
	description?: string
	isActive?: boolean
	organizationId: string
}

const DEFAULT_TERMS: Array<{ name: string; dueDays: number }> = [
	{ name: 'Due on Receipt', dueDays: 0 },
	{ name: 'Net 15', dueDays: 15 },
	{ name: 'Net 30', dueDays: 30 },
	{ name: 'Net 45', dueDays: 45 },
	{ name: 'Net 60', dueDays: 60 },
]

export class PaymentTermService {
	private repository: PaymentTermRepository

	constructor() {
		this.repository = new PaymentTermRepository()
	}

	async create(input: PaymentTermInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('Payment term name is required')
		return this.repository.create({
			...input,
			name: input.name.trim(),
			dueDays: input.dueDays ?? 0,
			isActive: input.isActive !== false,
		})
	}

	async update(id: string, input: Partial<PaymentTermInput>) {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: { isActive?: boolean } = {}) {
		return this.repository.listForOrganization(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	/** Seed the standard Net 15/30/45/60 + Due on Receipt terms for a new org (idempotent, best-effort). */
	async ensureDefaultsForOrganization(organizationId: string, userId?: string) {
		const existing = await this.repository.listForOrganization(organizationId)
		if (existing.length) return existing
		const created = []
		for (const t of DEFAULT_TERMS) {
			created.push(
				await this.repository.create({
					name: t.name,
					dueDays: t.dueDays,
					isActive: true,
					organizationId,
					...(userId ? { createdBy: userId, updatedBy: userId } : {}),
				} as any),
			)
		}
		return created
	}
}
