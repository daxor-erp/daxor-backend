import http from 'node:http'
import express from 'express'
import { config } from '~/config'
import { GraphQLServer } from './graphql'
import { configureMiddleware } from '~/middlewares'
import { errorHandler } from '~/middlewares/error-handler.middleware'

export class Server {
	private httpServer: http.Server
	private app: express.Application
	private graphqlServer: GraphQLServer

	constructor() {
		this.app = express()
		this.httpServer = http.createServer(this.app)
		this.graphqlServer = new GraphQLServer(this.app, this.httpServer)

		this.configureMiddleware()
		this.configureRoutes()
		this.configureGraphQL()
		this.configureErrorHandling()
	}

	private async configureGraphQL(): Promise<void> {
		await this.graphqlServer.initialize()
	}

	private configureMiddleware(): void {
		configureMiddleware(this.app)
	}

	private configureRoutes(): void {
		this.app.get('/ping', (_, res) => {
			res.status(200).send('pong')
		})

		this.app.get('/api', (_, res) => {
			res.json({ message: 'Daxor API' })
		})
	}

	private configureErrorHandling(): void {
		this.app.use(errorHandler)
	}

	public getApp(): express.Application {
		return this.app
	}

	public getHttpServer(): http.Server {
		return this.httpServer
	}

	public async stop(): Promise<void> {
		this.httpServer.close()
		console.debug('Server stopped')
	}
}
