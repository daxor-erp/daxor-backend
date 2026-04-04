import { loadBillToParty } from '~/lib/bill-to-party'
import { ReturnAuthorizationService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new ReturnAuthorizationService()

const toIso = (d: unknown) => (d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : null)

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
		createReturnAuthorization: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.create(input, ctx.user?.id ?? ''),

		approveReturnAuthorization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.approve(id, ctx.user?.id ?? ''),

		rejectReturnAuthorization: async (_: unknown, { id, reason }: { id: string; reason?: string }, ctx: GraphQLContext) =>
			service.reject(id, ctx.user?.id ?? '', reason),

		cancelReturnAuthorization: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.cancel(id, ctx.user?.id ?? ''),

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
			(parent.lines ?? []).map((line: any) => ({
				...line,
				id: line._id?.toString() ?? line.id,
				itemId: line.itemId != null ? String(line.itemId) : null,
				quantityReceived: Number(line.quantityReceived ?? 0),
			})),
	},

	ReturnAuthorizationLine: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		itemId: (parent: any) => (parent.itemId != null ? String(parent.itemId) : null),
		quantityReceived: (parent: any) => Number(parent.quantityReceived ?? 0),
	},
}
