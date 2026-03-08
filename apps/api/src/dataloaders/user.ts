import { ObjectId } from 'mongodb'
import { container } from 'tsyringe'
import { UserLoaderService } from '~/modules/user'
import { GraphQLNotFoundError, GraphQLValidationError } from '@repo/errors'

/**
 * DataLoader resolver for User entity
 * Efficiently batches and caches user lookups to prevent N+1 query problems
 * Used when resolving user references in other GraphQL types (createdBy, updatedBy, etc.)
 */

export const resolveUser = async (userId?: string) => {
	const userLoader = container.resolve(UserLoaderService)

	if (!userId || !ObjectId.isValid(userId)) {
		throw new GraphQLValidationError('User ID is not valid', {}, { extensions: { code: 'NOT_FOUND', userId } })
	}

	const result = await userLoader.loadById(userId)

	if (result === null) {
		throw new GraphQLNotFoundError('User not found', {}, { extensions: { code: 'NOT_FOUND', userId } })
	}

	return result
}

export const resolveUsers = async (userIds: string[]) => {
	const userLoader = container.resolve(UserLoaderService)

	if (!userIds || !userIds.length) {
		throw new GraphQLValidationError('User IDs are required', {}, { extensions: { code: 'NOT_FOUND', userIds } })
	}

	const result = await userLoader.loadManyByIds(userIds)
	return result.filter(Boolean) as any[]
}
