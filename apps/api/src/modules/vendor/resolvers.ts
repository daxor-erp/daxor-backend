import { VendorService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new VendorService()

export const resolvers = {
	Query: {
		vendor: async (_: unknown, { id }: { id: string }) => service.findById(id),
		vendors: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) filter.name = { $regex: search, $options: 'i' }
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},
	},
	Mutation: {
		createVendor: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create({ ...input, createdBy: ctx.user?.id }),
		updateVendor: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, { ...input, updatedBy: ctx.user?.id }),
		deleteVendor: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
}
