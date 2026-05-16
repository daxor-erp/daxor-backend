import { GraphQLValidationError } from '@repo/errors'
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
    if (!mrn) throw new GraphQLValidationError('Material Receipt not found')
    const st = String((mrn as any).status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined receipts can be edited')
    }
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async confirm(id: string, userId: string) {
    void userId
    void id
    throw new GraphQLValidationError(
      'Direct confirm is disabled. Save as draft, then use Send for approval; the approver confirms the receipt.',
    )
  }

  async cancel(id: string, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new GraphQLValidationError('Material Receipt not found')
    const st = String((mrn as any).status)
    if (st === 'submitted') throw new GraphQLValidationError('Cannot cancel while pending approval')
    if (st === 'cancelled') throw new GraphQLValidationError('Receipt is already cancelled')
    return this.repository.update(id, { status: 'cancelled', updatedBy: userId })
  }

  async submitForOrgApproval(id: string, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new GraphQLValidationError('Material Receipt not found')
    const st = String((mrn as any).status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined receipts can be sent for approval')
    }
    return this.repository.update(id, { status: 'submitted', updatedBy: userId })
  }

  async approveFromApprovalQueue(id: string, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new GraphQLValidationError('Material Receipt not found')
    if (String((mrn as any).status) !== 'submitted') {
      throw new GraphQLValidationError('Only receipts pending approval can be approved')
    }
    return this.repository.update(id, { status: 'confirmed', updatedBy: userId })
  }

  async declineFromApprovalQueue(id: string, userId: string) {
    const mrn = await this.repository.findById(id)
    if (!mrn) throw new GraphQLValidationError('Material Receipt not found')
    if (String((mrn as any).status) !== 'submitted') {
      throw new GraphQLValidationError('Only receipts pending approval can be declined')
    }
    return this.repository.update(id, { status: 'approval_declined', updatedBy: userId })
  }

  async delete(id: string) {
    return this.repository.update(id, { deletedAt: new Date() })
  }
}
