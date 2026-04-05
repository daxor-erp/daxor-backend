import { CustomerRepository } from './repository'
import { getNextSequence } from '../counter'

export class CustomerService {
  private repository: CustomerRepository

  constructor() {
    this.repository = new CustomerRepository()
  }

  async createCustomer(data: any, userId: string) {
    try {
      const seq = await getNextSequence({ type: 'Customer', organizationId: data.organizationId })
      const orgSlug = data.organizationId.toString().slice(-4).toUpperCase()
      const docNumber = `CUST-${orgSlug}-${String(seq).padStart(5, '0')}`
      const doc = await this.repository.create({
        ...data,
        docNumber,
        createdBy: userId,
        updatedBy: userId,
      })
      return doc
    } catch (error) {
      console.error('[CustomerService.createCustomer] error:', error)
      throw error
    }
  }

  async getCustomerById(id: string) {
    return this.repository.findById(id)
  }

  async getAllCustomers(filter: any = {}, page = 1, limit = 100) {
    const result = await this.repository.findPaginated(
      { ...filter, deletedAt: null },
      page,
      limit,
      { createdAt: -1 }
    )
    return result.data
  }

  async updateCustomer(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async deleteCustomer(id: string, userId: string) {
    return this.repository.update(id, { deletedAt: new Date(), updatedBy: userId })
  }
}
