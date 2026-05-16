import { GraphQLValidationError } from '@repo/errors'
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
    if (!existing || existing.deletedAt) throw new GraphQLValidationError('Vendor bill not found')
    const st = String(existing.status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined bills can be edited')
    }

    const updates: any = { ...data, updatedBy: userId }
    if (data.totalAmount !== undefined) {
      updates.outstandingAmount = data.totalAmount - existing.paidAmount
    }
    return this.repository.update(id, updates)
  }

  async approveBill(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill || bill.deletedAt) throw new GraphQLValidationError('Vendor bill not found')
    if (bill.status !== 'draft') {
      throw new GraphQLValidationError('Only draft bills can be approved directly (use approval queue when submitted)')
    }
    return this.repository.update(id, { status: 'approved', updatedBy: userId })
  }

  async submitForApproval(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill || bill.deletedAt) throw new GraphQLValidationError('Vendor bill not found')
    const st = String(bill.status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined bills can be sent for approval')
    }
    return this.repository.update(id, { status: 'submitted', updatedBy: userId })
  }

  async approveFromApprovalQueue(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill || bill.deletedAt) throw new GraphQLValidationError('Vendor bill not found')
    if (String(bill.status) !== 'submitted') {
      throw new GraphQLValidationError('Only bills pending approval can be approved')
    }
    return this.repository.update(id, { status: 'approved', updatedBy: userId })
  }

  async declineFromApprovalQueue(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill || bill.deletedAt) throw new GraphQLValidationError('Vendor bill not found')
    if (String(bill.status) !== 'submitted') {
      throw new GraphQLValidationError('Only bills pending approval can be declined')
    }
    return this.repository.update(id, { status: 'approval_declined', updatedBy: userId })
  }

  async deleteBill(id: string, userId: string) {
    const bill = await this.repository.findById(id)
    if (!bill) throw new GraphQLValidationError('Vendor bill not found')
    const st = String(bill.status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined bills can be deleted')
    }
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }

  /**
   * Called by VendorPaymentService when a payment is applied to this bill.
   * Updates paidAmount, outstandingAmount, and status accordingly.
   */
  async applyPayment(billId: string, amount: number): Promise<void> {
    const bill = await this.repository.findById(billId)
    if (!bill) throw new Error(`Vendor bill ${billId} not found`)
    if (!['approved', 'partially_paid'].includes(String(bill.status))) {
      throw new Error(`Bill ${bill.billNumber} must be approved before applying payments`)
    }

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
