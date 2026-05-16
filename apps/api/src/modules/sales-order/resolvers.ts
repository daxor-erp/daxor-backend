import { SalesOrderService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_SALES } from '../approval-request/service'

const service = new SalesOrderService()
const approvalService = new ApprovalRequestService()

export const resolvers = {
	Query: {
		salesorder: async (_: unknown, { id }: { id: string }) => service.findById(id),
		salesorders: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search, cashSale } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (cashSale === true) filter.cashSale = true
			if (cashSale === false) filter.cashSale = { $ne: true }
			if (search) {
				filter.$or = [
					{ salesOrderNumber: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},

		cashSalesRefundCandidates: async (_: unknown, { organizationId }: { organizationId: string }) =>
			service.listCashSaleRefundCandidates(organizationId),
	},
	Mutation: {
		createSalesOrder: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create({ ...input, createdBy: ctx.user?.id }),
		updateSalesOrder: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, { 
				...input,
				...(input.customerId ? { clientId: input.customerId } : {}),
				updatedBy: ctx.user?.id,
			}),
		deleteSalesOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),

		submitSalesOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const before = await service.findById(id)
			if (!before || (before as any).deletedAt) throw new GraphQLAuthError('Sales order not found')
			if ((before as any).cashSale === true) throw new GraphQLAuthError('Cash sales are not routed for approval.')
			await approvalService.ensureApproverConfigured(String((before as any).organizationId), MODULE_KEY_SALES)
			const submitted = await service.submit(id, ctx.user!.id)
			await approvalService.enqueueSalesOrderSubmitted(id, ctx.user!.id)
			return submitted
		},
		refundCashSale: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.refundCashSale(input, ctx.user?.id ?? ''),
	},
	SalesOrder: {
		seqNo: (parent: any) => String(parent.seqNo ?? parent.salesOrderNumber ?? parent._id ?? ''),
		customerId: (parent: any) => String(parent.customerId ?? parent.clientId ?? ''),
		clientId: (parent: any) => String(parent.clientId ?? parent.customerId ?? ''),
		organizationId: (parent: any) => String(parent.organizationId ?? ''),
		quotationId: (parent: any) => (parent.quotationId != null ? String(parent.quotationId) : null),
		cashSale: (parent: any) => parent.cashSale === true,
		refundedAt: (parent: any) =>
			parent.refundedAt ? new Date(parent.refundedAt).toISOString() : null,
		refundAmount: (parent: any) =>
			parent.refundAmount != null ? Number(parent.refundAmount) : null,
		refundMethod: (parent: any) => parent.refundMethod ?? null,
		refundReferenceNumber: (parent: any) => parent.refundReferenceNumber ?? null,
		refundNotes: (parent: any) => parent.refundNotes ?? null,
	},
}
