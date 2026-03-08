import { ObjectId } from 'mongodb'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { UserService } from './service'

@singleton()
@injectable()
export class UserLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(private readonly userService: UserService) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return new DataLoader<string, any | null>(
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const users = await Promise.all(
					ids.map(id => this.userService.findById(id))
				)
				return users
			}
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
