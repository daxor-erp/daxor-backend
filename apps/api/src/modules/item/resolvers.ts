import { ItemService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new ItemService()

export const resolvers = {
	Query: {
		item: async (_: unknown, { id }: { id: string }) => service.findById(id),
		items: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) filter.name = { $regex: search, $options: 'i' }
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},
	},
	Mutation: {
		createItem: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create({ ...input, createdBy: ctx.user?.id }),
		updateItem: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, { ...input, updatedBy: ctx.user?.id }),
		deleteItem: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
}
