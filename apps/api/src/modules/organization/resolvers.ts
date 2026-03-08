import { OrganizationService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new OrganizationService()

export const resolvers = {
	Query: {
		organization: async (_: unknown, { id }: { id: string }) => service.findById(id),
		organizations: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) filter.name = { $regex: search, $options: 'i' }
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},
	},
	Mutation: {
		createOrganization: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create({ ...input, createdBy: ctx.user?.id }),
		updateOrganization: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, { ...input, updatedBy: ctx.user?.id }),
		deleteOrganization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
}
