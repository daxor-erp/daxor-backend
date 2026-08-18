import type { GraphQLContext } from '~/types/graphql.context'
import { assertAuthenticated } from '../auth/authz'
import { TaxComplianceService } from './service'

const service = new TaxComplianceService()

export const resolvers = {
	Query: {
		checkGstinStatus: async (_: unknown, { gstin }: { gstin: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.checkGstinStatus(gstin)
		},
		lookupPan: async (_: unknown, { pan }: { pan: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.lookupPan(pan)
		},
		suggestPan: async (_: unknown, { partial }: { partial: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.suggestPan(partial)
		},
	},
}
