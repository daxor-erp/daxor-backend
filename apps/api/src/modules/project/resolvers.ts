import { ProjectService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new ProjectService()

export const resolvers = {
	Query: {
		project: async (_: unknown, { id }: { id: string }) => service.findById(id),
		projects: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) filter.name = { $regex: search, $options: 'i' }
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},
	},
	Mutation: {
		createProject: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create(input, ctx.user?.id),
		updateProject: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, input, ctx.user?.id),
		deleteProject: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
	Project: {
		id: (p: any) => p._id || p.id,
		startDate: (p: any) => p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : null,
		endDate: (p: any) => p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : null,
		createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
	},
}
