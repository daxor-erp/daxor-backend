import { logger } from '@repo/observability'
import mongoose, { Connection } from 'mongoose'

let dbConnection: Connection | null = null

export const connectDB = async (uri: string, debugMode: boolean): Promise<Connection> => {
	if (dbConnection) return dbConnection

	try {
		mongoose.set('debug', false)
		const mongooseInstance = await mongoose.connect(uri)
		dbConnection = mongooseInstance.connection
		logger.info('Database connected successfully')
		return dbConnection
	} catch (error) {
		logger.error('Database connection failed:', error)
		process.exit(1)
	}
}

export const getDB = (): Connection => {
	if (!dbConnection) throw new Error('Database not connected!')
	return dbConnection
}

export const closeDB = async (): Promise<void> => {
	if (dbConnection) {
		await dbConnection.close()
		logger.info('Database connection closed')
		dbConnection = null
	}
}
