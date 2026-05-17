import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { DeliveryOrderService } from './service'

const service = new DeliveryOrderService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		deliveryOrder: async (_: unknown, { id }: { id: string }) => service.findById(id),
		deliveryOrders: async (_: unknown, { organizationId, status, customerId, salesOrderId, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, { status, customerId, salesOrderId, search })
		},
	},
	Mutation: {
		createDeliveryOrder: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateDeliveryOrder: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Delivery order not found')
			return updated
		},
		deleteDeliveryOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Delivery order not found')
			return deleted
		},
		transitionDeliveryOrderStatus: async (_: unknown, { id, status, signedBy }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.transitionStatus(id, status, signedBy)
		},
	},
	DeliveryOrder: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		salesOrderId: (p: any) => (p.salesOrderId != null ? String(p.salesOrderId) : null),
		customerId: (p: any) => (p.customerId != null ? String(p.customerId) : null),
		deliveryDate: (p: any) => iso(p.deliveryDate) ?? '',
		expectedArrival: (p: any) => iso(p.expectedArrival),
		actualArrival: (p: any) => iso(p.actualArrival),
		dispatchedAt: (p: any) => iso(p.dispatchedAt),
		deliveredAt: (p: any) => iso(p.deliveredAt),
		signedAt: (p: any) => iso(p.signedAt),
		items: (p: any) => (p.items ?? []).map((i: any) => ({
			itemId: i.itemId != null ? String(i.itemId) : null,
			itemName: i.itemName ?? '',
			quantity: Number(i.quantity ?? 0),
			unit: i.unit ?? 'unit',
			notes: i.notes ?? null,
		})),
		totalQuantity: (p: any) => Number(p.totalQuantity ?? 0),
		status: (p: any) => p.status ?? 'DRAFT',
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
