import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import type { GraphQLContext } from '~/types/graphql.context'
import { ROLES } from '../role/permissions'

const PLATFORM_ROLES = [ROLES.SUPER_ADMIN, ROLES.ERP_ADMIN] as const

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

/** Roles that only platform admins may assign to users. */
export const PLATFORM_ONLY_ASSIGNABLE_ROLES = new Set<string>([
	ROLES.SUPER_ADMIN,
	ROLES.ERP_ADMIN,
	ROLES.ORG_ADMIN,
])

export function assertOrgAdminCanAssignRoles(
	rolesToAssign: string[] | undefined | null,
): void {
	if (!rolesToAssign?.length) return
	const bad = rolesToAssign.filter((r) => PLATFORM_ONLY_ASSIGNABLE_ROLES.has(r))
	if (bad.length) {
		throw new GraphQLValidationError(
			'Organization admins cannot assign privileged roles',
		)
	}
}
