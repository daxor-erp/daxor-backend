import { VendorRepository } from './repository'

export class VendorService {
	private repository: VendorRepository

	constructor() {
		this.repository = new VendorRepository()
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
		return this.repository.findWithPagination(filter, options)
	}
}
