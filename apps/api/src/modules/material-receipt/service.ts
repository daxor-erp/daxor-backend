import { MaterialReceiptRepository } from './repository'

export class MaterialReceiptService {
  private repository: MaterialReceiptRepository

  constructor() {
    this.repository = new MaterialReceiptRepository()
  }

  private async generateMRNNumber(organizationId: any): Promise<string> {
    const count = await this.repository.count({ organizationId })
    const orgStr = `${organizationId}`
    return `MRN-${orgStr.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async create(data: any, userId: string) {
    const mrnNumber = await this.generateMRNNumber(data.organizationId)
    return this.repository.create({ ...data, mrnNumber, createdBy: userId })
  }

  async getAll(organizationId: string, page = 1, limit = 100, status?: string) {
    const result = await this.repository.findByOrganization(organizationId, page, limit, status)
    return result.data
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async getByPO(purchaseOrderId: string) {
    return this.repository.findByPO(purchaseOrderId)
  }

  async update(id: string, data: any, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new Error('Material Receipt not found')
    if (mrn.status !== 'draft') throw new Error('Only draft receipts can be edited')
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async confirm(id: string, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new Error('Material Receipt not found')
    if (mrn.status !== 'draft') throw new Error('Only draft receipts can be confirmed')
    return this.repository.update(id, { status: 'confirmed', updatedBy: userId })
  }

  async cancel(id: string, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new Error('Material Receipt not found')
    if (mrn.status === 'cancelled') throw new Error('Receipt is already cancelled')
    return this.repository.update(id, { status: 'cancelled', updatedBy: userId })
  }

  async delete(id: string) {
    return this.repository.update(id, { deletedAt: new Date() })
  }
}
