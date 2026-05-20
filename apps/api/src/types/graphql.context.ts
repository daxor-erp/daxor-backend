import type { Request, Response } from 'express'

export type GraphQLUserModulePermission = {
	moduleKey: string
	submoduleKey?: string | null
	canCreate: boolean
	canUpdate: boolean
	canDelete: boolean
	canView: boolean
}

export type GraphQLContext = {
	req: Request
	res: Response
	user?: {
		id: string
		email: string
		role?: string
		roles?: string[]
		organizationId?: string | null
		/** Loaded from DB each request — ERP sidebar ACL for mutations (create/update/delete). */
		modulePermissions?: GraphQLUserModulePermission[]
		/** Static role definitions + org custom Role documents merged for API RBAC. */
		rbacPermissions?: Array<{ resource: string; actions: string[] }>
	}
}
