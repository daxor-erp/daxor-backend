import { ProjectService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_PURCHASES } from '../approval-request/service'

const service = new ProjectService()
const approvalService = new ApprovalRequestService()

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
		submitProjectForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const row = await service.findById(id)
			if (!row || row.deletedAt) throw new GraphQLAuthError('Project not found')
			const ctxOrg = ctx.user?.organizationId
			if (ctxOrg == null || String(ctxOrg) !== String(row.organizationId)) {
				throw new GraphQLAuthError('Forbidden')
			}
			await approvalService.ensureApproverConfigured(String(row.organizationId), MODULE_KEY_PURCHASES)
			await service.submitForOrgApproval(id, ctx.user!.id)
			await approvalService.enqueueProjectSubmitted(id, ctx.user!.id)
			return service.findById(id)
		},
		deleteProject: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
	Project: {
		id: (p: any) => p._id || p.id,
		orgApprovalStatus: (p: any) => p.orgApprovalStatus ?? 'approved',
		startDate: (p: any) => p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : null,
		endDate: (p: any) => p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : null,
		createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
	},
}
