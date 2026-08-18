import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { BankService } from './service'

const service = new BankService()

export const resolvers = {
	Query: {
		bank: async (_: unknown, { id }: { id: string }) => service.findById(id),
		banks: async (_: unknown, { organizationId, search }: any) => service.list(organizationId, search),
	},
	Mutation: {
		createBank: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateBank: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Bank not found')
			return updated
		},
		deleteBank: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Bank not found')
			return true
		},
	},
	Bank: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
