import { GraphQLValidationError } from '@repo/errors'
import { BankRepository } from './repository'

export interface BankInput {
	name: string
	bankIdentifierCode?: string
	address?: string
	phone?: string
	email?: string
	organizationId: string
}

export class BankService {
	private repository: BankRepository

	constructor() {
		this.repository = new BankRepository()
	}

	async create(input: BankInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('Bank name is required')
		return this.repository.create({ ...input, name: input.name.trim() })
	}

	async update(id: string, input: Partial<BankInput>) {
		const patch: Record<string, unknown> = { ...input }
		if (typeof patch.name === 'string') patch.name = patch.name.trim()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, search?: string) {
		return this.repository.listForOrganization(organizationId, search)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}
}
