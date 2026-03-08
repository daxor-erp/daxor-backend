export const logger = {
	info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
	error: (message: string, error?: any, meta?: any) => console.error(`[ERROR] ${message}`, error, meta || ''),
	warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ''),
	debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta || ''),
	log: (message: string) => console.log(message),
}

export default logger