import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

export interface DataLoaderOptions {
	ttl?: number
	prefix?: string
}

@singleton()
@injectable()
export class DataLoaderFactory {
	create<K, V>(
		name: string,
		batchFn: (keys: readonly K[]) => Promise<Array<V | null>>,
		options?: DataLoaderOptions
	): DataLoader<K, V | null> {
		return new DataLoader<K, V | null>(batchFn, {
			cache: true,
			maxBatchSize: 100,
		})
	}
}
