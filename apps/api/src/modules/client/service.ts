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
  private repository: ClientRepository

  constructor() {
    this.repository = new ClientRepository()
  }

  async createClient(data: any, userId: string) {
    return this.repository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async getClientById(id: string) {
    return this.repository.findById(id)
  }

  async getClientsByOrganization(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getClientByEmail(email: string, organizationId: string) {
    return this.repository.findByEmail(email, organizationId)
  }

  async getClientsByStatus(status: string, organizationId: string) {
    return this.repository.findByStatus(status, organizationId)
  }

  async getAllClients() {
    return this.repository.findAll({ deletedAt: null })
  }

  async updateClient(id: string, data: any, userId: string) {
    return this.repository.update(id, {
      ...data,
      updatedBy: userId,
      updatedAt: new Date(),
    })
  }

  async deleteClient(id: string) {
    return this.repository.softDelete(id)
  }
}
