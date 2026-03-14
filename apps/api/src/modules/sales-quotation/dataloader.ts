import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { SalesQuotationService } from './service'
import { DataLoaderFactory } from '~/lib/data-loader'

@singleton()
@injectable()
export class SalesQuotationLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(
		private readonly dataLoaderFactory: DataLoaderFactory,
		private readonly salesQuotationService: SalesQuotationService,
	) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return this.dataLoaderFactory.create<string, any>(
			'sales_quotation_by_id',
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const quotations = await Promise.all(ids.map(id => this.salesQuotationService.findById(id)))
				return quotations
			},
			{ ttl: 300, prefix: 'sales_quotation:id:' }
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
