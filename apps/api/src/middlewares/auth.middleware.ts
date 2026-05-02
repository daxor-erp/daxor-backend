import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '~/config'
import type { GraphQLContext } from '~/types/graphql.context'

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
		const roles =
			decoded.roles?.length
				? decoded.roles
				: decoded.role
					? [decoded.role]
					: []
		return {
			req,
			res,
			user: {
				...decoded,
				id: String(decoded.id),
				roles,
				role: roles[0],
				organizationId:
					decoded.organizationId === undefined || decoded.organizationId === null
						? null
						: String(decoded.organizationId),
			},
		}
	} catch {
		return { req, res }
	}
}
