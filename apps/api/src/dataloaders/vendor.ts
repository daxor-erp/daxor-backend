import { ObjectId } from 'mongodb'
import { container } from 'tsyringe'
import { VendorLoaderService } from '~/modules/vendor'
import { GraphQLNotFoundError, GraphQLValidationError } from '@repo/errors'

/**
 * DataLoader resolver for Vendor entity
 * Efficiently batches and caches vendor lookups to prevent N+1 query problems
 * Used when resolving vendor references in purchase orders and vendor bills
 */

export const resolveVendor = async (vendorId?: string) => {
	const vendorLoader = container.resolve(VendorLoaderService)

	if (!vendorId || !ObjectId.isValid(vendorId)) {
		throw new GraphQLValidationError('Vendor ID is not valid', {}, { extensions: { code: 'NOT_FOUND', vendorId } })
	}

	const result = await vendorLoader.loadById(vendorId)

	if (result === null) {
		throw new GraphQLNotFoundError('Vendor not found', {}, { extensions: { code: 'NOT_FOUND', vendorId } })
	}

	return result
}
