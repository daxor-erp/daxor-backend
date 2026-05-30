import { AuthService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'

const service = new AuthService()

export const resolvers = {
	Query: {
		me: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			if (!ctx.user) throw new GraphQLAuthError('Not authenticated')
			return service.getUserById(ctx.user.id)
		},
	},
	Mutation: {
		login: async (_: unknown, { input }: any) => service.login(input.email, input.password),
	},
}
