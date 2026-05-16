import { UserService } from './service'
import { AuditLogService } from '../audit-log/service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import {
	assertAuthenticated,
	assertOrgAdminCanAssignRoles,
	assertPlatformAdmin,
	isOrgAdmin,
	isPlatformAdmin,
	orgIdString,
} from '../auth/authz'
import { ROLES } from '../role/permissions'

const userService = new UserService()
const auditService = new AuditLogService()

function sameOrg(ctx: GraphQLContext, orgField: unknown): boolean {
	const mine = orgIdString(ctx)
	if (!mine) return false
	return String(orgField) === mine
}

async function assertCanAccessUser(ctx: GraphQLContext, targetOrgId: unknown): Promise<void> {
	assertAuthenticated(ctx)
	if (isPlatformAdmin(ctx)) return
	if (isOrgAdmin(ctx) && sameOrg(ctx, targetOrgId)) return
	throw new GraphQLAuthError('Forbidden')
}

function normalizeModulePermissions(
	input: Array<{
		moduleKey: string
		canCreate: boolean
		canUpdate: boolean
		canDelete: boolean
		canView: boolean
	}>,
) {
	return input.map((row) => {
		let { moduleKey, canCreate, canUpdate, canDelete, canView } = row
		if (canCreate || canUpdate || canDelete) canView = true
		if (!canView) {
			canCreate = false
			canUpdate = false
			canDelete = false
		}
		return { moduleKey, canCreate, canUpdate, canDelete, canView }
	})
}

function toGraphQLModulePermissions(parent: { modulePermissions?: unknown }): Array<{
	moduleKey: string
	canCreate: boolean
	canUpdate: boolean
	canDelete: boolean
	canView: boolean
}> {
	const rows = parent?.modulePermissions
	if (!Array.isArray(rows)) return []
	return rows.map((r: any) => ({
		moduleKey: String(r.moduleKey),
		canCreate: !!r.canCreate,
		canUpdate: !!r.canUpdate,
		canDelete: !!r.canDelete,
		canView: !!r.canView,
	}))
}

