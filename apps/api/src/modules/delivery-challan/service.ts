import { GraphQLValidationError } from '@repo/errors'
import { DeliveryChallanRepository } from './repository'
import { IDeliveryChallan } from './model'
import { Customer } from '../customer/model'

export class DeliveryChallanService {
  private repository: DeliveryChallanRepository

  constructor() {
    this.repository = new DeliveryChallanRepository()
  }

  private async resolveCustomerName(customerId?: string, fallback?: string): Promise<string | undefined> {
    if (fallback && fallback.trim() && fallback !== '—') {
      return fallback.replace(/\s*\([^)]*\)\s*$/, '').trim()
    }
    if (!customerId) return undefined
    try {
      const c = await Customer.findById(customerId).lean()
      if (!c) return undefined
      const name = String((c as any).name || '').trim()
      return name || undefined
    } catch {
      return undefined
    }
  }

  async create(data: Partial<IDeliveryChallan>, userId: string) {
    const items = (data.items ?? []).filter((i) => i?.itemName?.trim() && Number(i.quantity) > 0)
    if (items.length === 0) {
      throw new GraphQLValidationError('Add at least one item with quantity')
    }
    if (!data.docDate) {
      throw new GraphQLValidationError('Document date is required')
    }

    const customerName = await this.resolveCustomerName(data.customerId, data.customerName)
    const docNumber = await this.generateDocNumber(data.organizationId!)
    const { status: _s, ...rest } = data as Record<string, unknown>
    return this.repository.create({
      ...rest,
      items,
      customerName,
      docNumber,
      createdBy: userId,
      status: 'DRAFT',
    } as IDeliveryChallan)
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async update(id: string, data: Partial<IDeliveryChallan>) {
    const existing = await this.repository.findById(id)
    if (!existing || existing.isDeleted) throw new GraphQLValidationError('Delivery challan not found')
    const st = String(existing.status)
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED') {
      throw new GraphQLValidationError('Only draft or declined delivery challans can be edited')
    }
    const { status: _ignored, ...rest } = data as Record<string, unknown>
    if (Array.isArray(rest.items)) {
      const items = (rest.items as IDeliveryChallan['items']).filter(
        (i) => i?.itemName?.trim() && Number(i.quantity) > 0,
      )
      if (items.length === 0) {
        throw new GraphQLValidationError('Add at least one item with quantity')
      }
      rest.items = items
    }
    return this.repository.update(id, rest as Partial<IDeliveryChallan>)
  }

  async submitForOrgApproval(id: string) {
    const row = await this.repository.findById(id)
    if (!row || row.isDeleted) throw new GraphQLValidationError('Delivery challan not found')
    const st = String(row.status)
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED') {
      throw new GraphQLValidationError('Only draft or declined delivery challans can be sent for approval')
    }
    if (!row.items?.length) {
      throw new GraphQLValidationError('Cannot submit a challan without items')
    }
    return this.repository.update(id, { status: 'SUBMITTED' })
  }

  async approveApproval(id: string, _decidedByUserId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.isDeleted) throw new GraphQLValidationError('Delivery challan not found')
    if (String(row.status) !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only submitted delivery challans can be approved')
    }
    return this.repository.update(id, { status: 'APPROVED' })
  }

  async declineApproval(id: string, _decidedByUserId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.isDeleted) throw new GraphQLValidationError('Delivery challan not found')
    if (String(row.status) !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only submitted delivery challans can be declined')
    }
    return this.repository.update(id, { status: 'APPROVAL_DECLINED' })
  }

  async delete(id: string) {
    return this.repository.softDelete(id)
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any)
    return `DC-${`${organizationId}`.slice(-4).toUpperCase()}-${String(count + 1).padStart(4, '0')}`
  }
}
