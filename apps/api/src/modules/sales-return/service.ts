import { GraphQLValidationError } from '@repo/errors'
import { SalesReturnRepository } from './repository'
import { ISalesReturn } from './model'
import { accountingPosting } from '../../lib/accounting-posting'
import { CustomerInvoiceRepository } from '../customer-invoice/repository'
import { Customer } from '../customer/model'

export class SalesReturnService {
  private repository: SalesReturnRepository

  constructor() {
    this.repository = new SalesReturnRepository()
  }

  private async resolveCustomerName(customerId?: string, fallback?: string): Promise<string | undefined> {
    if (fallback && fallback.trim() && fallback !== '—') {
      return fallback.replace(/\s*\([^)]*\)\s*$/, '').trim()
    }
    if (!customerId) return undefined
    try {
      const c = await Customer.findById(customerId).lean()
      const name = String((c as any)?.name || '').trim()
      return name || undefined
    } catch {
      return undefined
    }
  }

  private normalizeItems(items: ISalesReturn['items'] | undefined) {
    return (items ?? [])
      .filter((i) => i?.itemName?.trim() && Number(i.quantity) > 0)
      .map((i) => {
        const quantity = Number(i.quantity)
        const unitPrice = Number(i.unitPrice ?? 0)
        const amount = Number(i.amount ?? quantity * unitPrice)
        return {
          itemName: i.itemName.trim(),
          quantity,
          unit: i.unit || 'unit',
          unitPrice,
          amount,
          notes: i.notes || undefined,
        }
      })
  }

  async create(data: Partial<ISalesReturn>, userId: string) {
    if (!data.docDate) throw new GraphQLValidationError('Document date is required')
    if (!data.customerId) throw new GraphQLValidationError('Customer is required')
    if (!data.reason?.trim()) throw new GraphQLValidationError('Reason is required')

    const items = this.normalizeItems(data.items)
    if (items.length === 0) {
      throw new GraphQLValidationError('Add at least one return item with quantity')
    }

    const computedTotal = items.reduce((s, i) => s + Number(i.amount || 0), 0)
    const customerName = await this.resolveCustomerName(data.customerId, data.customerName)
    const docNumber = await this.generateDocNumber(data.organizationId!)
    const { status: _s, ...rest } = data as Record<string, unknown>

    return this.repository.create({
      ...rest,
      items,
      customerName,
      totalAmount: Number(data.totalAmount) > 0 ? Number(data.totalAmount) : computedTotal,
      docNumber,
      createdBy: userId,
      status: 'DRAFT',
    } as ISalesReturn)
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async update(id: string, data: Partial<ISalesReturn>) {
    const existing = await this.repository.findById(id)
    if (!existing || existing.isDeleted) throw new GraphQLValidationError('Sales return not found')
    const st = String(existing.status)
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED') {
      throw new GraphQLValidationError('Only draft or declined sales returns can be edited')
    }
    const { status: _ignored, ...rest } = data as Record<string, unknown>
    if (Array.isArray(rest.items)) {
      const items = this.normalizeItems(rest.items as ISalesReturn['items'])
      if (items.length === 0) {
        throw new GraphQLValidationError('Add at least one return item with quantity')
      }
      rest.items = items
      if (!(Number(rest.totalAmount) > 0)) {
        rest.totalAmount = items.reduce((s, i) => s + Number(i.amount || 0), 0)
      }
    }
    if (rest.customerId || rest.customerName) {
      rest.customerName = await this.resolveCustomerName(
        String(rest.customerId ?? existing.customerId ?? ''),
        rest.customerName as string | undefined,
      )
    }
    return this.repository.update(id, rest as Partial<ISalesReturn>)
  }

  async submitForOrgApproval(id: string) {
    const row = await this.repository.findById(id)
    if (!row || row.isDeleted) throw new GraphQLValidationError('Sales return not found')
    const st = String(row.status)
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED') {
      throw new GraphQLValidationError('Only draft or declined sales returns can be sent for approval')
    }
    if (!row.customerId) throw new GraphQLValidationError('Customer is required before submit')
    if (!row.items?.length) throw new GraphQLValidationError('Cannot submit a return without items')
    return this.repository.update(id, { status: 'SUBMITTED' })
  }

  async approveApproval(id: string, decidedByUserId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.isDeleted) throw new GraphQLValidationError('Sales return not found')
    if (String(row.status) !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only submitted sales returns can be approved')
    }
    let totalAmount = Number(row.totalAmount) || 0
    if (totalAmount <= 0 && row.customerInvoiceId) {
      const invRepo = new CustomerInvoiceRepository()
      const inv = await invRepo.findById(String(row.customerInvoiceId))
      if (inv) totalAmount = Number((inv as any).totalAmount) || 0
      if (totalAmount > 0) {
        await this.repository.update(id, { totalAmount } as Partial<ISalesReturn>)
      }
    }
    const updated = await this.repository.update(id, { status: 'APPROVED' })
    const fresh = await this.repository.findById(id)
    await accountingPosting.postSalesReturn(fresh, decidedByUserId ?? 'system')
    return updated
  }

  async declineApproval(id: string, _decidedByUserId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.isDeleted) throw new GraphQLValidationError('Sales return not found')
    if (String(row.status) !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only submitted sales returns can be declined')
    }
    return this.repository.update(id, { status: 'APPROVAL_DECLINED' })
  }

  async delete(id: string) {
    return this.repository.softDelete(id)
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any)
    return `SR-${`${organizationId}`.slice(-4).toUpperCase()}-${String(count + 1).padStart(4, '0')}`
  }
}
