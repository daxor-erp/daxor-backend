import { GraphQLValidationError } from '@repo/errors'
import { AttributeRepository } from './repository'

export interface AttributeInput {
	name: string
	values?: string[]
	isActive?: boolean
	organizationId: string
}

export class AttributeService {
	private repository: AttributeRepository

	constructor() {
		this.repository = new AttributeRepository()
	}

	async create(input: AttributeInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('Attribute name is required')
		const values = Array.from(new Set((input.values ?? []).map((v) => v.trim()).filter(Boolean)))
		return this.repository.create({
			name: input.name.trim(),
			values: values.map((v) => ({ value: v })),
			isActive: input.isActive !== false,
			organizationId: input.organizationId,
		} as any)
	}

	async update(id: string, input: Partial<AttributeInput>) {
		const patch: Record<string, unknown> = {}
		if (input.name != null) patch.name = input.name.trim()
		if (input.values != null) {
			const values = Array.from(new Set(input.values.map((v) => v.trim()).filter(Boolean)))
			patch.values = values.map((v) => ({ value: v }))
		}
		if (input.isActive != null) patch.isActive = input.isActive
		return this.repository.update(id, patch as any)
	}

	async addValue(id: string, value: string) {
		const attr = await this.repository.findById(id)
		if (!attr) throw new GraphQLValidationError('Attribute not found')
		const trimmed = value.trim()
		if (!trimmed) throw new GraphQLValidationError('Value is required')
		const existingValues = ((attr as any).values ?? []).map((v: any) => v.value)
		if (existingValues.includes(trimmed)) return attr
		return this.repository.update(id, { values: [...(attr as any).values, { value: trimmed }] } as any)
	}

	async list(organizationId: string, isActive?: boolean) {
		return this.repository.listForOrganization(organizationId, isActive)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async findByIds(ids: string[]) {
		if (!ids?.length) return []
		return this.repository.findAll({ _id: { $in: ids } } as any)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}
}
