import { CustomerService } from '../customer/service'
import { IndividualPriceListService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new IndividualPriceListService()
const customerService = new CustomerService()

const toIso = (d: unknown) =>
	d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : ''

const toPlain = (doc: any) => {
	if (!doc) return null
	const obj = doc.toObject ? doc.toObject() : doc
	return {
		...obj,
		id: obj._id?.toString() || obj.id,
		organizationId: String(obj.organizationId ?? ''),
		customerId: obj.customerId?._id?.toString() ?? obj.customerId?.toString() ?? '',
	}
}

export const resolvers = {
	Query: {
		individualPriceList: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.getById(id)
			return toPlain(doc)
		},

		individualPriceLists: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 50 } = args
			const rows = await service.list(organizationId, page, limit)
			return rows.map((doc: any) => toPlain(doc))
		},

		individualPriceListByCustomer: async (_: unknown, args: any) => {
			const { organizationId, customerId } = args
			const doc = await service.getByCustomer(organizationId, customerId)
			return toPlain(doc)
		},
	},

	Mutation: {
		upsertIndividualPriceList: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			toPlain(await service.upsert(input, ctx.user?.id ?? '')),

		seedIndividualPriceListFromCatalog: async (
			_: unknown,
			args: { organizationId: string; customerId: string },
			ctx: GraphQLContext,
		) => toPlain(await service.seedFromCatalog(args.organizationId, args.customerId, ctx.user?.id ?? '')),

		deleteIndividualPriceList: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			await service.softDelete(id, ctx.user?.id ?? '')
			return true
		},
	},

	IndividualPriceList: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		createdAt: (parent: any) => toIso(parent.createdAt),
		updatedAt: (parent: any) => toIso(parent.updatedAt),
		customerId: (parent: any) =>
			parent.customerId?._id?.toString() ?? parent.customerId?.toString() ?? '',
		customer: async (parent: any) => {
			const cid = parent.customerId?._id ?? parent.customerId
			if (!cid) return null
			const doc = await customerService.getCustomerById(cid.toString())
			if (!doc) return null
			const obj = (doc as any).toObject ? (doc as any).toObject() : doc
			return {
				...obj,
				id: obj._id?.toString() || obj.id,
				organizationId: String(obj.organizationId ?? ''),
				createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
				updatedAt: obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt,
			}
		},
		lines: (parent: any) =>
			(parent.lines ?? []).map((line: any) => ({
				...line,
				itemId: line.itemId?._id?.toString() ?? line.itemId?.toString() ?? '',
				standardRate: line.standardRate != null ? Number(line.standardRate) : 0,
				customerRate: line.customerRate != null ? Number(line.customerRate) : 0,
			})),
	},

	IndividualPriceListLine: {
		itemId: (parent: any) =>
			parent.itemId?._id?.toString() ?? parent.itemId?.toString() ?? '',
	},
}
