import type { Request, Response } from 'express'

export type GraphQLContext = {
	req: Request
	res: Response
	user?: {
		id: string
		email: string
		role?: string
		roles?: string[]
		organizationId?: string | null
	}
}
