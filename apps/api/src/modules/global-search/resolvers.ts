import type { GraphQLContext } from '~/types/graphql.context'
import { assertAuthenticated } from '../auth/authz'
import { GlobalSearchService } from './service'

const service = new GlobalSearchService()

export const resolvers = {
	Query: {
		globalSearch: async (
			_: unknown,
			{ organizationId, query, limitPerKind }: { organizationId: string; query: string; limitPerKind?: number },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.search(organizationId, query, typeof limitPerKind === 'number' ? limitPerKind : 5)
		},
	},
	SearchHit: {
		id: (p: any) => String(p.id ?? ''),
	},
}
