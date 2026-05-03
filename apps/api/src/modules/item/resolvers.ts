import { ItemService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new ItemService()

function asPlain(doc: unknown): Record<string, unknown> {
	if (doc == null) return {}
	if (
		typeof doc === 'object' &&
		doc !== null &&
		'toObject' in doc &&
		typeof (doc as { toObject: unknown }).toObject === 'function'
	) {
		return (doc as { toObject: () => Record<string, unknown> }).toObject()
	}
	return doc as Record<string, unknown>
}

function graphqlIsoDate(value: unknown): string {
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString()
	}
	if (typeof value === 'string' && value.length > 0) {
		return value
	}
	return new Date(0).toISOString()
}

/** GraphQL-safe item payload — satisfies non-null fields and avoids resolver null errors. */
function itemToGraphQL(doc: unknown) {
	if (doc == null) {
		throw new Error('Item operation returned no document')
	}
	const o = asPlain(doc)
	const id = o._id != null ? String(o._id) : String(o.id ?? '')
	const rawStatus = o.status != null ? String(o.status) : ''
	const status =
		rawStatus === 'inactive' || rawStatus === 'deleted' || rawStatus === 'active'
			? rawStatus
			: 'active'
	const rateVal = o.rate
	let rate: number | null = null
	if (typeof rateVal === 'number' && Number.isFinite(rateVal)) {
		rate = rateVal
	} else if (rateVal != null && String(rateVal).trim() !== '') {
		const n = parseFloat(String(rateVal))
		rate = Number.isFinite(n) ? n : null
	}
	return {
		id,
		seqNo: o.seqNo != null && String(o.seqNo).trim() !== '' ? String(o.seqNo) : null,
		name: String(o.name ?? '').trim() || '—',
		description:
			o.description != null && String(o.description).trim() !== '' ? String(o.description) : null,
		category: o.category != null && String(o.category).trim() !== '' ? String(o.category) : null,
		unit: o.unit != null && String(o.unit).trim() !== '' ? String(o.unit) : null,
		rate,
		organizationId: String(o.organizationId ?? ''),
		status,
		createdAt: graphqlIsoDate(o.createdAt),
	}
}

export const resolvers = {
	Query: {
		item: async (_: unknown, { id }: { id: string }) => {
			const row = await service.findById(id)
			if (row == null) return null
			const plain = asPlain(row)
			if (plain.deletedAt != null) return null
			return itemToGraphQL(row)
		},
		items: async (_: unknown, args: Record<string, unknown>) => {
			const organizationId = String(args.organizationId ?? '')
			const page = typeof args.page === 'number' ? args.page : 1
			const limit = typeof args.limit === 'number' ? args.limit : 10
			const status = args.status != null ? String(args.status) : undefined
			const search = args.search != null ? String(args.search) : undefined
			const filter: Record<string, unknown> = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search && search.trim() !== '') {
				filter.name = { $regex: search.trim(), $options: 'i' }
			}
			const result = await service.findWithPagination(filter, {
				page,
				limit,
				sortBy: 'createdAt',
				sortOrder: 'desc',
			})
			return result.data.map((row: unknown) => itemToGraphQL(row))
		},
	},
	Mutation: {
		createItem: async (
			_: unknown,
			{ input }: { input: Record<string, unknown> },
			ctx: GraphQLContext,
		) => {
			const payload = input
			const row = await service.create({
				...payload,
				createdBy: ctx.user?.id,
			})
			return itemToGraphQL(row)
		},
		updateItem: async (
			_: unknown,
			{ id, input }: { id: string; input: Record<string, unknown> },
			ctx: GraphQLContext,
		) => {
			const row = await service.update(id, { ...input, updatedBy: ctx.user?.id })
			if (row == null) {
				throw new Error('Item not found or already removed')
			}
			return itemToGraphQL(row)
		},
		deleteItem: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			const row = await service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id })
			if (row == null) {
				throw new Error('Item not found')
			}
			return itemToGraphQL(row)
		},
	},
}
