import { ClientRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'

export class ClientService {
  private repository: ClientRepository

  constructor() {
    this.repository = new ClientRepository()
  }

  async createClient(data: any, userId: string) {
    const seq = await getNextSequence({ type: 'Client', organizationId: data.organizationId })
    const seqNo = formatEntitySequence('C', data.organizationId.toString(), seq)
    return this.repository.create({ ...data, seqNo, createdBy: userId, updatedBy: userId })
  }

  async getClientById(id: string) {
    return this.repository.findById(id)
  }

  async getAllClients(filter: any = {}, page = 1, limit = 100) {
    const result = await this.repository.findPaginated(
      { ...filter, deletedAt: null },
      page,
      limit,
      { createdAt: -1 }
    )
    return result.data
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

  async updateClient(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId, updatedAt: new Date() })
  }

  async deleteClient(id: string) {
    return this.repository.softDelete(id)
  }
}
