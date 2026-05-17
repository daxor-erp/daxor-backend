import type { Application, Request } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

const isProd = process.env.NODE_ENV === 'production'

// Per-window cap for /graphql. Dashboards fan out many queries per page load,
// so the prod cap has to be generous; tune via env without a redeploy.
const GRAPHQL_MAX = Number(
	process.env.GRAPHQL_RATE_LIMIT_MAX ?? (isProd ? 2000 : 10_000),
)
const GRAPHQL_WINDOW_MS = Number(
	process.env.GRAPHQL_RATE_LIMIT_WINDOW_MS ?? 5 * 60 * 1000,
)

export const configureMiddleware = (app: Application) => {
	app.set('trust proxy', 1)
	app.use(cors())
	app.use(helmet({ contentSecurityPolicy: false }))
	app.use(compression())
	app.use(express.json({ limit: '10mb' }))
	app.use(express.urlencoded({ extended: true, limit: '10mb' }))

	const limiter = rateLimit({
		windowMs: GRAPHQL_WINDOW_MS,
		max: GRAPHQL_MAX,
		standardHeaders: true,
		legacyHeaders: false,
		// Key by authenticated user when possible so one tenant doesn't starve another
		// behind a shared NAT / proxy; fall back to IP (IPv6-safe).
		keyGenerator: (req: Request) => {
			const uid =
				(req as Request & { user?: { id?: string } }).user?.id ??
				(typeof req.headers['x-user-id'] === 'string' ? req.headers['x-user-id'] : undefined)
			if (uid) return `u:${uid}`
			return `ip:${req.ip ?? 'unknown'}`
		},
	})
	app.use('/graphql', limiter)
}
