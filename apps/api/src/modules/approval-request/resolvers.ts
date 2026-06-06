import type { GraphQLContext } from '~/types/graphql.context'
import { ApprovalRequestService } from './service'
import { UserService } from '../user/service'
import { assertAuthenticated, isOrgAdmin } from '../auth/authz'

const approvalService = new ApprovalRequestService()
const userService = new UserService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		myPendingApprovalRequests: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const uid = ctx.user!.id
			const orgId = ctx.user?.organizationId
			if (orgId) {
				await approvalService.reconcileApprovalsForAssignee(String(orgId), uid)
			}
			const rows = await approvalService.listPendingForAssignee(uid, orgId ? String(orgId) : undefined)
			return rows ?? []
		},
		myApprovalRequests: async (
			_: unknown,
			args: {
				status?: 'PENDING' | 'APPROVED' | 'REJECTED' | null
				role?: 'REQUESTER' | 'APPROVER' | 'ANY' | null
				limit?: number | null
				skip?: number | null
			},
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const uid = ctx.user!.id
			const rows = await approvalService.listForUser(uid, {
				status: args.status ?? undefined,
				role: args.role ?? 'ANY',
				limit: args.limit ?? 50,
				skip: args.skip ?? 0,
			})
			return rows ?? []
		},
	},
	Mutation: {
		resolveApprovalRequest: async (
			_: unknown,
			{ id, decision, note }: { id: string; decision: string; note?: string | null },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const d =
				decision === 'APPROVED' || decision === 'REJECTED' ? decision : ('REJECTED' as const)
			return approvalService.resolveRequest(id, d, ctx.user!.id, isOrgAdmin(ctx), note ?? null)
		},
	},
	ApprovalRequest: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: { organizationId?: unknown }) => String(p.organizationId ?? ''),
		entityId: (p: { entityId?: unknown }) => String(p.entityId ?? ''),
		entityType: (p: { entityType?: string }) => p.entityType ?? '',
		moduleKey: (p: { moduleKey?: string }) => p.moduleKey ?? '',
		title: (p: { title?: string }) => p.title ?? '',
		status: (p: { status?: string }) => p.status ?? 'PENDING',
		requesterUserId: (p: { requesterUserId?: unknown }) => String(p.requesterUserId ?? ''),
		assigneeApproverUserId: (p: { assigneeApproverUserId?: unknown }) =>
			String(p.assigneeApproverUserId ?? ''),
		assigneeDisplayName: async (p: { assigneeApproverUserId?: unknown }) => {
			const uid = p.assigneeApproverUserId
			if (uid == null) return null
			const u = await userService.findById(String(uid))
			if (!u || u.deletedAt) return null
			const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
			return name || u.email || null
		},
		decidedByUserId: (p: { decidedByUserId?: unknown }) =>
			p.decidedByUserId != null ? String(p.decidedByUserId) : null,
		decidedAt: (p: { decidedAt?: unknown }) => iso(p.decidedAt) ?? null,
		createdAt: (p: { createdAt?: unknown }) => iso(p.createdAt) ?? '',
		updatedAt: (p: { updatedAt?: unknown }) => iso(p.updatedAt) ?? '',
	},
}
