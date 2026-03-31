import { VendorBillRepository } from './repository'

export class VendorBillService {
  private repository: VendorBillRepository

  constructor() {
    this.repository = new VendorBillRepository()
  }

  private async generateBillNumber(organizationId: any): Promise<string> {
    const count = await this.repository.count({ organizationId })
    const seq = (count + 1).toString().padStart(5, '0')
    return `BILL-${`${organizationId}`.slice(-6).toUpperCase()}-${seq}`
  }

  async createBill(data: any, userId: string) {
    const billNumber = await this.generateBillNumber(data.organizationId)
    const outstandingAmount = data.totalAmount
    return this.repository.create({
      ...data,
      billNumber,
      paidAmount: 0,
      outstandingAmount,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async getBillById(id: string) {
    return this.repository.findById(id)
  }

  async getBills(organizationId: string, filter: any = {}, page = 1, limit = 100) {
    return this.repository.findByOrganization(organizationId, filter)
  }

  async getBillsByVendor(vendorId: string) {
    return this.repository.findByVendor(vendorId)
  }

  async getOutstandingBills(organizationId: string) {
    return this.repository.findOutstanding(organizationId)
  }

  async updateBill(id: string, data: any, userId: string) {
    // Recalculate outstanding if totalAmount changes
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error('Vendor bill not found')

    const updates: any = { ...data, updatedBy: userId }
    if (data.totalAmount !== undefined) {
      updates.outstandingAmount = data.totalAmount - existing.paidAmount
    }
    return this.repository.update(id, updates)
  }

  async approveBill(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill) throw new Error('Vendor bill not found')
    if (bill.status !== 'draft') throw new Error('Only draft bills can be approved')
    return this.repository.update(id, { status: 'approved', updatedBy: userId })
  }

  async deleteBill(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill) throw new Error('Vendor bill not found')
    if (bill.status !== 'draft') throw new Error('Only draft bills can be deleted')
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }

  /**
   * Called by VendorPaymentService when a payment is applied to this bill.
   * Updates paidAmount, outstandingAmount, and status accordingly.
   */
  async applyPayment(billId: string, amount: number): Promise<void> {
    const bill = await this.repository.findById(billId)
    if (!bill) throw new Error(`Vendor bill ${billId} not found`)
    if (bill.status === 'paid') throw new Error(`Bill ${bill.billNumber} is already fully paid`)

    const newPaid = bill.paidAmount + amount
    const newOutstanding = bill.totalAmount - newPaid

    if (newPaid > bill.totalAmount) {
      throw new Error(`Payment amount exceeds outstanding balance on bill ${bill.billNumber}`)
    }

    const newStatus = newOutstanding <= 0 ? 'paid' : 'partially_paid'
    await this.repository.update(billId, {
      paidAmount: newPaid,
      outstandingAmount: Math.max(0, newOutstanding),
      status: newStatus,
    })
  }
}
