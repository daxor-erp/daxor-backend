import { GraphQLValidationError } from '@repo/errors'
import { HrMasterRepository } from './repository'

export interface HrMasterInput {
	organizationId: string
	kind: string
	code: string
	name: string
	description?: string
	metadata?: Record<string, unknown>
	active?: boolean
	sortOrder?: number
}

export class HrMasterService {
	private repository: HrMasterRepository
	constructor() {
		this.repository = new HrMasterRepository()
	}

	async create(input: HrMasterInput): Promise<any> {
		this.validate(input)
		return this.repository.create({
			...input,
			code: input.code.trim().toUpperCase(),
			name: input.name.trim(),
		})
	}

	async update(id: string, input: Partial<HrMasterInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.code) patch.code = input.code.trim().toUpperCase()
		if (input.name) patch.name = input.name.trim()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, kind: string, filters: { active?: boolean; search?: string } = {}) {
		return this.repository.list(organizationId, kind, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	private validate(input: HrMasterInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.kind) throw new GraphQLValidationError('kind is required')
		if (!input.code?.trim()) throw new GraphQLValidationError('code is required')
		if (!input.name?.trim()) throw new GraphQLValidationError('name is required')
	}
}
