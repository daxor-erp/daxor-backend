import { ItemRepository } from './repository'

export class ItemService {
	private repository: ItemRepository

	constructor() {
		this.repository = new ItemRepository()
	}

	async create(data: any): Promise<any> {
		return this.repository.create(data)
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async update(id: string, data: any): Promise<any> {
		return this.repository.update(id, data)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options
		const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
		return this.repository.findPaginated(filter, page, limit, sort)
	}
}
