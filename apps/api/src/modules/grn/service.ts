import { GRNRepository } from './repository'

export class GRNService {
  private repository: GRNRepository
  constructor() { this.repository = new GRNRepository() }

  private async generateGRNNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null })
    return `GRN-${organizationId.toString().slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async createGRN(data: any, userId: string) {
    const grnNumber = await this.generateGRNNumber(data.organizationId)
    return this.repository.create({ ...data, grnNumber, createdBy: userId })
  }

  async getGRNs(organizationId: string, page = 1, limit = 100) {
    const result = await this.repository.findByOrganization(organizationId, page, limit)
    return result.data
  }

  async getGRNById(id: string) { return this.repository.findById(id) }

  async getGRNsByPO(purchaseOrderId: string) { return this.repository.findByPO(purchaseOrderId) }

  async deleteGRN(id: string) { return this.repository.update(id, { deletedAt: new Date() }) }

  // Called automatically when a PO is marked as received
  async createFromPO(po: any, userId: string) {
    return this.createGRN({
      purchaseOrderId: po._id || po.id,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      receivedDate: new Date(),
      lineItems: (po.items || []).map((item: any) => ({
        itemDescription: item.itemDescription,
        orderedQty: item.quantity || 0,
        receivedQty: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
      })),
      notes: `Auto-created from PO ${po.seqNo}`,
      organizationId: po.organizationId,
    }, userId)
  }
}
