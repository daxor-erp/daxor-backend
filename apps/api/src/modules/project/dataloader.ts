import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'
import { ProjectService } from './service'
import { DataLoaderFactory } from '~/lib/data-loader'

/**
 * ProjectLoaderService - Batches and caches project database queries
 * Prevents N+1 query problems when loading projects in GraphQL resolvers
 */

@singleton()
@injectable()
export class ProjectLoaderService {
	private byIdLoader: DataLoader<string, any | null>

	constructor(
		private readonly dataLoaderFactory: DataLoaderFactory,
		private readonly projectService: ProjectService,
	) {
		this.byIdLoader = this.createIdLoader()
	}

	private createIdLoader() {
		return this.dataLoaderFactory.create<string, any>(
			'project_by_id',
			async (ids: readonly string[]): Promise<Array<any | null>> => {
				const projects = await Promise.all(ids.map(id => this.projectService.findById(id)))
				return projects
			},
			{ ttl: 300, prefix: 'project:id:' }
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
