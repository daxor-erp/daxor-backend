import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '~/config'
import type { GraphQLContext, GraphQLUserModulePermission } from '~/types/graphql.context'
import { UserRepository } from '~/modules/user/repository'

const userRepository = new UserRepository()

function normalizeModulePermissions(raw: unknown): GraphQLUserModulePermission[] | undefined {
	if (!Array.isArray(raw) || raw.length === 0) return undefined
	const rows: GraphQLUserModulePermission[] = []
	for (const r of raw) {
		if (!r || typeof r !== 'object') continue
		const row = r as Record<string, unknown>
		const moduleKey = row.moduleKey
		if (typeof moduleKey !== 'string' || !moduleKey.length) continue
		rows.push({
			moduleKey,
			canCreate: !!row.canCreate,
			canUpdate: !!row.canUpdate,
			canDelete: !!row.canDelete,
			canView: !!row.canView,
		})
	}
	return rows.length ? rows : undefined
}

export const createContext = async ({
	req,
	res,
}: {
	req: Request
	res: Response
}): Promise<GraphQLContext> => {
	const token = req.headers.authorization?.replace('Bearer ', '')

	if (!token) {
		return { req, res }
	}

	try {
		const decoded = jwt.verify(token, config.jwtSecret) as {
			id: string
			email: string
			role?: string
			roles?: string[]
			organizationId?: string | null
		}
		const dbUser = await userRepository.findById(String(decoded.id))
		if (!dbUser || dbUser.deletedAt) {
			return { req, res }
		}

		const rolesFromDb = Array.isArray(dbUser.roles) ? dbUser.roles.filter(Boolean) : []
		const roles =
			rolesFromDb.length > 0
				? rolesFromDb.map(String)
				: decoded.roles?.length
					? decoded.roles.map(String)
					: decoded.role
						? [String(decoded.role)]
						: []

		const orgFromDb =
			dbUser.organizationId != null ? String(dbUser.organizationId) : null
		const organizationId =
			orgFromDb ??
			(decoded.organizationId === undefined || decoded.organizationId === null
				? null
				: String(decoded.organizationId))

		return {
			req,
			res,
			user: {
				id: String(dbUser._id ?? decoded.id),
				email: String(dbUser.email ?? decoded.email),
				roles,
				role: roles[0],
				organizationId,
				modulePermissions: normalizeModulePermissions(dbUser.modulePermissions),
			},
		}
	} catch {
		return { req, res }
	}
}
