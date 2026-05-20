import { shield, allow, rule } from 'graphql-shield'
import type { GraphQLContext } from '~/types/graphql.context'
import { assertErpModulePermission, assertErpSubmoduleViewPermission } from './erp-module-permission'
import { ERP_GRAPHQL_MUTATION_PERMISSIONS } from './mutation-erp-permission-map'
import { ERP_GRAPHQL_QUERY_PERMISSIONS } from './query-erp-permission-map'

const erpMutationPermissionRule = rule({ cache: 'no_cache' })(
	(_parent, _args, ctx: GraphQLContext, info) => {
		const mapped = ERP_GRAPHQL_MUTATION_PERMISSIONS[info.fieldName]
		if (!mapped) return true
		assertErpModulePermission(ctx, mapped.moduleKey, mapped.submoduleKey, mapped.action)
		return true
	},
)

const erpQueryPermissionRule = rule({ cache: 'no_cache' })(
	(_parent, _args, ctx: GraphQLContext, info) => {
		const mapped = ERP_GRAPHQL_QUERY_PERMISSIONS[info.fieldName]
		if (!mapped) return true
		assertErpSubmoduleViewPermission(ctx, mapped.moduleKey, mapped.submoduleKey)
		return true
	},
)

export const permissions = () =>
	shield(
		{
			Query: {
				'*': erpQueryPermissionRule,
			},
			Mutation: {
				'*': erpMutationPermissionRule,
			},
		},
		{
			allowExternalErrors: true,
		},
	)
