import { GraphQLValidationError } from '@repo/errors'
import { ProductCategoryRepository } from './repository'

export interface ProductCategoryInput {
	name: string
	parentId?: string | null
	isActive?: boolean
	organizationId: string
}

export class ProductCategoryService {
	private repository: ProductCategoryRepository

	constructor() {
		this.repository = new ProductCategoryRepository()
	}

	private async computeFullPath(name: string, parentId?: string | null): Promise<string> {
		if (!parentId) return name
		const parent = await this.repository.findById(parentId)
		if (!parent) throw new GraphQLValidationError('Parent category not found')
		const parentPath = (parent as any).fullPath || (parent as any).name
		return `${parentPath} / ${name}`
	}

	async create(input: ProductCategoryInput) {
		if (!input.name?.trim()) throw new GraphQLValidationError('Category name is required')
		const name = input.name.trim()
		const fullPath = await this.computeFullPath(name, input.parentId)
		return this.repository.create({
			name,
			parentId: input.parentId || null,
			fullPath,
			isActive: input.isActive !== false,
			organizationId: input.organizationId,
		} as any)
	}

	async update(id: string, input: Partial<ProductCategoryInput>) {
		const existing = await this.repository.findById(id)
		if (!existing) throw new GraphQLValidationError('Category not found')
		const patch: Record<string, unknown> = { ...input }
		if (input.name != null || input.parentId !== undefined) {
			const name = (input.name ?? (existing as any).name).trim()
			const parentId = input.parentId !== undefined ? input.parentId : (existing as any).parentId
			patch.name = name
			patch.fullPath = await this.computeFullPath(name, parentId ? String(parentId) : null)
		}
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, isActive?: boolean) {
		return this.repository.listForOrganization(organizationId, isActive)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		const children = await this.repository.findChildren(id)
		if (children.length) {
			throw new GraphQLValidationError('Cannot delete a category that has child categories')
		}
		return this.repository.softDelete(id)
	}
}
