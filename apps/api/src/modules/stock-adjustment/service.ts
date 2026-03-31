import { StockAdjustmentRepository } from './repository'

export class StockAdjustmentService {
  private repository: StockAdjustmentRepository

  constructor() {
    this.repository = new StockAdjustmentRepository()
  }

  private async generateNumber(organizationId: any): Promise<string> {
    const count = await this.repository.count({ organizationId })
    const orgStr = `${organizationId}`
    return `SA-${orgStr.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async create(data: any, userId: string) {
    const adjNumber = await this.generateNumber(data.organizationId)
    return this.repository.create({ ...data, adjNumber, createdBy: userId })
  }

  async getAll(organizationId: string, page = 1, limit = 100) {
    const result = await this.repository.findByOrg(organizationId, page, limit)
    return result.data
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async update(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async confirm(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Stock adjustment not found')
    if (doc.status !== 'draft') throw new Error('Only draft adjustments can be confirmed')
    return this.repository.update(id, { status: 'confirmed', updatedBy: userId })
  }

  async cancel(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Stock adjustment not found')
    if (doc.status === 'cancelled') throw new Error('Already cancelled')
    return this.repository.update(id, { status: 'cancelled', updatedBy: userId })
  }

  async delete(id: string) {
    return this.repository.update(id, { deletedAt: new Date() })
  }
}
