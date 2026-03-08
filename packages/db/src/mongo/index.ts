import mongoose from 'mongoose'
import { DbDataCreationError } from '@repo/errors'

export const connectDB = async (uri: string, debug = false) => {
	try {
		mongoose.set('debug', debug)
		await mongoose.connect(uri)
		console.log('MongoDB connected successfully')
	} catch (error) {
		console.error('MongoDB connection error:', error)
		throw new DbDataCreationError('MongoDB connection')
	}
}

export { mongoose }
