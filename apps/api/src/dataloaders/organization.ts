import { ObjectId } from 'mongodb'
import { container } from 'tsyringe'
import { OrganizationLoaderService } from '~/modules/organization'
import { GraphQLNotFoundError, GraphQLValidationError } from '@repo/errors'

/**
 * DataLoader resolver for Organization entity
 * Efficiently batches and caches organization lookups to prevent N+1 query problems
 * Used when resolving organization references in other GraphQL types
 */

export const resolveOrganization = async (organizationId?: string) => {
	const orgLoader = container.resolve(OrganizationLoaderService)

	if (!organizationId || !ObjectId.isValid(organizationId)) {
		throw new GraphQLValidationError('Organization ID is not valid', {}, { extensions: { code: 'NOT_FOUND', organizationId } })
	}

	const result = await orgLoader.loadById(organizationId)

	if (result === null) {
		throw new GraphQLNotFoundError('Organization not found', {}, { extensions: { code: 'NOT_FOUND', organizationId } })
	}

	return result
}
