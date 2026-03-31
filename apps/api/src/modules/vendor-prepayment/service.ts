import { VendorPrepaymentRepository } from './repository'

export class VendorPrepaymentService {
  private repository: VendorPrepaymentRepository
  constructor() { this.repository = new VendorPrepaymentRepository() }

  private async generateNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null })
    return `PP-${`${organizationId}`.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async createPrepayment(data: any, userId: string) {
    const prepaymentNumber = await this.generateNumber(data.organizationId)
    return this.repository.create({
      ...data,
      prepaymentNumber,
      appliedAmount: 0,
      remainingAmount: data.amount,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async getPrepayments(organizationId: string, filter: any = {}) {
    return this.repository.findByOrganization(organizationId, filter)
  }

  async getAvailablePrepayments(organizationId: string, vendorId: string) {
    return this.repository.findAvailable(organizationId, vendorId)
  }

  async getPrepaymentById(id: string) { return this.repository.findById(id) }

  async updatePrepayment(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async deletePrepayment(id: string, userId: string) {
    const pp = await this.repository.findById(id)
    if (!pp) throw new Error('Prepayment not found')
    if (pp.appliedAmount > 0) throw new Error('Cannot delete a prepayment that has been partially applied')
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }
}
