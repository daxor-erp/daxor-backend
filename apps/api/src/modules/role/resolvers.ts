import type { GraphQLContext } from '~/types/graphql.context'
import { RoleService, validateOrgTenantRoleDefinition } from './service'
import { requireAuth, requirePermission } from '~/middlewares/rbac.middleware'
import { RESOURCES, ACTIONS } from './permissions'
import {
	assertAuthenticated,
	isOrgAdmin,
	isPlatformAdmin,
	orgIdString,
} from '../auth/authz'
import { GraphQLAuthError } from '@repo/errors'

const roleService = new RoleService()

export const resolvers = {
	Query: {
		role: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
			requirePermission(context, RESOURCES.ROLE, ACTIONS.READ)
			return roleService.getRoleById(id)
		},

		roles: async (_: any, __: any, context: GraphQLContext) => {
			requirePermission(context, RESOURCES.ROLE, ACTIONS.READ)
			return roleService.getAllRoles()
		},

		rolesByOrganization: async (
			_: any,
			{ organizationId }: { organizationId: string },
			context: GraphQLContext,
		) => {
			assertAuthenticated(context)
			if (isPlatformAdmin(context)) {
				requirePermission(context, RESOURCES.ROLE, ACTIONS.READ)
				return roleService.getRolesByOrganization(organizationId)
			}
			if (isOrgAdmin(context)) {
				const mine = orgIdString(context)
				if (!mine || String(organizationId) !== mine) {
					throw new GraphQLAuthError('You can only list roles for your organization')
				}
				return roleService.getRolesByOrganization(organizationId)
			}
			throw new GraphQLAuthError('Forbidden')
		},

		systemRoles: async (_: any, __: any, context: GraphQLContext) => {
			requireAuth(context)
			return roleService.getSystemRoles()
		},
	},

	Mutation: {
		createRole: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
			assertAuthenticated(context)
			if (isPlatformAdmin(context)) {
				const user = requirePermission(context, RESOURCES.ROLE, ACTIONS.CREATE)
				return roleService.createRole(input, user.id)
			}
			if (isOrgAdmin(context) && !isPlatformAdmin(context)) {
				const mine = orgIdString(context)
				if (!mine) throw new GraphQLAuthError('No organization')
				validateOrgTenantRoleDefinition({
					name: input.name,
					permissions: input.permissions ?? [],
				})
				const safe = {
					...input,
					name: String(input.name).trim(),
					organizationId: mine,
					isSystemRole: false,
				}
				return roleService.createRole(safe, context.user!.id)
			}
			throw new GraphQLAuthError('Forbidden')
		},

		updateRole: async (
			_: any,
			{ id, input }: { id: string; input: any },
			context: GraphQLContext,
		) => {
			assertAuthenticated(context)
			const existing = await roleService.getRoleById(id)
			if (!existing || existing.deletedAt) {
				throw new GraphQLAuthError('Role not found')
			}
			if (isPlatformAdmin(context)) {
				const user = requirePermission(context, RESOURCES.ROLE, ACTIONS.UPDATE)
				return roleService.updateRole(id, input, user.id)
			}
			if (isOrgAdmin(context) && !isPlatformAdmin(context)) {
				const mine = orgIdString(context)
				if (existing.isSystemRole || !mine || String(existing.organizationId) !== mine) {
					throw new GraphQLAuthError('You can only update tenant-defined roles')
				}
				if (input.permissions != null) {
					validateOrgTenantRoleDefinition({
						name: existing.name,
						permissions: input.permissions,
					})
				}
				return roleService.updateRole(id, input, context.user!.id)
			}
			throw new GraphQLAuthError('Forbidden')
		},

		deleteRole: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
			assertAuthenticated(context)
			const existing = await roleService.getRoleById(id)
			if (!existing || existing.deletedAt) {
				throw new GraphQLAuthError('Role not found')
			}
			if (isPlatformAdmin(context)) {
				const user = requirePermission(context, RESOURCES.ROLE, ACTIONS.DELETE)
				await roleService.deleteRole(id, user.id)
				return true
			}
			if (isOrgAdmin(context) && !isPlatformAdmin(context)) {
				const mine = orgIdString(context)
				if (existing.isSystemRole || !mine || String(existing.organizationId) !== mine) {
					throw new GraphQLAuthError('You can only delete tenant-defined roles')
				}
				await roleService.deleteRole(id, context.user!.id)
				return true
			}
			throw new GraphQLAuthError('Forbidden')
		},

		seedSystemRoles: async (_: any, __: any, context: GraphQLContext) => {
			requirePermission(context, RESOURCES.ROLE, ACTIONS.CREATE)
			return roleService.seedSystemRoles()
		},
	},

	Role: {
		id: (parent: any) => parent._id || parent.id,
	},
}

export const roleResolvers = resolvers
