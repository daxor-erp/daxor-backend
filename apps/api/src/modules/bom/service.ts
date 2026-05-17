import { GraphQLValidationError } from '@repo/errors'
import { BOMRepository } from './repository'

export interface BOMComponentInput {
	itemId?: string | null
	itemName: string
	quantity: number
	unit?: string
	scrapPercent?: number
	standardCost?: number
	notes?: string
}

export interface BOMInput {
	organizationId: string
	parentItemId: string
	parentItemName: string
	bomCode: string
	version?: string
	description?: string
	quantityProduced?: number
	unit?: string
	components: BOMComponentInput[]
	laborCost?: number
	overheadCost?: number
	status?: string
	notes?: string
}

export class BOMService {
	private repository: BOMRepository
	constructor() {
		this.repository = new BOMRepository()
	}

	async create(input: BOMInput): Promise<any> {
		this.validate(input)
		const computed = this.computeCosts(input.components, input.laborCost ?? 0, input.overheadCost ?? 0)
		return this.repository.create({
			...input,
			bomCode: input.bomCode.trim().toUpperCase(),
			version: input.version || 'v1',
			components: input.components.map((c) => ({
				...c,
				scrapPercent: c.scrapPercent ?? 0,
				standardCost: c.standardCost ?? 0,
				unit: c.unit ?? 'unit',
			})),
			...computed,
		})
	}

	async update(id: string, input: Partial<BOMInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.bomCode) patch.bomCode = input.bomCode.trim().toUpperCase()
		if (Array.isArray(input.components)) {
			const computed = this.computeCosts(
				input.components,
				input.laborCost ?? 0,
				input.overheadCost ?? 0,
			)
			Object.assign(patch, computed)
		}
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: any = {}) {
		return this.repository.list(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	private validate(input: BOMInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.parentItemId || !input.parentItemName) {
			throw new GraphQLValidationError('parentItemId and parentItemName are required')
		}
		if (!input.bomCode?.trim()) throw new GraphQLValidationError('BOM code is required')
		if (!Array.isArray(input.components) || input.components.length === 0) {
			throw new GraphQLValidationError('At least one component is required')
		}
		for (const c of input.components) {
			if (!c.itemName?.trim()) throw new GraphQLValidationError('Each component needs an item name')
			if (!Number.isFinite(c.quantity) || c.quantity <= 0) {
				throw new GraphQLValidationError(`Quantity must be > 0 for ${c.itemName}`)
			}
		}
	}

	private computeCosts(
		components: BOMComponentInput[],
		laborCost: number,
		overheadCost: number,
	): { totalMaterialCost: number; totalCost: number } {
		const material = components.reduce((s, c) => {
			const qty = Number(c.quantity ?? 0)
			const scrap = Number(c.scrapPercent ?? 0)
			const cost = Number(c.standardCost ?? 0)
			const effectiveQty = qty * (1 + scrap / 100)
			return s + effectiveQty * cost
		}, 0)
		const total = material + Number(laborCost ?? 0) + Number(overheadCost ?? 0)
		return {
			totalMaterialCost: Math.round(material * 100) / 100,
			totalCost: Math.round(total * 100) / 100,
		}
	}
}
