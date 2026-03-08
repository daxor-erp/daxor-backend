import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { OrganizationService } from './service'
import { DataLoaderFactory } from '~/lib/data-loader'

/**
 * OrganizationLoaderService - Batches and caches organization database queries
 * Prevents N+1 query problems when loading organizations in GraphQL resolvers
 */

@singleton()
@injectable()
export class OrganizationLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(
		private readonly dataLoaderFactory: DataLoaderFactory,
		private readonly organizationService: OrganizationService,
	) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return this.dataLoaderFactory.create<string, any>(
			'organization_by_id',
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const organizations = await Promise.all(ids.map(id => this.organizationService.findById(id)))
				return organizations
			},
			{ ttl: 300, prefix: 'organization:id:' }
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
