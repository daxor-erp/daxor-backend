import type { Application } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

export const configureMiddleware = (app: Application) => {
	app.use(cors())
	app.use(helmet({ contentSecurityPolicy: false }))
	app.use(compression())
	app.use(express.json({ limit: '10mb' }))
	app.use(express.urlencoded({ extended: true, limit: '10mb' }))

	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: process.env.NODE_ENV === 'production' ? 100 : 10_000,
	})
	app.use('/graphql', limiter)
}
