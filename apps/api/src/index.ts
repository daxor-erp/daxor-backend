import 'reflect-metadata'
import { config } from '~/config'
import { Application } from '~/app'

const bootstrap = async () => {
	try {
		const app = new Application()
		await app.start()
	} catch (error) {
		console.error('Bootstrap failed:', error)
		process.exit(1)
	}
}

const { environment, port } = config
const httpServerUrl = `http://localhost:${port}`
const graphqlServerUrl = `http://localhost:${port}/graphql`

bootstrap().then(() => {
	console.info(`HttpServer::${environment} ${httpServerUrl}`)
	console.info(`GraphQL::${environment}  ${graphqlServerUrl}`)
})
