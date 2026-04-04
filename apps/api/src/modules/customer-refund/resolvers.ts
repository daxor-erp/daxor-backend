import { loadPartyForCustomerPayment } from '../customer-payment/party'
import { CustomerInvoiceService } from '../customer-invoice/service'
import { CustomerRefundService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new CustomerRefundService()
const invoiceService = new CustomerInvoiceService()

const toIso = (d: unknown) =>
	d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : ''

export const resolvers = {
	Query: {
		customerRefund: async (_: unknown, { id }: { id: string }) => service.getById(id),

		customerRefunds: async (_: unknown, args: any) => {
			const { organizationId, customerId, page = 1, limit = 100 } = args
			const filter: Record<string, unknown> = {}
			if (customerId) filter.customerId = customerId
			return service.list(organizationId, filter, page, limit)
		},
	},

	Mutation: {
		createCustomerRefund: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.create(input, ctx.user?.id ?? ''),

		cancelCustomerRefund: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.cancel(id, ctx.user?.id ?? ''),
	},

	CustomerRefund: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		customerId: (parent: any) => {
			if (parent.customerId && typeof parent.customerId === 'object')
				return parent.customerId._id?.toString() ?? parent.customerId.id
			return parent.customerId?.toString()
		},
		customer: async (parent: any) => {
			const raw = parent.customerId
			const id =
				raw && typeof raw === 'object' && raw._id != null ? String(raw._id) : raw != null ? String(raw) : ''
			if (!id) return null
			return loadPartyForCustomerPayment(id)
		},
		organizationId: (parent: any) => String(parent.organizationId ?? ''),
		refundDate: (parent: any) => toIso(parent.refundDate),
		customerInvoiceId: (parent: any) =>
			parent.customerInvoiceId != null ? String(parent.customerInvoiceId) : null,
		invoice: async (parent: any) => {
			const iid = parent.customerInvoiceId
			if (iid == null) return null
			const id = typeof iid === 'object' && iid._id != null ? String(iid._id) : String(iid)
			return invoiceService.findById(id)
		},
		createdAt: (parent: any) => toIso(parent.createdAt),
		updatedAt: (parent: any) => toIso(parent.updatedAt),
	},
}
