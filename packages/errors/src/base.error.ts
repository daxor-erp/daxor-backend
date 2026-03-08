export const ERROR_CODE = Object.freeze({
	INTERNAL_ERROR: 'INTERNAL_ERROR',
	DATABASE_ERROR: 'DATABASE_ERROR',
	GRAPHQL_ERROR: 'GRAPHQL_ERROR',
	API_ERROR: 'API_ERROR',
	REJECTED_ERROR: 'REJECTED_ERROR',
	VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const)

export enum DB_ERROR_CODE {
	NOT_FOUND = 'DB_NOT_FOUND',
	QUERY_ERROR = 'DB_QUERY_ERROR',
	UPDATE_FAILED = 'DB_UPDATE_FAILED',
	DELETE_FAILED = 'DB_DELETE_FAILED',
	CREATION_FAILED = 'DB_CREATION_FAILED',
	VALIDATION_ERROR = 'DB_VALIDATION_ERROR',
	CONNECTION_FAILED = 'DB_CONNECTION_FAILED',
	CONSTRAINT_VIOLATION = 'DB_CONSTRAINT_VIOLATION',
}

export enum API_ERROR_CODE {
	TIMEOUT = 'API_TIMEOUT',
	CONFLICT = 'API_CONFLICT',
	NOT_FOUND = 'API_NOT_FOUND',
	FORBIDDEN = 'API_FORBIDDEN',
	UNAUTHORIZED = 'API_UNAUTHORIZED',
	SERVER_ERROR = 'API_SERVER_ERROR',
	INTERNAL_ERROR = 'API_INTERNAL_ERROR',
	ALREADY_EXISTS = 'API_ALREADY_EXISTS',
	INVALID_REQUEST = 'API_INVALID_REQUEST',
	VALIDATION_ERROR = 'API_VALIDATION_ERROR',
}

export type ErrorCode =
	| (typeof ERROR_CODE)[keyof typeof ERROR_CODE]
	| DB_ERROR_CODE[keyof DB_ERROR_CODE]
	| API_ERROR_CODE[keyof API_ERROR_CODE]

export type ErrorContext = {
	userId?: string
	requestId?: string
	environment?: string
	functionName?: string
}

export type BaseErrorProps = {
	message: string
	errorCode?: ErrorCode
	context?: ErrorContext
	metadata?: Record<string, unknown>
}

export class BaseError extends Error {
	public errorCode: ErrorCode
	public context?: ErrorContext
	public metadata?: Record<string, unknown>

	constructor({
		message,
		errorCode = ERROR_CODE.INTERNAL_ERROR,
		context = {},
		metadata = {},
	}: BaseErrorProps) {
		super(message)
		this.errorCode = errorCode
		this.context = context
		this.metadata = metadata
		this.name = this.constructor.name
		Error.captureStackTrace?.(this, this.constructor)
	}

	public toJSON() {
		return {
			name: this.name,
			message: this.message,
			errorCode: this.errorCode,
			context: this.context,
			metadata: this.metadata,
		}
	}

	public static fromPlainObject(obj: Partial<BaseErrorProps>): BaseError {
		return new BaseError({
			message: obj.message || 'An unknown error occurred',
			errorCode: obj.errorCode || ERROR_CODE.INTERNAL_ERROR,
			context: obj.context,
			metadata: obj.metadata,
		})
	}

	public static getErrorMessage(error: unknown): string {
		return BaseError.toErrorWithMessage(error).message
	}

	public static isErrorWithMessage(error: unknown): error is Error {
		return (
			error instanceof Error ||
			(typeof error === 'object' && error !== null && 'message' in error)
		)
	}

	public static toErrorWithMessage(error: unknown): Error {
		if (this.isErrorWithMessage(error)) return error
		try {
			return new Error(
				typeof error === 'string' ? error : JSON.stringify(error),
			)
		} catch {
			return new Error(String(error))
		}
	}

	public toString() {
		return `${this.name}: ${this.message} (code: ${this.errorCode})`
	}
}
