import { ClientService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new ClientService()

export const resolvers = {
	Query: {
		client: async (_: unknown, { id }: { id: string }) => 
			service.findById(id),

		clients: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 100, status, search } = args
			const filter: any = {}
			if (organizationId) filter.organizationId = organizationId
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ name: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
					{ company: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findPaginated(filter, page, limit, { createdAt: -1 })
			return result.data
		},
	},

	Mutation: {
		createClient: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.create(input, ctx.user?.id),

		updateClient: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
			service.update(id, input),

		deleteClient: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.softDelete(id, ctx.user?.id),
	},
}
