import { GraphQLValidationError } from '@repo/errors'
import { TagRepository } from './repository'

export interface TagInput {
	name: string
	color?: string
	category?: string
	isActive?: boolean
	organizationId: string
}

export class TagService {
	private repository: TagRepository

	constructor() {
		this.repository = new TagRepository()
	}

	async create(input: TagInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('Tag name is required')
		const existing = await this.repository.findOne({
			organizationId: input.organizationId,
			name: input.name.trim(),
			deletedAt: null,
		} as any)
		if (existing) throw new GraphQLValidationError('A tag with this name already exists')
		return this.repository.create({
			...input,
			name: input.name.trim(),
			color: input.color?.trim() || '#94a3b8',
			category: input.category?.trim() || '',
			isActive: input.isActive !== false,
		})
	}

	async update(id: string, input: Partial<TagInput>) {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: { search?: string; category?: string; isActive?: boolean } = {}) {
		return this.repository.listForOrganization(organizationId, filters)
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
