import { PriceListService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new PriceListService()

const toIso = (d: unknown) =>
	d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : null

export const resolvers = {
	Query: {
		priceList: async (_: unknown, { id }: { id: string }) => service.getById(id),

		priceLists: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 50 } = args
			return service.list(organizationId, page, limit)
		},
	},

	Mutation: {
		generatePriceList: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.generate(input, ctx.user?.id ?? ''),
	},

	PriceList: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		generatedAt: (parent: any) => toIso(parent.createdAt) ?? '',
		createdAt: (parent: any) => toIso(parent.createdAt) ?? '',
		updatedAt: (parent: any) => toIso(parent.updatedAt) ?? '',
		lines: (parent: any) =>
			(parent.lines ?? []).map((line: any) => ({
				...line,
				itemId: line.itemId?._id?.toString() ?? line.itemId?.toString() ?? '',
			})),
	},

	PriceListLine: {
		itemId: (parent: any) =>
			parent.itemId?._id?.toString() ?? parent.itemId?.toString() ?? '',
	},
}
