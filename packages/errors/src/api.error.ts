import { API_ERROR_CODE, BaseError, ErrorContext } from './base.error'

export class ApiError extends BaseError {
	public expose = true
	public status: number
	public statusCode: number
	public code: API_ERROR_CODE = API_ERROR_CODE.INTERNAL_ERROR

	constructor(
		message: string,
		status: number,
		metadata: Record<string, unknown> = {},
		context: ErrorContext = {},
		errorCode: API_ERROR_CODE = API_ERROR_CODE.INTERNAL_ERROR,
	) {
		super({ message, metadata, context, errorCode })
		this.status = this.statusCode = status
		Object.setPrototypeOf(this, ApiError.prototype)
		Error.captureStackTrace(this, this.constructor)
	}

	public toJSON() {
		return {
			...super.toJSON(),
			status: this.status,
		}
	}
}

export class ApiValidationError extends ApiError {
	constructor(
		message: string = 'Validation failed',
		metadata: Record<string, unknown> = {},
		context: ErrorContext = {},
	) {
		super(message, 422, metadata, context, API_ERROR_CODE.VALIDATION_ERROR)
	}
}

export class ApiDataNotFoundError extends ApiError {
	constructor(
		message: string = 'Data not found',
		metadata: Record<string, unknown> = {},
		context: ErrorContext = {},
	) {
		super(message, 404, metadata, context, API_ERROR_CODE.NOT_FOUND)
	}
}

export class ApiAuthorizationError extends ApiError {
	constructor(
		message: string = 'Unauthorized access',
		metadata: Record<string, unknown> = {},
		context: ErrorContext = {},
	) {
		super(message, 403, metadata, context, API_ERROR_CODE.UNAUTHORIZED)
	}
}

export class ApiUnexpectedError extends ApiError {
	constructor(
		message: string = 'An unexpected error occurred',
		metadata: Record<string, unknown> = {},
		context: ErrorContext = {},
	) {
		super(message, 500, metadata, context, API_ERROR_CODE.SERVER_ERROR)
	}
}
