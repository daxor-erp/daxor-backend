import { VendorCreditRepository } from './repository'

export class VendorCreditService {
  private repository: VendorCreditRepository
  constructor() { this.repository = new VendorCreditRepository() }

  private async generateCreditNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null })
    return `VC-${`${organizationId}`.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async createCredit(data: any, userId: string) {
    const creditNumber = await this.generateCreditNumber(data.organizationId)
    return this.repository.create({
      ...data,
      creditNumber,
      appliedAmount: 0,
      remainingAmount: data.totalAmount,
      createdBy: userId,
      updatedBy: userId,
    })
  }
  async getCredits(organizationId: string, filter: any = {}) {
    return this.repository.findByOrganization(organizationId, filter)
  }

  async getAvailableCredits(organizationId: string, vendorId: string) {
    return this.repository.findAvailable(organizationId, vendorId)
  }

  async getCreditById(id: string) { return this.repository.findById(id) }

  async updateCredit(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async deleteCredit(id: string, userId: string) {
    const credit = await this.repository.findById(id)
    if (!credit) throw new Error('Vendor credit not found')
    if (credit.appliedAmount > 0) throw new Error('Cannot delete a credit that has been partially applied')
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }
}
