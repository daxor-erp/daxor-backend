import { loadPartyForCustomerPayment } from '../customer-payment/party'
import { CustomerDepositService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new CustomerDepositService()

const toIso = (d: unknown) =>
	d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : ''

export const resolvers = {
	Query: {
		customerDeposit: async (_: unknown, { id }: { id: string }) => service.getById(id),

		customerDeposits: async (_: unknown, args: any) => {
			const { organizationId, customerId, page = 1, limit = 100 } = args
			const filter: Record<string, unknown> = {}
			if (customerId) filter.customerId = customerId
			return service.list(organizationId, filter, page, limit)
		},
	},

	Mutation: {
		createCustomerDeposit: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.create(input, ctx.user?.id ?? ''),

		cancelCustomerDeposit: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.cancel(id, ctx.user?.id ?? ''),
	},

	CustomerDeposit: {
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
		depositDate: (parent: any) => toIso(parent.depositDate),
		createdAt: (parent: any) => toIso(parent.createdAt),
		updatedAt: (parent: any) => toIso(parent.updatedAt),
	},
}
