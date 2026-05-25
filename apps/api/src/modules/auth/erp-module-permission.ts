import { GraphQLAuthError } from '@repo/errors'
import type { GraphQLContext } from '~/types/graphql.context'
import { assertAuthenticated, getRoles } from './authz'

export type ErpPermissionAction = 'create' | 'update' | 'delete'

export type ModulePermissionRow = {
	moduleKey: string
	submoduleKey?: string | null
	canCreate: boolean
	canUpdate: boolean
	canDelete: boolean
	canView: boolean
}

const BYPASS_ROLES = new Set(['SUPER_ADMIN', 'ERP_ADMIN', 'ORG_ADMIN'])

function bypassesModuleAcl(roles: string[]): boolean {
	return roles.some((r) => BYPASS_ROLES.has(r))
}

function isModuleGranular(moduleKey: string, rows: ModulePermissionRow[]): boolean {
	return rows.some((r) => r.moduleKey === moduleKey && r.submoduleKey)
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
	const row = rows.find((x) => x.moduleKey === moduleKey && !x.submoduleKey)
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

/** Effective CRUD for a nav submodule (aligned with frontend erp-module-access). */
export function effectiveSubmodulePermission(
	moduleKey: string,
	submoduleKey: string,
	rows: ModulePermissionRow[] | undefined | null,
): { canCreate: boolean; canUpdate: boolean; canDelete: boolean; canView: boolean } {
	const full = { canCreate: true, canUpdate: true, canDelete: true, canView: true }
	const deny = { canCreate: false, canUpdate: false, canDelete: false, canView: false }
	if (!rows?.length) return full

	if (!isModuleGranular(moduleKey, rows)) {
		const p = effectiveModulePermission(moduleKey, rows)
		return {
			canCreate: p.canCreate,
			canUpdate: p.canUpdate,
			canDelete: p.canDelete,
			canView: p.canView,
		}
	}

	const exact = rows.find((r) => r.moduleKey === moduleKey && r.submoduleKey === submoduleKey)
	if (exact) {
		return {
			canCreate: !!exact.canCreate,
			canUpdate: !!exact.canUpdate,
			canDelete: !!exact.canDelete,
			canView: !!exact.canView,
		}
	}
	const legacy = rows.find((r) => r.moduleKey === moduleKey && !r.submoduleKey)
	if (legacy) {
		return {
			canCreate: !!legacy.canCreate,
			canUpdate: !!legacy.canUpdate,
			canDelete: !!legacy.canDelete,
			canView: !!legacy.canView,
		}
	}
	return deny
}

function actionDeniedMessage(action: ErpPermissionAction): string {
	if (action === 'create') return "You don't have sufficient permission to create"
	if (action === 'update') return "You don't have sufficient permission to update"
	return "You don't have sufficient permission to delete"
}

function rowsFromContext(ctx: GraphQLContext): ModulePermissionRow[] {
	const raw = ctx.user?.modulePermissions
	if (!Array.isArray(raw)) return []
	return raw.map((r: any) => ({
		moduleKey: String(r.moduleKey ?? ''),
		submoduleKey: r.submoduleKey != null && r.submoduleKey !== '' ? String(r.submoduleKey) : null,
		canCreate: !!r.canCreate,
		canUpdate: !!r.canUpdate,
		canDelete: !!r.canDelete,
		canView: !!r.canView,
	}))
}

/** Mutations: require create / update / delete on the mapped submodule. */
export function assertErpModulePermission(
	ctx: GraphQLContext,
	moduleKey: string,
	submoduleKey: string,
	action: ErpPermissionAction,
): void {
	assertAuthenticated(ctx)
	const roles = getRoles(ctx)
	if (bypassesModuleAcl(roles)) return

	const rows = rowsFromContext(ctx)
	const perm = effectiveSubmodulePermission(moduleKey, submoduleKey, rows)

	let ok = false
	if (action === 'create') ok = perm.canCreate
	else if (action === 'update') ok = perm.canUpdate
	else ok = perm.canDelete

	if (!ok) throw new GraphQLAuthError(actionDeniedMessage(action))
}

/** Queries: require view on the mapped submodule. */
export function assertErpSubmoduleViewPermission(
	ctx: GraphQLContext,
	moduleKey: string,
	submoduleKey: string,
): void {
	assertAuthenticated(ctx)
	const roles = getRoles(ctx)
	if (bypassesModuleAcl(roles)) return

	const rows = rowsFromContext(ctx)
	const perm = effectiveSubmodulePermission(moduleKey, submoduleKey, rows)
	if (!perm.canView) {
		throw new GraphQLAuthError('You do not have permission to view this data')
	}
}
