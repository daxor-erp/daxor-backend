import { BaseError, ErrorContext, DB_ERROR_CODE } from './base.error'

export class DatabaseError extends BaseError {
	constructor(
		message: string,
		errorCode: DB_ERROR_CODE,
		context?: ErrorContext,
		metadata?: Record<string, unknown>,
	) {
		super({ message, errorCode, context, metadata })
	}
}

export class DbValidationError extends BaseError {
	constructor(
		details: Record<string, unknown>,
		context?: ErrorContext,
		metadata?: Record<string, unknown>,
	) {
		super({
			message: 'Validation failed for one or more fields.',
			errorCode: DB_ERROR_CODE.VALIDATION_ERROR,
			context,
			metadata: { details, ...metadata },
		})
	}
}

export class DbDataCreationError extends DatabaseError {
	constructor(
		entityName: string,
		context?: ErrorContext,
		metadata?: Record<string, unknown>,
	) {
		super(
			`Failed to create ${entityName}`,
			DB_ERROR_CODE.CREATION_FAILED,
			context,
			metadata,
		)
	}
}

export class DbDataUpdateError extends DatabaseError {
	constructor(
		entityName: string,
		context?: ErrorContext,
		metadata?: Record<string, unknown>,
	) {
		super(
			`Failed to update ${entityName}`,
			DB_ERROR_CODE.UPDATE_FAILED,
			context,
			metadata,
		)
	}
}

export class DbDataNotFoundError extends DatabaseError {
	constructor(
		entityName: string,
		context?: ErrorContext,
		metadata?: Record<string, unknown>,
	) {
		super(`${entityName} not found`, DB_ERROR_CODE.NOT_FOUND, context, metadata)
	}
}

export class DbDataDeleteError extends DatabaseError {
	constructor(
		entityName: string,
		context?: ErrorContext,
		metadata?: Record<string, unknown>,
	) {
		super(
			`Failed to delete ${entityName}`,
			DB_ERROR_CODE.DELETE_FAILED,
			context,
			metadata,
		)
	}
}
