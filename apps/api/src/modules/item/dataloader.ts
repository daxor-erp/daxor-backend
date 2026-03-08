import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { ItemService } from './service'
import { DataLoaderFactory } from '~/lib/data-loader'

/**
 * ItemLoaderService - Batches and caches item database queries
 * Prevents N+1 query problems when loading items in GraphQL resolvers
 */

@singleton()
@injectable()
export class ItemLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(
		private readonly dataLoaderFactory: DataLoaderFactory,
		private readonly itemService: ItemService,
	) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return this.dataLoaderFactory.create<string, any>(
			'item_by_id',
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const items = await Promise.all(ids.map(id => this.itemService.findById(id)))
				return items
			},
			{ ttl: 300, prefix: 'item:id:' }
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
