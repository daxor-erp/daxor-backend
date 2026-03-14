import { ClientRepository } from './repository'

export class ClientService {
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
