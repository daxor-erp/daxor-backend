import { GraphQLAuthError } from '@repo/errors'
import type { GraphQLContext } from '~/types/graphql.context'
import { assertAuthenticated, getRoles } from './authz'

export type ErpPermissionAction = 'create' | 'update' | 'delete'

export type ModulePermissionRow = {
	moduleKey: string
	canCreate: boolean
	canUpdate: boolean
	canDelete: boolean
	canView: boolean
}

const BYPASS_ROLES = new Set(['SUPER_ADMIN', 'ERP_ADMIN', 'ORG_ADMIN'])

function bypassesModuleAcl(roles: string[]): boolean {
	return roles.some((r) => BYPASS_ROLES.has(r))
}

function effectiveModulePermission(
	moduleKey: string,
	rows: ModulePermissionRow[] | undefined | null,
): ModulePermissionRow & { unrestricted: boolean } {
	const full = {
		moduleKey,
		canCreate: true,
		canUpdate: true,
		canDelete: true,
		canView: true,
		unrestricted: true as const,
	}
	if (!rows?.length) return full
	const row = rows.find((x) => x.moduleKey === moduleKey)
	if (!row) return full
	return {
		moduleKey,
		canCreate: !!row.canCreate,
		canUpdate: !!row.canUpdate,
		canDelete: !!row.canDelete,
		canView: !!row.canView,
		unrestricted: false as const,
	}
}

function actionDeniedMessage(action: ErpPermissionAction): string {
	if (action === 'create') return "You don't have sufficient permission to create"
	if (action === 'update') return "You don't have sufficient permission to update"
	return "You don't have sufficient permission to delete"
}

/** Enforces tenant ERP module ACL on mutations (create / update / delete). */
export function assertErpModulePermission(
	ctx: GraphQLContext,
	moduleKey: string,
	action: ErpPermissionAction,
): void {
	assertAuthenticated(ctx)
	const roles = getRoles(ctx)
	if (bypassesModuleAcl(roles)) return

	const rows = ctx.user?.modulePermissions
	const perm = effectiveModulePermission(moduleKey, rows)

	let ok = false
	if (action === 'create') ok = perm.canCreate
	else if (action === 'update') ok = perm.canUpdate
	else ok = perm.canDelete

	if (!ok) throw new GraphQLAuthError(actionDeniedMessage(action))
}
