import dotenv from 'dotenv'

dotenv.config()

export const config = {
	environment: process.env.NODE_ENV || 'development',
	port: Number.parseInt(process.env.PORT || '4000', 10),
	mongoDatabaseUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/daxor',
	mongoDebugMode: process.env.MONGO_DEBUG === 'true',
	jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
	observability: {
		enabled: process.env.OBSERVABILITY_ENABLED === 'true',
		serviceName: process.env.SERVICE_NAME || 'daxor-api',
	},
	upload: {
		uploadDir: process.env.UPLOAD_DIR || 'uploads',
	},
}
