import { ObjectId } from 'mongodb'
import { container } from 'tsyringe'
import { ItemLoaderService } from '~/modules/item'
import { GraphQLNotFoundError, GraphQLValidationError } from '@repo/errors'

/**
 * DataLoader resolver for Item entity
 * Efficiently batches and caches item lookups to prevent N+1 query problems
 * Used when resolving item references in orders, invoices, and other documents
 */

export const resolveItem = async (itemId?: string) => {
	const itemLoader = container.resolve(ItemLoaderService)

	if (!itemId || !ObjectId.isValid(itemId)) {
		throw new GraphQLValidationError('Item ID is not valid', {}, { extensions: { code: 'NOT_FOUND', itemId } })
	}

	const result = await itemLoader.loadById(itemId)

	if (result === null) {
		throw new GraphQLNotFoundError('Item not found', {}, { extensions: { code: 'NOT_FOUND', itemId } })
	}

	return result
}
