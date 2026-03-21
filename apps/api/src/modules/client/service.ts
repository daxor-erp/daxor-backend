import { ClientRepository } from './repository'

export class ClientService {
	private repository: ClientRepository

	constructor() {
		this.repository = new ClientRepository()
	}

	async create(data: any, userId: string): Promise<any> {
		return this.repository.create({ ...data, createdBy: userId })
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async update(id: string, data: any): Promise<any> {
		return this.repository.update(id, { ...data, updatedAt: new Date() })
	}

	async softDelete(id: string, userId: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}

	async findPaginated(filter: any, page: number, limit: number, sort: any): Promise<any> {
		return this.repository.findPaginated(filter, page, limit, sort)
	}
}
