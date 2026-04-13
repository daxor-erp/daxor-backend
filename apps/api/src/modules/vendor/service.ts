import { userIdForRef } from '~/lib/user-ref'
import { VendorRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'

export class VendorService {
  private repository: VendorRepository

  constructor() {
    this.repository = new VendorRepository()
  }

  async createVendor(data: any, userId: string) {
    const { createdBy: _c, updatedBy: _u, ...rest } = data
    const seq = await getNextSequence({ type: 'Vendor', organizationId: rest.organizationId })
    const seqNo = formatEntitySequence('V', rest.organizationId.toString(), seq)
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = { ...rest, seqNo }
    if (uid) {
      payload.createdBy = uid
      payload.updatedBy = uid
    }
    return this.repository.create(payload)
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
    const { createdBy: _c, updatedBy: _u, ...rest } = data
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = { ...rest }
    if (uid) payload.updatedBy = uid
    return this.repository.update(id, payload)
  }

  async deleteVendor(id: string, userId: string) {
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = { deletedAt: new Date() }
    if (uid) payload.deletedBy = uid
    return this.repository.update(id, payload)
  }
}
