import { VendorRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'

export class VendorService {
  private repository: VendorRepository

  constructor() {
    this.repository = new VendorRepository()
  }

  async createVendor(data: any, userId: string) {
    const seq = await getNextSequence({ type: 'Vendor', organizationId: data.organizationId })
    const seqNo = formatEntitySequence('V', data.organizationId.toString(), seq)
    return this.repository.create({ ...data, seqNo, createdBy: userId, updatedBy: userId })
  }

  async getVendorById(id: string) {
    return this.repository.findById(id)
  }

  async getAllVendors(filter: any = {}, page = 1, limit = 100) {
    const result = await this.repository.findPaginated(
      { ...filter, deletedAt: null },
      page,
      limit,
      { createdAt: -1 }
    )
    return result.data
  }

  async updateVendor(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async deleteVendor(id: string, userId: string) {
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }
}
