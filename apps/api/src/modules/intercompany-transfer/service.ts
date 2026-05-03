import { IntercompanyTransferRepository } from './repository'

function isObjectIdHex(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id)
}

export class IntercompanyTransferService {
  private repository: IntercompanyTransferRepository

  constructor() {
    this.repository = new IntercompanyTransferRepository()
  }

  private async generateNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({
      organizationId,
      deletedAt: null,
    } as any)
    const orgStr = `${organizationId}`.replace(/\s/g, '')
    return `ICT-${orgStr.slice(-6).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
  }

  async create(data: Record<string, unknown>, userId: string) {
    const fromId = data.fromOrganizationId != null ? String(data.fromOrganizationId).trim() : ''
    const toId = data.toOrganizationId != null ? String(data.toOrganizationId).trim() : ''
    if (!fromId || !toId) {
      throw new Error('From and to organization are required')
    }
    if (fromId === toId) {
      throw new Error('From and to organization must differ')
    }
    const orgId = data.organizationId != null ? String(data.organizationId).trim() : ''
    if (!orgId) {
      throw new Error('organizationId is required')
    }
    const lineItems = Array.isArray(data.lineItems) ? data.lineItems : []
    if (lineItems.length === 0) {
      throw new Error('At least one line item is required')
    }
    const mappedLines = lineItems.map((raw: Record<string, unknown>) => {
      const desc = String(raw.itemDescription ?? '').trim() || 'Item'
      const qty =
        typeof raw.qty === 'number' ? raw.qty : parseFloat(String(raw.qty ?? 0)) || 0
      const unit =
        raw.unit != null && String(raw.unit).trim() !== '' ? String(raw.unit).trim() : undefined
      return { itemDescription: desc, qty, ...(unit ? { unit } : {}) }
    })
    if (!mappedLines.some((l: { qty: number }) => l.qty > 0)) {
      throw new Error('At least one line must have quantity greater than zero')
    }
    let transferDate = new Date()
    if (data.transferDate != null && String(data.transferDate).trim() !== '') {
      const d = new Date(String(data.transferDate))
      if (!Number.isNaN(d.getTime())) transferDate = d
    }
    const transferNumber = await this.generateNumber(orgId)
    const payload: Record<string, unknown> = {
      transferNumber,
      transferDate,
      fromOrganizationId: fromId,
      toOrganizationId: toId,
      lineItems: mappedLines,
      organizationId: orgId,
      status: 'draft',
    }
    const fn = data.fromOrganizationName != null ? String(data.fromOrganizationName).trim() : ''
    if (fn) payload.fromOrganizationName = fn
    const tn = data.toOrganizationName != null ? String(data.toOrganizationName).trim() : ''
    if (tn) payload.toOrganizationName = tn
    const notes = data.notes != null ? String(data.notes).trim() : ''
    if (notes) payload.notes = notes
    if (isObjectIdHex(userId)) {
      payload.createdBy = userId
    }
    const created = await this.repository.create(payload as any)
    if (!created) throw new Error('Failed to create intercompany transfer')
    return created
  }

  async getAll(organizationId: string, page = 1, limit = 100) {
    const result = await this.repository.findByOrg(organizationId, page, limit)
    return result.data
  }

  async getById(id: string) {
    return this.repository.findById(id)
  }

  async update(id: string, data: Record<string, unknown>, userId: string) {
    const payload: Record<string, unknown> = { ...data }
    if (payload.fromOrganizationId != null) {
      payload.fromOrganizationId = String(payload.fromOrganizationId).trim()
    }
    if (payload.toOrganizationId != null) {
      payload.toOrganizationId = String(payload.toOrganizationId).trim()
    }
    const f = payload.fromOrganizationId as string | undefined
    const t = payload.toOrganizationId as string | undefined
    if (f && t && f === t) {
      throw new Error('From and to organization must differ')
    }
    if (payload.lineItems != null && Array.isArray(payload.lineItems)) {
      payload.lineItems = (payload.lineItems as Record<string, unknown>[]).map((raw) => ({
        itemDescription: String(raw.itemDescription ?? '').trim() || 'Item',
        qty:
          typeof raw.qty === 'number'
            ? raw.qty
            : parseFloat(String(raw.qty ?? 0)) || 0,
        ...(raw.unit != null && String(raw.unit).trim() !== ''
          ? { unit: String(raw.unit).trim() }
          : {}),
      }))
    }
    if (payload.transferDate != null && String(payload.transferDate).trim() !== '') {
      const d = new Date(String(payload.transferDate))
      if (!Number.isNaN(d.getTime())) payload.transferDate = d
    }
    if (isObjectIdHex(userId)) {
      payload.updatedBy = userId
    }
    const updated = await this.repository.update(id, payload as any)
    if (!updated) throw new Error('Intercompany transfer not found')
    return updated
  }

  async confirm(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Intercompany transfer not found')
    if ((doc as any).status !== 'draft') {
      throw new Error('Only draft transfers can be confirmed')
    }
    const patch: Record<string, unknown> = { status: 'confirmed' }
    if (isObjectIdHex(userId)) patch.updatedBy = userId
    const updated = await this.repository.update(id, patch as any)
    if (!updated) throw new Error('Intercompany transfer not found')
    return updated
  }

  async cancel(id: string, userId: string) {
    const doc = await this.repository.findById(id)
    if (!doc) throw new Error('Intercompany transfer not found')
    if ((doc as any).status === 'cancelled') throw new Error('Already cancelled')
    const patch: Record<string, unknown> = { status: 'cancelled' }
    if (isObjectIdHex(userId)) patch.updatedBy = userId
    const updated = await this.repository.update(id, patch as any)
    if (!updated) throw new Error('Intercompany transfer not found')
    return updated
  }

  async delete(id: string) {
    const updated = await this.repository.update(id, { deletedAt: new Date() } as any)
    if (!updated) throw new Error('Intercompany transfer not found')
  }
}
