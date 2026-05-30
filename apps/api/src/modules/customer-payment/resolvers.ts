import { Types } from 'mongoose'
import { GraphQLValidationError } from '@repo/errors'
import { CustomerPaymentService } from './service'
import { loadPartyForCustomerPayment } from './party'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new CustomerPaymentService()

function partyObjectId(id: unknown): Types.ObjectId | null {
	const s = String(id ?? '').trim()
	if (!s || !Types.ObjectId.isValid(s)) return null
	return new Types.ObjectId(s)
}

export const resolvers = {
	Query: {
		customerPayment: async (_: unknown, { id }: { id: string }) => service.getPaymentById(id),

		customerPayments: async (_: unknown, args: any) => {
			const { organizationId, customerId, page = 1, limit = 100 } = args
			const filter: any = {}
			const partyOid = partyObjectId(customerId)
			if (partyOid) filter.customerId = partyOid
			return service.getPayments(organizationId, filter, page, limit)
		},

		customerPaymentsByCustomer: async (_: unknown, { customerId }: { customerId: string }) =>
			service.getPaymentsByCustomer(customerId),
	},

	Mutation: {
		createCustomerPayment: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			if (!partyObjectId(input.customerId)) {
				throw new GraphQLValidationError('customerId must be a valid bill-to record id')
			}
			return service.createPayment(input, ctx.user?.id ?? '')
		},

		updateCustomerPayment: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
			service.updatePayment(id, input, ctx.user?.id ?? ''),

		deleteCustomerPayment: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			await service.deletePayment(id, ctx.user?.id ?? '')
			return true
		},
	},

	CustomerPayment: {
		id: (parent: any) => parent._id || parent.id,
		paymentDate: (parent: any) =>
			parent.paymentDate ? new Date(parent.paymentDate).toISOString() : null,
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
		createdAt: (parent: any) =>
			parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt,
		updatedAt: (parent: any) =>
			parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt,
	},
}
