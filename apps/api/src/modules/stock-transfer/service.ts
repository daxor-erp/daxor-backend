import { StockTransferRepository } from './repository'

function isObjectIdHex(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id)
}

export class StockTransferService {
  private repository: StockTransferRepository

  constructor() {
    this.repository = new StockTransferRepository()
  }

  private async generateNumber(organizationId: any): Promise<string> {
    const count = await this.repository.count({
      organizationId,
      deletedAt: null,
    } as any)
    const orgStr = `${organizationId}`
    return `ST-${orgStr.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async create(data: any, userId: string) {
    const payload = { ...data }
    if (
      payload.fromWarehouseId === '' ||
      payload.fromWarehouseId == null ||
      payload.fromWarehouseId === undefined
    ) {
      delete payload.fromWarehouseId
    }
    if (
      payload.toWarehouseId === '' ||
      payload.toWarehouseId == null ||
      payload.toWarehouseId === undefined
    ) {
      delete payload.toWarehouseId
    }
    if (payload.fromWarehouseName === '') delete payload.fromWarehouseName
    if (payload.toWarehouseName === '') delete payload.toWarehouseName

    const transferNumber = await this.generateNumber(payload.organizationId)
    const doc: Record<string, unknown> = {
      ...payload,
      transferNumber,
    }
    if (isObjectIdHex(userId)) {
      doc.createdBy = userId
    }
    return this.repository.create(doc as any)
  }

  async getAll(organizationId: string, page = 1, limit = 100) {
    const result = await this.repository.findByOrg(organizationId, page, limit)
    return result.data
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async update(id: string, data: any, userId: string) {
    const payload = { ...data }
    if (
      payload.fromWarehouseId === '' ||
      payload.fromWarehouseId == null ||
      payload.fromWarehouseId === undefined
    ) {
      delete payload.fromWarehouseId
    }
    if (
      payload.toWarehouseId === '' ||
      payload.toWarehouseId == null ||
      payload.toWarehouseId === undefined
    ) {
      delete payload.toWarehouseId
    }
    if (payload.fromWarehouseName === '') delete payload.fromWarehouseName
    if (payload.toWarehouseName === '') delete payload.toWarehouseName

    const updatePayload: Record<string, unknown> = { ...payload }
    if (isObjectIdHex(userId)) {
      updatePayload.updatedBy = userId
    }
    const updated = await this.repository.update(id, updatePayload as any)
    if (!updated) throw new Error('Stock transfer not found')
    return updated
  }

  async confirm(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Stock transfer not found')
    if (doc.status !== 'draft') throw new Error('Only draft transfers can be confirmed')
    const patch: Record<string, unknown> = { status: 'confirmed' }
    if (isObjectIdHex(userId)) patch.updatedBy = userId
    const updated = await this.repository.update(id, patch as any)
    if (!updated) throw new Error('Stock transfer not found')
    return updated
  }

  async cancel(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Stock transfer not found')
    if (doc.status === 'cancelled') throw new Error('Already cancelled')
    const patch: Record<string, unknown> = { status: 'cancelled' }
    if (isObjectIdHex(userId)) patch.updatedBy = userId
    const updated = await this.repository.update(id, patch as any)
    if (!updated) throw new Error('Stock transfer not found')
    return updated
  }

  async delete(id: string) {
    const updated = await this.repository.update(id, { deletedAt: new Date() } as any)
    if (!updated) throw new Error('Stock transfer not found')
  }
}
