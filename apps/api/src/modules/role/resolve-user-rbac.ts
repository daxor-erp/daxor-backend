import { Role } from './model'
import { ACTIONS, RESOURCES, ROLES, ROLE_PERMISSIONS } from './permissions'

export type RbacPermissionRow = { resource: string; actions: string[] }

/** Every resource with full CRUD — mirrors SUPER_ADMIN static shape. */
function allResourcesFullAccess(): RbacPermissionRow[] {
	return Object.values(RESOURCES).map((resource) => ({
		resource,
		actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
	}))
}

function mergeRows(into: Map<string, Set<string>>, rows: RbacPermissionRow[]) {
	for (const p of rows) {
		if (!p?.resource) continue
		if (!into.has(p.resource)) into.set(p.resource, new Set())
		const set = into.get(p.resource)!
		for (const a of p.actions ?? []) {
			if (typeof a === 'string') set.add(a)
		}
	}
}

/**
 * Merges static ROLE_PERMISSIONS entries with org-defined Role documents for role
 * names that are not built-in templates.
 */
export async function resolveUserRbacPermissions(
	roles: string[],
	organizationId: string | null | undefined,
): Promise<RbacPermissionRow[]> {
	if (!roles.length) return []
	if (roles.includes(ROLES.SUPER_ADMIN)) {
		return allResourcesFullAccess()
	}

	const merged = new Map<string, Set<string>>()
	const customNames: string[] = []

	for (const roleName of roles) {
		const staticDef = ROLE_PERMISSIONS[roleName as keyof typeof ROLE_PERMISSIONS]
		if (staticDef?.permissions?.length) {
			mergeRows(merged, staticDef.permissions as RbacPermissionRow[])
		} else {
			customNames.push(roleName)
		}
	}

	if (customNames.length && organizationId) {
		const docs = await Role.find({
			name: { $in: [...new Set(customNames)] },
			organizationId,
			deletedAt: null,
			isSystemRole: false,
		})
			.select({ permissions: 1 })
			.lean()

		for (const doc of docs) {
			const perms = (doc as { permissions?: RbacPermissionRow[] }).permissions
			if (Array.isArray(perms)) mergeRows(merged, perms)
		}
	}

	return Array.from(merged.entries()).map(([resource, actions]) => ({
		resource,
		actions: Array.from(actions),
	}))
}
