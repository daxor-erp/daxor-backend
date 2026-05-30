import { VendorPaymentRepository } from './repository'
import { VendorBillService } from '../vendor-bill/service'
import { accountingPosting } from '../../lib/accounting-posting'

export class VendorPaymentService {
  private repository: VendorPaymentRepository
  private billService: VendorBillService

  constructor() {
    this.repository = new VendorPaymentRepository()
    this.billService = new VendorBillService()
  }

  private async generatePaymentNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null })
    const seq = (count + 1).toString().padStart(5, '0')
    return `PAY-${`${organizationId}`.slice(-6).toUpperCase()}-${seq}`
  }

  async createPayment(data: any, userId: string) {
    const { allocations, totalAmount } = data

    // Validate allocations sum matches totalAmount
    const allocTotal = allocations.reduce((sum: number, a: any) => sum + a.amount, 0)
    if (Math.abs(allocTotal - totalAmount) > 0.01) {
      throw new Error(`Allocation total (${allocTotal}) must equal payment total (${totalAmount})`)
    }

    const paymentNumber = await this.generatePaymentNumber(data.organizationId)

    const payment = await this.repository.create({
      ...data,
      paymentNumber,
      status: 'confirmed',
      createdBy: userId,
      updatedBy: userId,
    })

    // Apply each allocation to the corresponding bill
    for (const alloc of allocations) {
      await this.billService.applyPayment(alloc.billId, alloc.amount)
    }

    await accountingPosting.postVendorPayment(payment, userId)

    return payment
  }

  async getPaymentById(id: string) {
    return this.repository.findById(id)
  }

  async getPayments(organizationId: string, filter: any = {}, page = 1, limit = 100) {
    const result = await this.repository.findPaginated(
      { organizationId, deletedAt: null, ...filter },
      page,
      limit,
      { paymentDate: -1 }
    )
    return result.data
  }

  async getPaymentsByVendor(vendorId: string) {
    return this.repository.findByVendor(vendorId)
  }

  async updatePayment(id: string, data: any, userId: string) {
    const payment = await this.repository.findById(id)
    if (!payment) throw new Error('Vendor payment not found')
    if (payment.status === 'confirmed') {
      throw new Error('Confirmed payments cannot be edited. Cancel and re-create instead.')
    }
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async deletePayment(id: string, userId: string) {
    const payment = await this.repository.findById(id)
    if (!payment) throw new Error('Vendor payment not found')
    if (payment.status === 'confirmed') {
      throw new Error('Cannot delete a confirmed payment. Please contact your administrator.')
    }
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }
}