export const resolvers = {
	Query: {
		user: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const u = await userService.findById(id)
			if (!u || u.deletedAt) return null
			await assertCanAccessUser(ctx, u.organizationId)
			return u
		},
		userByEmail: async (_: unknown, { email }: { email: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const u = await userService.findByEmail(email)
			if (!u || u.deletedAt) return null
			await assertCanAccessUser(ctx, u.organizationId)
			return u
		},
		usersByRole: async (_: unknown, _args: { role: string }, ctx: GraphQLContext) => {
			assertPlatformAdmin(ctx)
			return userService.findByRole(_args.role)
		},
		usersByOrganization: async (_: unknown, args: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const { organizationId, page = 1, limit = 10, type, status, search } = args
			if (isOrgAdmin(ctx) && !isPlatformAdmin(ctx)) {
				const mine = orgIdString(ctx)
				if (!mine || String(organizationId) !== mine) {
					throw new GraphQLAuthError('You can only list users in your organization')
				}
			} else if (!isPlatformAdmin(ctx)) {
				throw new GraphQLAuthError('Forbidden')
			}
			const filter: any = { organizationId, deletedAt: null }
			if (type) filter.userType = type
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ email: { $regex: search, $options: 'i' } },
					{ firstName: { $regex: search, $options: 'i' } },
					{ lastName: { $regex: search, $options: 'i' } },
				]
			}
			const result = await userService.findWithPagination(filter, {
				page,
				limit,
				sortBy: 'createdAt',
				sortOrder: 'desc',
			})
			return { users: result.data, total: result.total, page, limit }
		},
	},
	Mutation: {
		createUser: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const payload = { ...input }
			if (isOrgAdmin(ctx) && !isPlatformAdmin(ctx)) {
				const mine = orgIdString(ctx)
				if (!mine || String(payload.organizationId) !== mine) {
					throw new GraphQLAuthError('Can only create users in your organization')
				}
				assertOrgAdminCanAssignRoles(payload.roles)
			} else if (!isPlatformAdmin(ctx)) {
				throw new GraphQLAuthError('Forbidden')
			}

			const user = await userService.createUser(payload, ctx.user?.id)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'create',
				entityType: 'User',
				entityId: user._id,
				newValues: { email: user.email, firstName: user.firstName },
			})
			return user
		},
		updateUser: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const existing = await userService.findById(id)
			if (!existing || existing.deletedAt) {
				throw new GraphQLAuthError('User not found')
			}
			if (isOrgAdmin(ctx) && !isPlatformAdmin(ctx)) {
				if (!sameOrg(ctx, existing.organizationId)) {
					throw new GraphQLAuthError('Forbidden')
				}
				const targetRoles = existing.roles || []
				if (targetRoles.includes(ROLES.ORG_ADMIN)) {
					throw new GraphQLAuthError('Cannot modify an organization administrator account')
				}
				assertOrgAdminCanAssignRoles(input.roles)
			} else if (!isPlatformAdmin(ctx)) {
				throw new GraphQLAuthError('Forbidden')
			}

			const user = await userService.updateUser(id, input, ctx.user?.id)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'update',
				entityType: 'User',
				entityId: user._id,
				newValues: input,
			})
			return user
		},
		deleteUser: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const existing = await userService.findById(id)
			if (!existing || existing.deletedAt) {
				throw new GraphQLAuthError('User not found')
			}
			if (isOrgAdmin(ctx) && !isPlatformAdmin(ctx)) {
				if (!sameOrg(ctx, existing.organizationId)) {
					throw new GraphQLAuthError('Forbidden')
				}
				const targetRoles = existing.roles || []
				if (targetRoles.includes(ROLES.ORG_ADMIN)) {
					throw new GraphQLAuthError('Cannot delete an organization administrator account')
				}
			} else if (!isPlatformAdmin(ctx)) {
				throw new GraphQLAuthError('Forbidden')
			}

			const user = await userService.softDeleteUser(id, ctx.user?.id)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'delete',
				entityType: 'User',
				entityId: user._id,
			})
			return user
		},
		setUserModulePermissions: async (
			_: unknown,
			{ userId, permissions }: { userId: string; permissions: any[] },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const existing = await userService.findById(userId)
			if (!existing || existing.deletedAt) {
				throw new GraphQLAuthError('User not found')
			}
			if (isOrgAdmin(ctx) && !isPlatformAdmin(ctx)) {
				if (!sameOrg(ctx, existing.organizationId)) {
					throw new GraphQLAuthError('Forbidden')
				}
				const targetRoles = existing.roles || []
				if (targetRoles.includes(ROLES.ORG_ADMIN)) {
					throw new GraphQLAuthError('Cannot change module permissions for an organization administrator')
				}
			} else if (!isPlatformAdmin(ctx)) {
				throw new GraphQLAuthError('Forbidden')
			}

			const normalized = normalizeModulePermissions(permissions)

			if (!normalized.length) {
				await userService.updateUser(userId, { $unset: { modulePermissions: 1 } }, ctx.user?.id)
			} else {
				await userService.updateUser(userId, { modulePermissions: normalized }, ctx.user?.id)
			}

			const updated = await userService.findById(userId)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'update',
				entityType: 'User',
				entityId: updated?._id,
				newValues: { modulePermissions: normalized.length ? normalized : null },
			})
			return updated
		},
	},
	User: {
		id: (p: { _id?: unknown; id?: string }) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: { organizationId?: unknown }) =>
			p.organizationId != null ? String(p.organizationId) : null,
		roles: (p: { roles?: string[] }) => p.roles ?? [],
		modulePermissions: (p: { modulePermissions?: unknown }) => toGraphQLModulePermissions(p),
	},
}
