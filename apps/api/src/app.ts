import { config } from '~/config'
import { Server } from '~/server/express'
import { connectDB } from '~/lib/db-connection'
import { logger, metrics } from '@repo/observability'

export class Application {
	private server: Server

	constructor() {
		this.server = new Server()
		this.setupProcessHandlers()
	}

	private setupProcessHandlers(): void {
		const signals = ['SIGTERM', 'SIGINT'] as const
		signals.forEach((signal) => {
			process.on(signal, () => {
				console.log('[SHUTDOWN] Received OS signal:', signal)
				this.gracefulShutdown(signal)
			})
		})

		process.on('uncaughtException', (error) => {
			console.error('[SHUTDOWN] uncaughtException:', error)
			logger.error('Uncaught Exception:', error)
			this.handleFatalError(error)
		})

		process.on('unhandledRejection', (reason) => {
			console.error('[SHUTDOWN] unhandledRejection:', reason)
			logger.error('Unhandled Rejection:', reason)
			this.handleFatalError(reason)
		})
	}

	private async gracefulShutdown(signal: string): Promise<void> {
		logger.info(`${signal} received. Starting graceful shutdown...`)

		try {
			await this.server.stop()
			logger.info('Server closed successfully')
			process.exit(0)
		} catch (error) {
			logger.error('Error during shutdown:', error)
			process.exit(1)
		}
	}

	private handleFatalError(error: unknown): void {
		logger.error('Fatal error occurred:', error)
		this.gracefulShutdown('FATAL_ERROR').catch(() => process.exit(1))
	}

	public async start(): Promise<void> {
		try {
			logger.info('Starting application...', {
				environment: config.environment,
				port: config.port,
			})

			await connectDB(config.mongoDatabaseUrl, config.mongoDebugMode)
			logger.info('Database connected successfully')

			const app = this.server.getApp()
			app.listen(config.port)

			logger.info('Application started successfully', {
				port: config.port,
				environment: config.environment,
			})
			metrics.addMetric('ApplicationStartup', 1, 'Count')
		} catch (error) {
			logger.error('Failed to start application:', error)
			this.handleFatalError(error)
		}
	}
}
