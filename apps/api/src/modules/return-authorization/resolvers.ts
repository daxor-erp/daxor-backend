import { loadBillToParty } from '~/lib/bill-to-party'
import { ReturnAuthorizationService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated, isOrgAdmin } from '../auth/authz'
import {
	ApprovalRequestService,
	APPROVAL_ENTITY_RETURN_AUTHORIZATION,
	MODULE_KEY_SALES,
} from '../approval-request/service'

const service = new ReturnAuthorizationService()
const approvalService = new ApprovalRequestService()

const toIso = (d: unknown) => (d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : null)

async function resolveViaInboxOrDirect(
	id: string,
	decision: 'APPROVED' | 'REJECTED',
	ctx: GraphQLContext,
	reason?: string,
) {
	assertAuthenticated(ctx)
	const pending = await approvalService.findPendingByEntity(APPROVAL_ENTITY_RETURN_AUTHORIZATION, id)
	if (pending) {
		const pendingId = String((pending as any)._id ?? (pending as any).id ?? '')
		if (pendingId) {
			return approvalService.resolveRequest(pendingId, decision, ctx.user!.id, isOrgAdmin(ctx), reason ?? null)
				.then(async () => service.getById(id))
		}
	}
	if (decision === 'APPROVED') return service.approve(id, ctx.user!.id)
	return service.reject(id, ctx.user!.id, reason)
}

export const resolvers = {
	Query: {
		returnAuthorization: async (_: unknown, { id }: { id: string }) => service.getById(id),

		returnAuthorizations: async (_: unknown, args: any) => {
			const { organizationId, status, customerId, receiptComplete, page = 1, limit = 100 } = args
			const filter: Record<string, unknown> = {}
			if (status) filter.status = status
			if (customerId) filter.customerId = customerId
			if (receiptComplete !== undefined && receiptComplete !== null) filter.receiptComplete = receiptComplete
			return service.list(organizationId, filter, page, limit)
		},
	},

	Mutation: {
		createReturnAuthorization: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const orgId = String(input.organizationId ?? ctx.user?.organizationId ?? '')
			if (!orgId) throw new GraphQLAuthError('Organization is required')
			if (String(ctx.user?.organizationId ?? '') !== orgId) {
				throw new GraphQLAuthError('Forbidden')
			}

			await approvalService.ensureApproverConfigured(orgId, MODULE_KEY_SALES)

			const created = await service.create(input, ctx.user!.id)
			const raId = String((created as any)._id ?? (created as any).id ?? '')
			if (raId) {
				await approvalService.enqueueReturnAuthorizationSubmitted(raId, ctx.user!.id)
			}
			return created
		},

		approveReturnAuthorization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			resolveViaInboxOrDirect(id, 'APPROVED', ctx),

		rejectReturnAuthorization: async (
			_: unknown,
			{ id, reason }: { id: string; reason?: string },
			ctx: GraphQLContext,
		) => resolveViaInboxOrDirect(id, 'REJECTED', ctx, reason),

		cancelReturnAuthorization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const cancelled = await service.cancel(id, ctx.user!.id)
			const pending = await approvalService.findPendingByEntity(APPROVAL_ENTITY_RETURN_AUTHORIZATION, id)
			if (pending) {
				const pendingId = String((pending as any)._id ?? (pending as any).id ?? '')
				if (pendingId) {
					await approvalService.closePendingRequestAsCancelled(pendingId, ctx.user!.id, 'Cancelled by requester')
				}
			}
			return cancelled
		},

		deleteReturnAuthorization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			await service.softDelete(id, ctx.user?.id ?? '')
			return true
		},

		receiveReturnAuthorizationGoods: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.receiveGoods(input, ctx.user?.id ?? ''),
	},

	ReturnAuthorization: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		customerId: (parent: any) =>
			parent.customerId?._id?.toString() ?? parent.customerId?.toString() ?? '',
		customer: async (parent: any) => {
			const raw = parent.customerId
			const id =
				raw && typeof raw === 'object' && raw._id != null ? String(raw._id) : raw != null ? String(raw) : ''
			if (!id) return null
			return loadBillToParty(id)
		},
		salesOrderId: (parent: any) =>
			parent.salesOrderId != null ? String(parent.salesOrderId) : null,
		requestedDate: (parent: any) => toIso(parent.requestedDate) ?? '',
		approvedAt: (parent: any) => (parent.approvedAt ? toIso(parent.approvedAt) : null),
		goodsReceivedAt: (parent: any) => (parent.goodsReceivedAt ? toIso(parent.goodsReceivedAt) : null),
		goodsReceivedBy: (parent: any) =>
			parent.goodsReceivedBy != null ? String(parent.goodsReceivedBy) : null,
		receiptComplete: (parent: any) => parent.receiptComplete === true,
		receiptNotes: (parent: any) => parent.receiptNotes ?? null,
		createdAt: (parent: any) => toIso(parent.createdAt) ?? '',
		updatedAt: (parent: any) => toIso(parent.updatedAt) ?? '',
		lines: (parent: any) =>
			(parent.lines ?? []).map((line: any) => {
				const plain = typeof line?.toObject === 'function' ? line.toObject() : line
				return {
					...plain,
					id: plain._id?.toString() ?? plain.id,
					itemId: plain.itemId != null ? String(plain.itemId) : null,
					description: String(plain.description ?? '').trim(),
					quantity: Number(plain.quantity ?? 0),
					quantityReceived: Number(plain.quantityReceived ?? 0),
				}
			}),
	},

	ReturnAuthorizationLine: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		itemId: (parent: any) => (parent.itemId != null ? String(parent.itemId) : null),
		description: (parent: any) => String(parent.description ?? '').trim(),
		quantity: (parent: any) => Number(parent.quantity ?? 0),
		quantityReceived: (parent: any) => Number(parent.quantityReceived ?? 0),
	},
}
