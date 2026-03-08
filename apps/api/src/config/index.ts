import dotenv from 'dotenv'

dotenv.config()

export const config = {
	environment: process.env.NODE_ENV || 'development',
	port: Number.parseInt(process.env.PORT || '4000', 10),
	mongoDatabaseUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/daxor',
	dbName: process.env.DB_NAME || 'daxor_db',
	mongoDebugMode: process.env.MONGO_DEBUG === 'true',
	jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
	jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
	email: {
		host: process.env.EMAIL_HOST || 'smtp.gmail.com',
		port: Number.parseInt(process.env.EMAIL_PORT || '587', 10),
		user: process.env.EMAIL_USER || '',
		password: process.env.EMAIL_PASSWORD || '',
		from: process.env.EMAIL_FROM || 'noreply@daxor.com',
	},
	upload: {
		maxSize: Number.parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10),
		uploadDir: process.env.UPLOAD_DIR || './uploads',
	},
	api: {
		version: process.env.API_VERSION || 'v1',
		prefix: process.env.API_PREFIX || '/api',
	},
	log: {
		level: process.env.LOG_LEVEL || 'info',
		dir: process.env.LOG_DIR || './logs',
	},
	observability: {
		enabled: process.env.OBSERVABILITY_ENABLED === 'true',
		serviceName: process.env.SERVICE_NAME || 'daxor-api',
	},
}
