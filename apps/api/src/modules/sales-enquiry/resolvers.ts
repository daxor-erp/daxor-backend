import { SalesEnquiryService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_SALES } from '../approval-request/service'
import { deriveSalesEnquiryWorkflowStatus } from '~/helpers/approval-workflow/record-approval-status'

const service = new SalesEnquiryService()
const approvalService = new ApprovalRequestService()

function iso(d: unknown): string {
	if (d == null) return ''
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return ''
	return new Date(t).toISOString()
}

function isoOpt(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		salesEnquiry: async (_: unknown, { id }: { id: string }) => service.findById(id),

		salesEnquiries: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ enquiryNumber: { $regex: search, $options: 'i' } },
					{ subject: { $regex: search, $options: 'i' } },
					{ projectType: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findPaginated(filter, page, limit, { createdAt: -1 })
			return result.data
		},

		salesEnquiriesByClient: async (_: unknown, { clientId }: { clientId: string }) =>
			service.findByClientId(clientId),

		salesEnquiriesByStatus: async (_: unknown, { status }: { status: string }) =>
			service.findByStatus(status),

		salesEnquiriesByAssignedTo: async (_: unknown, { userId }: { userId: string }) =>
			service.findByAssignedTo(userId),
	},

	Mutation: {
		createSalesEnquiry: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const orgId = ctx.user?.organizationId
			if (orgId == null || String(orgId) === '') {
				throw new GraphQLAuthError('Organization context required')
			}
			return service.createSalesEnquiry(input, ctx.user!.id, String(orgId))
		},

		updateSalesEnquiry: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
			service.updateSalesEnquiry(id, input),

		submitSalesEnquiryForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const row = await service.findById(id)
			if (!row || row.deletedAt) throw new GraphQLAuthError('Sales enquiry not found')
			const ctxOrg = ctx.user?.organizationId
			if (ctxOrg == null || String(ctxOrg) !== String(row.organizationId)) {
				throw new GraphQLAuthError('Forbidden')
			}
			await approvalService.ensureApproverConfigured(String(row.organizationId), MODULE_KEY_SALES)
			await service.submitForApproval(id)
			await approvalService.enqueueSalesEnquirySubmitted(id, ctx.user!.id)
			return service.findById(id)
		},

		deleteSalesEnquiry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.softDelete(id, ctx.user?.id ?? ''),
	},
	SalesEnquiry: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: { organizationId?: unknown }) => String(p.organizationId ?? ''),
		clientId: (p: { clientId?: unknown }) => String(p.clientId ?? ''),
		assignedTo: (p: { assignedTo?: unknown }) =>
			p.assignedTo != null ? String(p.assignedTo) : null,
		createdBy: (p: { createdBy?: unknown }) => (p.createdBy != null ? String(p.createdBy) : null),
		approvalStatus: (p: { approvalStatus?: unknown; status?: unknown }) =>
			deriveSalesEnquiryWorkflowStatus(p as { approvalStatus?: string | null; status?: string | null }),
		approvalRequestedAt: (p: { approvalRequestedAt?: unknown }) => isoOpt(p.approvalRequestedAt),
		approvedAt: (p: { approvedAt?: unknown }) => isoOpt(p.approvedAt),
		approvedBy: (p: { approvedBy?: unknown }) => (p.approvedBy != null ? String(p.approvedBy) : null),
		createdAt: (p: { createdAt?: unknown }) => iso(p.createdAt),
		updatedAt: (p: { updatedAt?: unknown }) => iso(p.updatedAt),
	},
}
