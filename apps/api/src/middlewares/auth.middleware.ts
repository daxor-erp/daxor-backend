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
			organizationId?: string
		}
		return { req, res, user: decoded }
	} catch {
		return { req, res }
	}
}
