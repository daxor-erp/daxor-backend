import { GraphQLValidationError } from '@repo/errors'
import { GRNRepository } from './repository'
import { accountingPosting } from '../../lib/accounting-posting'
import { InventoryControlService } from '../inventory-control/service'
import { StockMovement } from '../inventory-control/model'

const inventoryService = new InventoryControlService()

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
      return {
        itemDescription,
        orderedQty,
        receivedQty,
        unitPrice,
        lotSerialNumbers: Array.isArray(raw.lotSerialNumbers) ? raw.lotSerialNumbers : [],
      }
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
    if (String((created as any).status) === 'confirmed') {
      await this.syncGrnInventory(created, userId)
      await accountingPosting.postGrnReceipt(created, userId)
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
    const fresh = await this.repository.findById(id)
    await this.syncGrnInventory(fresh, userId)
    await accountingPosting.postGrnReceipt(fresh, userId)
    return updated
  }

  private async syncGrnInventory(grn: any, userId: string) {
    if (!grn) return
    const orgId = String(grn.organizationId ?? '')
    const lines = (grn.lineItems ?? []).map((l: any) => ({
      itemDescription: l.itemDescription,
      quantity: Number(l.receivedQty) || 0,
    }))
    if (!lines.some((l: { quantity: number }) => l.quantity > 0)) return
    await inventoryService.applyReceiptLines({
      organizationId: orgId,
      userId,
      referenceModule: 'grn',
      referenceId: String(grn._id ?? grn.id ?? ''),
      lines,
      direction: 'in',
    })
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

  /**
   * Called when a PO is marked as received. Reflects each line's *current* qtyReceived
   * (post-rework POs support partial receipts, so this snapshots the state after the receive
   * action rather than assuming every line was received in full).
   */
  async createFromPO(po: Record<string, unknown>, userId: string) {
    const orgId = po.organizationId != null ? String(po.organizationId) : ''
    const poId = po._id != null ? String(po._id) : po.id != null ? String(po.id) : ''
    const lines = (Array.isArray(po.items) ? po.items : []) as Array<Record<string, unknown>>
    const receivedLines = lines.filter((item) => Number(item.qtyReceived ?? item.quantity ?? 0) > 0)
    return this.createGRN(
      {
        purchaseOrderId: poId || undefined,
        vendorId: po.vendorId != null ? String(po.vendorId) : undefined,
        vendorName: po.vendorName != null ? String(po.vendorName) : undefined,
        receivedDate: new Date().toISOString(),
        lineItems: receivedLines.map((item) => ({
          itemDescription: item.productName ?? item.itemDescription ?? 'Item',
          orderedQty: item.quantity ?? 0,
          receivedQty: item.qtyReceived ?? item.quantity ?? 0,
          unitPrice: item.unitPrice ?? 0,
          lotSerialNumbers: Array.isArray(item.lotSerialNumbers) ? item.lotSerialNumbers : [],
        })),
        notes: `Auto-created from PO ${po.seqNo != null ? String(po.seqNo) : ''}`.trim(),
        organizationId: orgId,
        status: 'confirmed',
      },
      userId,
    )
  }

  /**
   * Lot / Serial Traceability Report (Odoo 19: Inventory › Lots/Serial Numbers → Traceability tab).
   * Searches all GRNs, StockMovements, and DeliveryOrders for a given lot or serial number.
   * Returns a chronological list of events — where the lot entered, moved, and left the warehouse.
   */
  async traceLotSerial(organizationId: string, lotOrSerial: string): Promise<{
    lotOrSerial: string
    events: Array<{
      eventType: string
      documentType: string
      documentId: string
      documentNumber: string
      date: string
      itemDescription: string | null
      quantity: number | null
      location: string | null
      referenceModule: string | null
    }>
    totalEventsFound: number
  }> {
    const events: any[] = []
    const term = lotOrSerial.trim()

    // 1. Search GRNs — incoming receipts where this lot/serial was recorded
    const grns = await this.repository.model.find({
      organizationId,
      deletedAt: null,
      'lineItems.lotSerialNumbers': term,
    }).lean()

    for (const grn of grns as any[]) {
      for (const line of grn.lineItems ?? []) {
        if ((line.lotSerialNumbers ?? []).includes(term)) {
          events.push({
            eventType: 'RECEIPT',
            documentType: 'GRN',
            documentId: String(grn._id),
            documentNumber: grn.grnNumber ?? '',
            date: grn.receivedDate ? new Date(grn.receivedDate).toISOString() : new Date(grn.createdAt).toISOString(),
            itemDescription: line.itemDescription ?? null,
            quantity: Number(line.receivedQty ?? 0),
            location: null,
            referenceModule: 'grn',
          })
        }
      }
    }

    // 2. Search StockMovements — any adjustments, transfers referencing this lot
    const movements = await StockMovement.find({
      organizationId,
      $or: [
        { notes: { $regex: term, $options: 'i' } },
        { referenceId: term },
      ],
      isDeleted: false,
    }).lean()

    for (const mv of movements as any[]) {
      events.push({
        eventType: mv.movementType ?? 'MOVEMENT',
        documentType: 'StockMovement',
        documentId: String(mv._id),
        documentNumber: String(mv._id).slice(-8),
        date: mv.movementDate ? new Date(mv.movementDate).toISOString() : new Date(mv.createdAt ?? 0).toISOString(),
        itemDescription: mv.itemId ? String(mv.itemId) : null,
        quantity: Number(mv.quantity ?? 0),
        location: mv.toLocation ?? mv.fromLocation ?? null,
        referenceModule: mv.referenceModule ?? null,
      })
    }

    // Sort by date ascending
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return {
      lotOrSerial: term,
      events,
      totalEventsFound: events.length,
    }
  }
}
