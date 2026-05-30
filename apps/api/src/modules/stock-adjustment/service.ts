import { StockAdjustmentRepository } from './repository'
import { accountingPosting } from '../../lib/accounting-posting'
import { InventoryControlService } from '../inventory-control/service'

const inventoryService = new InventoryControlService()

export class StockAdjustmentService {
  private repository: StockAdjustmentRepository

  constructor() {
    this.repository = new StockAdjustmentRepository()
  }

  private async generateNumber(organizationId: any): Promise<string> {
    const count = await this.repository.count({
      organizationId,
      deletedAt: null,
    } as any)
    const orgStr = `${organizationId}`
    return `SA-${orgStr.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async create(data: any, userId: string) {
    const payload = { ...data }
    if (
      payload.warehouseId === '' ||
      payload.warehouseId == null ||
      payload.warehouseId === undefined
    ) {
      delete payload.warehouseId
    }
    if (payload.warehouseName === '') delete payload.warehouseName

    const adjNumber = await this.generateNumber(payload.organizationId)
    return this.repository.create({
      ...payload,
      adjNumber,
      createdBy: userId,
    })
  }

  async getAll(organizationId: string, page = 1, limit = 100) {
    const result = await this.repository.findByOrg(organizationId, page, limit)
    return result.data
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async update(id: string, data: any, userId: string) {
    const updated = await this.repository.update(id, { ...data, updatedBy: userId })
    if (!updated) throw new Error('Stock adjustment not found')
    return updated
  }

  async confirm(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Stock adjustment not found')
    if (doc.status !== 'draft') throw new Error('Only draft adjustments can be confirmed')
    const updated = await this.repository.update(id, {
      status: 'confirmed',
      updatedBy: userId,
    })
    if (!updated) throw new Error('Stock adjustment not found')
    const fresh = await this.repository.findById(id)
    if (fresh) {
      await inventoryService.applyStockAdjustmentLines(fresh, userId)
      await accountingPosting.postStockAdjustment(fresh, userId)
    }
    return updated
  }

  async cancel(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Stock adjustment not found')
    if (doc.status === 'cancelled') throw new Error('Already cancelled')
    const updated = await this.repository.update(id, {
      status: 'cancelled',
      updatedBy: userId,
    })
    if (!updated) throw new Error('Stock adjustment not found')
    return updated
  }

  async delete(id: string) {
    return this.repository.update(id, { deletedAt: new Date() })
  }
}
