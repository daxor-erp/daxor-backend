import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { PaymentTermService } from './service'

const service = new PaymentTermService()

export const resolvers = {
	Query: {
		paymentTerm: async (_: unknown, { id }: { id: string }) => service.findById(id),
		paymentTerms: async (_: unknown, args: any) => {
			const { organizationId, isActive } = args
			return service.list(organizationId, { isActive })
		},
	},
	Mutation: {
		createPaymentTerm: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updatePaymentTerm: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Payment term not found')
			return updated
		},
		deletePaymentTerm: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Payment term not found')
			return true
		},
		ensureDefaultPaymentTerms: async (
			_: unknown,
			{ organizationId }: { organizationId: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.ensureDefaultsForOrganization(organizationId, ctx.user?.id)
		},
	},
	PaymentTerm: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		dueDays: (p: any) => p.dueDays ?? 0,
		isActive: (p: any) => p.isActive !== false,
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
