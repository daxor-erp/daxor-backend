import { shield, allow, rule } from 'graphql-shield'
import type { GraphQLContext } from '~/types/graphql.context'
import { assertErpModulePermission } from './erp-module-permission'
import { ERP_GRAPHQL_MUTATION_PERMISSIONS } from './mutation-erp-permission-map'

/** Tenant ERP module ACL: mapped mutations require create/update/delete on the matching sidebar module. */
const erpMutationPermissionRule = rule({ cache: 'no_cache' })(
	(_parent, _args, ctx: GraphQLContext, info) => {
		const mapped = ERP_GRAPHQL_MUTATION_PERMISSIONS[info.fieldName]
		if (!mapped) return true
		assertErpModulePermission(ctx, mapped.moduleKey, mapped.action)
		return true
	},
)

export const permissions = () =>
	shield(
		{
			Query: {
				'*': allow,
			},
			Mutation: {
				'*': erpMutationPermissionRule,
			},
		},
		{
			allowExternalErrors: true,
		},
	)
