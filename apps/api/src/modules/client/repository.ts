import { MongoBaseRepository } from '../base/mongo-repository'
import { Client } from './model'

export class ClientRepository extends MongoBaseRepository<any> {
	constructor() {
		super(Client)
	}

	async findByEmail(email: string): Promise<any | null> {
		return this.findOne({ email, deletedAt: null })
	}

	async findByOrganization(organizationId: string): Promise<any[]> {
		return this.findAllActive({ organizationId })
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.findAllActive({ status })
	}
}
