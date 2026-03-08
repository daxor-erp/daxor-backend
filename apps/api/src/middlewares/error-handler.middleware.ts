import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '@repo/errors'

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ApiError) {
		return res.status(err.status).json({
			error: {
				message: err.message,
				code: err.errorCode,
				...err.toJSON(),
			},
		})
	}

	console.error('Unhandled error:', err)
	return res.status(500).json({
		error: {
			message: 'Internal server error',
			code: 'INTERNAL_ERROR',
		},
	})
}
