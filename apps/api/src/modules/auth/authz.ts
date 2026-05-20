import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import type { GraphQLContext } from '~/types/graphql.context'
import { ROLES, ROLE_PERMISSIONS } from '../role/permissions'
import { RoleService } from '../role/service'

const PLATFORM_ROLES = [ROLES.SUPER_ADMIN, ROLES.ERP_ADMIN] as const

/** Roles that only platform admins may assign to users. */
export const PLATFORM_ONLY_ASSIGNABLE_ROLES = new Set<string>([
	ROLES.SUPER_ADMIN,
	ROLES.ERP_ADMIN,
	ROLES.ORG_ADMIN,
])

/** Built-in templates an org admin may assign without a Role row (same list as frontend ORG_ADMIN_ASSIGNABLE_ROLES). */
export const ORG_ASSIGNABLE_BUILTIN_ROLE_SET = new Set(
	Object.keys(ROLE_PERMISSIONS).filter((k) => !PLATFORM_ONLY_ASSIGNABLE_ROLES.has(k)),
)

export function getRoles(ctx: GraphQLContext): string[] {
	if (!ctx.user) return []
	if (ctx.user.roles?.length) return ctx.user.roles
	if (ctx.user.role) return [ctx.user.role]
	return []
}

export function assertAuthenticated(ctx: GraphQLContext): void {
	if (!ctx.user?.id) {
		throw new GraphQLAuthError('Not authenticated')
	}
}

export function isPlatformAdminRoles(roles: string[]): boolean {
	return roles.some((r) =>
		(PLATFORM_ROLES as readonly string[]).includes(r),
	)
}

export function isPlatformAdmin(ctx: GraphQLContext): boolean {
	return isPlatformAdminRoles(getRoles(ctx))
}

export function isOrgAdmin(ctx: GraphQLContext): boolean {
	return getRoles(ctx).includes(ROLES.ORG_ADMIN)
}

export function orgIdString(ctx: GraphQLContext): string | undefined {
	const raw = ctx.user?.organizationId
	if (raw == null) return undefined
	return String(raw)
}

export function assertPlatformAdmin(ctx: GraphQLContext): void {
	assertAuthenticated(ctx)
	if (!isPlatformAdmin(ctx)) {
		throw new GraphQLAuthError('Platform administrator access required')
	}
}

const roleService = new RoleService()

export async function assertOrgAdminCanAssignRoles(
	rolesToAssign: string[] | undefined | null,
	organizationId: string,
): Promise<void> {
	if (!rolesToAssign?.length) return
	const bad = rolesToAssign.filter((r) => PLATFORM_ONLY_ASSIGNABLE_ROLES.has(r))
	if (bad.length) {
		throw new GraphQLValidationError(
			'Organization admins cannot assign privileged roles',
		)
	}
	for (const r of rolesToAssign) {
		if (ORG_ASSIGNABLE_BUILTIN_ROLE_SET.has(r)) continue
		const doc = await roleService.getRoleByName(r, organizationId)
		if (
			!doc ||
			doc.deletedAt ||
			doc.isSystemRole ||
			String(doc.organizationId) !== String(organizationId)
		) {
			throw new GraphQLValidationError(
				`Unknown or invalid role for this organization: ${r}`,
			)
		}
	}
}
