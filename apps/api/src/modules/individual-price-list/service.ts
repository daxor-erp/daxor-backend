import { CustomerRepository } from '../customer/repository'
import { getNextSequence } from '../counter'
import { ItemService } from '../item/service'
import { IndividualPriceListRepository } from './repository'

export class IndividualPriceListService {
	private repository: IndividualPriceListRepository
	private itemService: ItemService
	private customerRepository: CustomerRepository

	constructor() {
		this.repository = new IndividualPriceListRepository()
		this.itemService = new ItemService()
		this.customerRepository = new CustomerRepository()
	}

	private async nextListNumber(organizationId: string): Promise<string> {
		const seq = await getNextSequence({ type: 'IndividualPriceList', organizationId })
		const orgSlug = `${organizationId}`.slice(-4).toUpperCase()
		return `IPL-${orgSlug}-${String(seq).padStart(5, '0')}`
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async getByCustomer(organizationId: string, customerId: string) {
		return this.repository.findOne({
			organizationId,
			customerId,
			deletedAt: null,
		} as any)
	}

	async list(organizationId: string, page = 1, limit = 50) {
		const result = await this.repository.findPaginated(
			{ organizationId, deletedAt: null } as any,
			page,
			limit,
			{ updatedAt: -1 },
		)
		return result.data
	}

	async upsert(
		input: {
			organizationId: string
			customerId: string
			title?: string
			notes?: string
			lines: Array<{
				itemId: string
				seqNo?: string
				name: string
				unit?: string
				category?: string
				standardRate?: number
				customerRate?: number
			}>
		},
		userId: string,
	) {
		const cust = await this.customerRepository.findById(input.customerId)
		if (!cust || `${(cust as any).organizationId}` !== `${input.organizationId}`) {
			throw new Error('Customer not found for this organization')
		}

		const existing = await this.getByCustomer(input.organizationId, input.customerId)
		const title =
			input.title?.trim() ||
			(existing as any)?.title ||
			`Price list — ${(cust as any).name ?? 'Customer'}`

		const lines = (input.lines ?? []).map((l) => ({
			itemId: l.itemId,
			seqNo: l.seqNo,
			name: l.name,
			unit: l.unit,
			category: l.category,
			standardRate: Number(l.standardRate ?? 0),
			customerRate: Number(l.customerRate ?? l.standardRate ?? 0),
		}))

		if (existing) {
			return this.repository.update((existing as any)._id ?? (existing as any).id, {
				title,
				notes: input.notes?.trim() || undefined,
				lines,
			} as any)
		}

		const listNumber = await this.nextListNumber(input.organizationId)
		return this.repository.create({
			listNumber,
			organizationId: input.organizationId,
			customerId: input.customerId,
			title,
			notes: input.notes?.trim() || undefined,
			lines,
		} as any)
	}

	async seedFromCatalog(organizationId: string, customerId: string, userId: string) {
		const cust = await this.customerRepository.findById(customerId)
		if (!cust || `${(cust as any).organizationId}` !== `${organizationId}`) {
			throw new Error('Customer not found for this organization')
		}

		const filter: Record<string, unknown> = {
			organizationId,
			deletedAt: null,
			status: 'active',
		}
		const result = await this.itemService.findWithPagination(filter as any, {
			page: 1,
			limit: 5000,
			sortBy: 'name',
			sortOrder: 'asc',
		})

		const items = result.data ?? []
		const existing = await this.getByCustomer(organizationId, customerId)
		const existingLines = ((existing as any)?.lines ?? []) as any[]
		const byItem = new Map<string, any>()
		for (const l of existingLines) {
			const id = l.itemId?._id?.toString() ?? l.itemId?.toString()
			if (id) byItem.set(id, l)
		}

		const lines = items.map((it: any) => {
			const id = it._id?.toString()
			const prev = id ? byItem.get(id) : undefined
			const std = Number(it.rate ?? 0)
			return {
				itemId: it._id,
				seqNo: it.seqNo,
				name: it.name,
				unit: it.unit,
				category: it.category,
				standardRate: std,
				customerRate: prev != null ? Number(prev.customerRate ?? std) : std,
			}
		})

		return this.upsert(
			{
				organizationId,
				customerId,
				title: (existing as any)?.title,
				notes: (existing as any)?.notes,
				lines,
			},
			userId,
		)
	}

	async softDelete(id: string, _userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Individual price list not found')
		return this.repository.update(id, { deletedAt: new Date() } as any)
	}
}
