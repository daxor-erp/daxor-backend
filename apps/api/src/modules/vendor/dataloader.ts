import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { VendorService } from './service'
import { DataLoaderFactory } from '~/lib/data-loader'

/**
 * VendorLoaderService - Batches and caches vendor database queries
 * Prevents N+1 query problems when loading vendors in GraphQL resolvers
 */

@singleton()
@injectable()
export class VendorLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(
		private readonly dataLoaderFactory: DataLoaderFactory,
		private readonly vendorService: VendorService,
	) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return this.dataLoaderFactory.create<string, any>(
			'vendor_by_id',
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const vendors = await Promise.all(ids.map(id => this.vendorService.findById(id)))
				return vendors
			},
			{ ttl: 300, prefix: 'vendor:id:' }
		)
	}

	async loadById(id: string): Promise<any | null> {
		return this.byIdLoader.load(id)
	}

	async loadManyByIds(ids: string[]): Promise<Array<any | Error | null>> {
		return this.byIdLoader.loadMany(ids)
	}

	clearCache(id: string) {
		this.byIdLoader.clear(id)
	}

	clearAllCache() {
		this.byIdLoader.clearAll()
	}
}
