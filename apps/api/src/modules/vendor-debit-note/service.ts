import { VendorDebitNoteRepository } from './repository'
import { accountingPosting } from '../../lib/accounting-posting'
import { PurchaseOrderRepository } from '../purchase-order/repository'
import { VendorBillRepository } from '../vendor-bill/repository'
import { VendorBillService } from '../vendor-bill/service'

export class VendorDebitNoteService {
  private repository = new VendorDebitNoteRepository()
  private poRepo = new PurchaseOrderRepository()
  private billRepo = new VendorBillRepository()
  private billService = new VendorBillService()

  private async generateDebitNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null })
    return `VDN-${`${organizationId}`.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async createDebitNote(data: any, userId: string) {
    const organizationId = String(data.organizationId ?? '')
    const totalAmount = Math.round(Number(data.totalAmount) * 100) / 100
    if (totalAmount <= 0) throw new Error('Debit note amount must be positive')

    if (data.purchaseOrderId) {
      const existing = await this.repository.findByPurchaseOrderId(String(data.purchaseOrderId))
      if (existing?.length) {
        throw new Error(
          `Purchase order already has debit note ${existing[0].debitNumber}`,
        )
      }
      const po = await this.poRepo.findById(String(data.purchaseOrderId))
      if (!po) throw new Error('Purchase order not found')
      if (!['received', 'billed', 'approved', 'sent', 'debited'].includes(String(po.status))) {
        throw new Error('PO must be received or billed before issuing a debit note')
      }
      const poTotal = Number(po.totalAmount ?? 0)
      if (poTotal > 0 && totalAmount > poTotal + 0.01) {
        throw new Error('Debit amount cannot exceed PO total')
      }
      if (!data.vendorId) data.vendorId = po.vendorId
    }

    if (data.vendorBillId) {
      const bill = await this.billRepo.findById(String(data.vendorBillId))
      if (!bill || bill.deletedAt) throw new Error('Vendor bill not found')
      if (!data.vendorId) data.vendorId = bill.vendorId
      const out = Number(bill.outstandingAmount ?? bill.totalAmount - bill.paidAmount)
      if (totalAmount > out + 0.01) {
        throw new Error('Debit note amount exceeds bill outstanding balance')
      }
    }

    const debitNumber = await this.generateDebitNumber(organizationId)
    const created = await this.repository.create({
      ...data,
      debitNumber,
      totalAmount,
      appliedAmount: 0,
      remainingAmount: totalAmount,
      status: 'open',
      billAllocations: [],
      createdBy: userId,
      updatedBy: userId,
    })

    await accountingPosting.postVendorDebitNote(created, userId)

    if (data.purchaseOrderId) {
      await this.poRepo.update(String(data.purchaseOrderId), {
        status: 'debited',
        updatedBy: userId,
      } as any)
    }

    if (data.vendorBillId) {
      const allocAmount = Math.min(
        totalAmount,
        Number(
          (await this.billRepo.findById(String(data.vendorBillId)))?.outstandingAmount ?? totalAmount,
        ),
      )
      return this.applyToBill(String(created._id ?? created.id), String(data.vendorBillId), allocAmount, userId)
    }

    return created
  }

  async applyToBill(debitNoteId: string, billId: string, amount: number, userId: string) {
    const dn = await this.repository.findById(debitNoteId)
    if (!dn || dn.deletedAt) throw new Error('Debit note not found')
    const bill = await this.billRepo.findById(billId)
    if (!bill || bill.deletedAt) throw new Error('Vendor bill not found')

    const dnVendor = String(dn.vendorId?._id ?? dn.vendorId ?? '')
    const billVendor = String(bill.vendorId?._id ?? bill.vendorId ?? '')
    if (dnVendor && billVendor && dnVendor !== billVendor) {
      throw new Error('Debit note and bill must belong to the same vendor')
    }

    const remaining = Math.round(
      (Number(dn.remainingAmount ?? dn.totalAmount - (dn.appliedAmount ?? 0))) * 100,
    ) / 100
    const billOutstanding = Math.round(Number(bill.outstandingAmount ?? 0) * 100) / 100
    const requested = Math.round(Number(amount) * 100) / 100
    const apply = Math.min(requested, remaining, billOutstanding)

    if (apply <= 0) throw new Error('Nothing to apply — check debit note remaining and bill outstanding')

    await this.billService.applyDebitNoteAllocation(billId, apply)

    const newApplied = Math.round((Number(dn.appliedAmount ?? 0) + apply) * 100) / 100
    const newRemaining = Math.round((Number(dn.totalAmount) - newApplied) * 100) / 100
    const allocations = [...(dn.billAllocations ?? []), { billId, amount: apply, appliedAt: new Date() }]

    const updated = await this.repository.update(debitNoteId, {
      appliedAmount: newApplied,
      remainingAmount: Math.max(0, newRemaining),
      vendorBillId: dn.vendorBillId ?? billId,
      billAllocations: allocations,
      status: newRemaining <= 0.009 ? 'applied' : 'open',
      updatedBy: userId,
    })

    return updated
  }

  async getDebitNotes(organizationId: string, filter: Record<string, unknown> = {}) {
    return this.repository.findByOrganization(organizationId, filter)
  }

  async getDebitNoteById(id: string) {
    return this.repository.findById(id)
  }

  async updateDebitNote(id: string, data: any, userId: string) {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async deleteDebitNote(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row) throw new Error('Debit note not found')
    if (Number(row.appliedAmount ?? 0) > 0.009) {
      throw new Error('Cannot delete a debit note that has been applied to bills')
    }
    return this.repository.update(id, { deletedAt: new Date(), updatedBy: userId })
  }
}
