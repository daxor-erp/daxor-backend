import path from 'node:path'
import type express from 'express'
import type { Server } from 'node:http'
import depthLimit from 'graphql-depth-limit'
import { ApolloServer } from '@apollo/server'
import { loadFilesSync } from '@graphql-tools/load-files'
import { expressMiddleware } from '@apollo/server/express4'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { config } from '~/config'
import { createContext } from '~/middlewares/auth.middleware'
import type { GraphQLContext } from '~/types/graphql.context'
import { validationDirectiveTransformer } from './transformer'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from '~/modules/auth'

export class GraphQLServer {
	private apolloServer: ApolloServer<GraphQLContext> | undefined

	constructor(
		private app: express.Application,
		private httpServer: Server,
	) {}

	async initialize() {
		let schema = this.createSchema()
		schema = validationDirectiveTransformer(schema)
		const securedSchema = applyMiddleware(schema, permissions())

		const wsServer = new WebSocketServer({
			server: this.httpServer,
			path: '/graphql',
		})

		const serverCleanup = useServer({ schema: securedSchema }, wsServer)

		this.apolloServer = new ApolloServer<GraphQLContext>({
			schema: securedSchema,
			csrfPrevention: false,
			plugins: [
				ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
				{
					async serverWillStart() {
						return {
							async drainServer() {
								await serverCleanup.dispose()
							},
						}
					},
				},
			],
			validationRules: [depthLimit(10)],
		})

		await this.apolloServer.start()

		this.app.use(
			'/graphql',
			expressMiddleware(this.apolloServer, {
				context: createContext,
			}),
		)
	}

	private createSchema() {
		const rawTypeDefs = mergeTypeDefs([
			...loadFilesSync(path.join(__dirname, '..', 'schema.graphql')),
			...loadFilesSync(path.join(__dirname, '..', 'modules/**/*.graphql')),
		])

		const rawResolvers = mergeResolvers(
			loadFilesSync(path.join(__dirname, '..', 'modules/**/resolvers.*')),
		)

		return makeExecutableSchema({
			typeDefs: rawTypeDefs,
			resolvers: rawResolvers,
			inheritResolversFromInterfaces: true,
		})
	}

	async stop() {
		if (this.apolloServer) {
			await this.apolloServer?.stop()
		}
	}
}
