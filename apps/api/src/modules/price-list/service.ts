import { ItemService } from '../item/service'
import { PriceListRepository } from './repository'

export class PriceListService {
	private repository: PriceListRepository
	private itemService: ItemService

	constructor() {
		this.repository = new PriceListRepository()
		this.itemService = new ItemService()
	}

	private async generateListNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		return `PL-${`${organizationId}`.slice(-4).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
	}

	async generate(input: { organizationId: string; title?: string; category?: string }, userId: string) {
		const filter: Record<string, unknown> = {
			organizationId: input.organizationId,
			deletedAt: null,
			status: 'active',
		}
		if (input.category?.trim()) {
			filter.category = input.category.trim()
		}

		const result = await this.itemService.findWithPagination(filter, {
			page: 1,
			limit: 5000,
			sortBy: 'name',
			sortOrder: 'asc',
		})

		const lines = (result.data ?? []).map((it: any) => ({
			itemId: it._id,
			seqNo: it.seqNo,
			name: it.name,
			unit: it.unit,
			rate: it.rate != null ? Number(it.rate) : 0,
			category: it.category,
		}))

		const listNumber = await this.generateListNumber(input.organizationId)

		return this.repository.create({
			listNumber,
			organizationId: input.organizationId,
			title: input.title?.trim() || 'Price list',
			categoryFilter: input.category?.trim() || undefined,
			lines,
			generatedBy: userId,
		})
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async list(organizationId: string, page = 1, limit = 50) {
		const result = await this.repository.findPaginated(
			{ organizationId, deletedAt: null } as any,
			page,
			limit,
			{ createdAt: -1 },
		)
		return result.data
	}
}
