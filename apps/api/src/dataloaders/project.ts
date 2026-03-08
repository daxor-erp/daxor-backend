import { ObjectId } from 'mongodb'
import { container } from 'tsyringe'
import { ProjectLoaderService } from '~/modules/project'
import { GraphQLNotFoundError, GraphQLValidationError } from '@repo/errors'

/**
 * DataLoader resolver for Project entity
 * Efficiently batches and caches project lookups to prevent N+1 query problems
 * Used when resolving project references in orders, invoices, and tasks
 */

export const resolveProject = async (projectId?: string) => {
	const projectLoader = container.resolve(ProjectLoaderService)

	if (!projectId || !ObjectId.isValid(projectId)) {
		throw new GraphQLValidationError('Project ID is not valid', {}, { extensions: { code: 'NOT_FOUND', projectId } })
	}

	const result = await projectLoader.loadById(projectId)

	if (result === null) {
		throw new GraphQLNotFoundError('Project not found', {}, { extensions: { code: 'NOT_FOUND', projectId } })
	}

	return result
}
