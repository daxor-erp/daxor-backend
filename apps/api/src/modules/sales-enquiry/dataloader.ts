import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { SalesEnquiryService } from './service'
import { DataLoaderFactory } from '~/lib/data-loader'

/**
 * SalesEnquiryLoaderService - Batches and caches sales enquiry database queries
 * Prevents N+1 query problems when loading sales enquiries in GraphQL resolvers
 */

@singleton()
@injectable()
export class SalesEnquiryLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(
		private readonly dataLoaderFactory: DataLoaderFactory,
		private readonly salesEnquiryService: SalesEnquiryService,
	) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return this.dataLoaderFactory.create<string, any>(
			'sales_enquiry_by_id',
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const enquiries = await Promise.all(ids.map(id => this.salesEnquiryService.findById(id)))
				return enquiries
			},
			{ ttl: 300, prefix: 'sales_enquiry:id:' }
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
