import {
	ErrorCode,
	BaseError,
	ERROR_CODE,
	ErrorContext,
	BaseErrorProps,
} from './base.error'

export class GraphQLError extends BaseError {
	public path?: readonly (string | number)[]
	public locations?: readonly { line: number; column: number }[]

	constructor(
		message: string,
		errorCode: ErrorCode = ERROR_CODE.GRAPHQL_ERROR,
		context: ErrorContext = {},
		metadata: Record<string, unknown> = {},
		path?: readonly (string | number)[],
		locations?: readonly { line: number; column: number }[],
	) {
		super({
			message,
			errorCode,
			context,
			metadata,
		})
		this.path = path
		this.locations = locations
	}

	public toGraphQLError() {
		return {
			message: this.message,
			extensions: {
				code: this.errorCode,
				context: this.context,
				metadata: this.metadata,
				path: this.path,
				locations: this.locations,
			},
		}
	}

	public static fromPlainObject(obj: Partial<BaseErrorProps>): GraphQLError {
		return new GraphQLError(
			obj.message || 'Unknown GraphQL error',
			obj.errorCode || ERROR_CODE.GRAPHQL_ERROR,
			obj.context || {},
			obj.metadata || {},
		)
	}
}

export class GraphQLAuthError extends GraphQLError {
	constructor(
		message = 'Unauthorized',
		context: ErrorContext = {},
		metadata: Record<string, unknown> = {},
	) {
		super(message, ERROR_CODE.GRAPHQL_ERROR, context, metadata)
	}
}

export class GraphQLValidationError extends GraphQLError {
	constructor(
		message = 'Invalid input',
		context: ErrorContext = {},
		metadata: Record<string, unknown> = {},
	) {
		super(message, ERROR_CODE.GRAPHQL_ERROR, context, metadata)
	}
}

export class GraphQLNotFoundError extends GraphQLError {
	constructor(
		message = 'Resource not found',
		context: ErrorContext = {},
		metadata: Record<string, unknown> = {},
	) {
		super(message, ERROR_CODE.GRAPHQL_ERROR, context, metadata)
	}
}
