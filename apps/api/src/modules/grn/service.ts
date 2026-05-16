import { GraphQLValidationError } from '@repo/errors'
import { GRNRepository } from './repository'

const GRN_STATUSES = new Set(['draft', 'submitted', 'approval_declined', 'confirmed'])

function parseDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }
  if (value != null && String(value).trim() !== '') {
    const d = new Date(String(value))
    if (!Number.isNaN(d.getTime())) return d
  }
  return fallback
}

export class GRNService {
  private repository: GRNRepository
  constructor() {
    this.repository = new GRNRepository()
  }

  private async generateGRNNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null } as any)
    const suffix = `${organizationId}`.replace(/\s/g, '').slice(-6).toUpperCase()
    return `GRN-${suffix}-${String(count + 1).padStart(5, '0')}`
  }

  async createGRN(data: Record<string, unknown>, userId: string) {
    const organizationId =
      data.organizationId != null ? String(data.organizationId).trim() : ''
    if (!organizationId) {
      throw new Error('organizationId is required')
    }

    const lineItems = Array.isArray(data.lineItems) ? data.lineItems : []
    if (lineItems.length === 0) {
      throw new Error('At least one line item is required')
    }

    const receivedDate = parseDate(data.receivedDate, new Date())
    if (Number.isNaN(receivedDate.getTime())) {
      throw new Error('Invalid received date')
    }

    const mappedLines = lineItems.map((raw: Record<string, unknown>) => {
      const itemDescription = String(raw.itemDescription ?? '').trim() || 'Item'
      const orderedQty = parseFloat(String(raw.orderedQty ?? 0)) || 0
      const receivedQty = parseFloat(String(raw.receivedQty ?? 0)) || 0
      const upRaw = raw.unitPrice
      const unitPrice =
        upRaw == null || upRaw === ''
          ? 0
          : (() => {
              const n = typeof upRaw === 'number' ? upRaw : parseFloat(String(upRaw))
              return Number.isFinite(n) ? n : 0
            })()
      return { itemDescription, orderedQty, receivedQty, unitPrice }
    })

    if (!mappedLines.some((l) => l.receivedQty > 0)) {
      throw new Error('At least one line must have received quantity greater than zero')
    }

    const statusRaw =
      data.status != null && String(data.status).trim() !== ''
        ? String(data.status).trim().toLowerCase()
        : 'draft'
    if (!GRN_STATUSES.has(statusRaw)) {
      throw new Error('Invalid GRN status')
    }

    const grnNumber = await this.generateGRNNumber(organizationId)

    const payload: Record<string, unknown> = {
      grnNumber,
      receivedDate,
      lineItems: mappedLines,
      organizationId,
      status: statusRaw,
    }

    const notes = data.notes != null ? String(data.notes).trim() : ''
    if (notes) payload.notes = notes

    const poId = data.purchaseOrderId != null ? String(data.purchaseOrderId).trim() : ''
    if (poId) payload.purchaseOrderId = poId

    const vId = data.vendorId != null ? String(data.vendorId).trim() : ''
    if (vId) payload.vendorId = vId

    const vName = data.vendorName != null ? String(data.vendorName).trim() : ''
    if (vName) payload.vendorName = vName

    if (userId && /^[a-fA-F0-9]{24}$/.test(userId)) {
      payload.createdBy = userId
    }

    const created = await this.repository.create(payload as any)
    if (!created) {
      throw new Error('Failed to create GRN')
    }
    return created
  }

  async updateGRN(id: string, input: Record<string, unknown>) {
    const existing = await this.repository.findById(id)
    if (!existing || (existing as any).deletedAt) throw new GraphQLValidationError('GRN not found')
    const cur = String((existing as any).status ?? '')
    if (cur === 'submitted') {
      throw new GraphQLValidationError('GRN is pending approval and cannot be edited')
    }

    const payload: Record<string, unknown> = {}

    if (input.status != null && String(input.status).trim() !== '') {
      const s = String(input.status).trim().toLowerCase()
      if (s === 'confirmed' || s === 'submitted') {
        throw new GraphQLValidationError('Use the approval workflow to submit or confirm this GRN')
      }
      if (!GRN_STATUSES.has(s)) {
        throw new Error('Invalid GRN status')
      }
      payload.status = s
    }

    if (input.notes !== undefined) {
      const n = input.notes == null ? '' : String(input.notes).trim()
      payload.notes = n === '' ? undefined : n
    }

    if (input.receivedDate != null && String(input.receivedDate).trim() !== '') {
      const d = new Date(String(input.receivedDate))
      if (Number.isNaN(d.getTime())) {
        throw new Error('Invalid received date')
      }
      payload.receivedDate = d
    }

    if (Object.keys(payload).length === 0) {
      throw new Error('No fields to update')
    }

    const updated = await this.repository.update(id, payload as any)
    if (!updated) {
      throw new Error('GRN not found')
    }
    return updated
  }

  async submitForOrgApproval(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || (row as any).deletedAt) throw new GraphQLValidationError('GRN not found')
    const st = String((row as any).status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined GRNs can be sent for approval')
    }
    const payload: Record<string, unknown> = { status: 'submitted' }
    if (userId && /^[a-fA-F0-9]{24}$/.test(userId)) {
      payload.updatedBy = userId
    }
    const updated = await this.repository.update(id, payload as any)
    if (!updated) throw new GraphQLValidationError('GRN not found')
    return updated
  }

  async approveFromApprovalQueue(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || (row as any).deletedAt) throw new GraphQLValidationError('GRN not found')
    if (String((row as any).status) !== 'submitted') {
      throw new GraphQLValidationError('Only GRNs pending approval can be approved')
    }
    const payload: Record<string, unknown> = { status: 'confirmed' }
    if (userId && /^[a-fA-F0-9]{24}$/.test(userId)) {
      payload.updatedBy = userId
    }
    const updated = await this.repository.update(id, payload as any)
    if (!updated) throw new GraphQLValidationError('GRN not found')
    return updated
  }

  async declineFromApprovalQueue(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || (row as any).deletedAt) throw new GraphQLValidationError('GRN not found')
    if (String((row as any).status) !== 'submitted') {
      throw new GraphQLValidationError('Only GRNs pending approval can be declined')
    }
    const payload: Record<string, unknown> = { status: 'approval_declined' }
    if (userId && /^[a-fA-F0-9]{24}$/.test(userId)) {
      payload.updatedBy = userId
    }
    const updated = await this.repository.update(id, payload as any)
    if (!updated) throw new GraphQLValidationError('GRN not found')
    return updated
  }

  async getGRNs(organizationId: string, page = 1, limit = 100) {
    const result = await this.repository.findByOrganization(organizationId, page, limit)
    return result.data
  }

  async getGRNById(id: string) {
    return this.repository.findById(id)
  }

  async getGRNsByPO(purchaseOrderId: string) {
    return this.repository.findByPO(purchaseOrderId)
  }

  async deleteGRN(id: string) {
    const updated = await this.repository.update(id, { deletedAt: new Date() } as any)
    if (!updated) {
      throw new Error('GRN not found')
    }
  }

  /** Called when a PO is marked as received */
  async createFromPO(po: Record<string, unknown>, userId: string) {
    const orgId = po.organizationId != null ? String(po.organizationId) : ''
    const poId = po._id != null ? String(po._id) : po.id != null ? String(po.id) : ''
    return this.createGRN(
      {
        purchaseOrderId: poId || undefined,
        vendorId: po.vendorId != null ? String(po.vendorId) : undefined,
        vendorName: po.vendorName != null ? String(po.vendorName) : undefined,
        receivedDate: new Date().toISOString(),
        lineItems: (Array.isArray(po.items) ? po.items : []).map((item: Record<string, unknown>) => ({
          itemDescription: item.itemDescription,
          orderedQty: item.quantity ?? 0,
          receivedQty: item.quantity ?? 0,
          unitPrice: item.unitPrice ?? 0,
        })),
        notes: `Auto-created from PO ${po.seqNo != null ? String(po.seqNo) : ''}`.trim(),
        organizationId: orgId,
        status: 'confirmed',
      },
      userId,
    )
  }
}
