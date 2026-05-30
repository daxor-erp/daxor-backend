import { GraphQLValidationError } from '@repo/errors'
import { PackageRepository } from './repository'

export interface CreatePackageInput {
	packageName: string
	externalName: string
	price: number
	durationDays: number
	createdBy?: string
}

export interface UpdatePackageInput {
	packageName?: string
	externalName?: string
	price?: number
	durationDays?: number
}

export class PackageService {
	private repository: PackageRepository

	constructor() {
		this.repository = new PackageRepository()
	}

	private validateCreateInput(input: CreatePackageInput): CreatePackageInput {
		const packageName = input.packageName?.trim()
		const externalName = input.externalName?.trim()
		if (!packageName) throw new GraphQLValidationError('Package name is required')
		if (!externalName) throw new GraphQLValidationError('External name is required')
		if (typeof input.price !== 'number' || input.price <= 0) {
			throw new GraphQLValidationError('Pricing must be greater than 0')
		}
		if (typeof input.durationDays !== 'number' || input.durationDays <= 0) {
			throw new GraphQLValidationError('Duration days must be greater than 0')
		}
		return {
			...input,
			packageName,
			externalName,
		}
	}

	async create(input: CreatePackageInput): Promise<any> {
		const validated = this.validateCreateInput(input)
		return this.repository.create(validated)
	}

	async list(): Promise<any[]> {
		return this.repository.listActive()
	}

	async findById(id: string): Promise<any | null> {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) return null
		return row
	}

	/** Update an existing package (platform admin). */
	async update(id: string, input: UpdatePackageInput): Promise<any> {
		const existing = await this.findById(id)
		if (!existing) throw new GraphQLValidationError('Package not found')

		const validated = this.validateCreateInput({
			packageName: input.packageName ?? '',
			externalName: input.externalName ?? '',
			price: input.price,
			durationDays: input.durationDays,
		})

		const updated = await this.repository.update(id, validated as any)
		if (!updated) throw new GraphQLValidationError('Package not found')
		return updated
	}

	/** Reserved for future delete support. */
	async softDelete(id: string): Promise<any | null> {
		return this.repository.update(id, { deletedAt: new Date() } as any)
	}
}
