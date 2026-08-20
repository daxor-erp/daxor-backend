import { GraphQLValidationError } from '@repo/errors'
import { BlanketOrder } from './model'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'

export class BlanketOrderService {

  private async generateSeqNo(organizationId: string): Promise<string> {
    const seq = await getNextSequence({ type: 'BlanketOrder', organizationId })
    return formatEntitySequence('BO', organizationId, seq)
  }

  async create(data: any, userId: string) {
    const seqNo = await this.generateSeqNo(String(data.organizationId))
    // Accept startDate/endDate as aliases for validityStart/validityEnd
    const validityStart = data.validityStart ?? data.startDate ?? undefined
    const validityEnd   = data.validityEnd   ?? data.endDate   ?? undefined
    const lines = (data.lines ?? []).map((l: any) => ({
      productId: l.productId ?? undefined,
      productName: l.productName ?? '',
      quantity: Number(l.quantity) || 0,
      orderedQty: 0,
      unitPrice: Number(l.unitPrice) || 0,
      uomId: l.uomId ?? undefined,
      notes: l.notes ?? '',
    }))
    const doc = await BlanketOrder.create({
      ...data,
      validityStart,
      validityEnd,
      seqNo,
      lines,
      status: 'draft',
      createdBy: userId,
      updatedBy: userId,
    })
    return doc
  }

  async findById(id: string) {
    return BlanketOrder.findById(id).lean()
  }

  async list(organizationId: string, filter: { status?: string; vendorId?: string } = {}) {
    const q: any = { organizationId, deletedAt: null }
    if (filter.status) q.status = filter.status
    if (filter.vendorId) q.vendorId = filter.vendorId
    return BlanketOrder.find(q).sort({ createdAt: -1 }).lean()
  }

  async update(id: string, data: any, userId: string) {
    const doc = await BlanketOrder.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Blanket order not found')
    if (!['draft', 'open'].includes(String(doc.status))) {
      throw new GraphQLValidationError('Only draft or open blanket orders can be updated')
    }
    Object.assign(doc, { ...data, updatedBy: userId })
    await doc.save()
    return doc
  }

  async confirm(id: string, userId: string) {
    const doc = await BlanketOrder.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Blanket order not found')
    if (doc.status !== 'draft') throw new GraphQLValidationError('Only draft blanket orders can be confirmed')
    if (!doc.lines?.length) throw new GraphQLValidationError('Add at least one line before confirming')
    doc.status = 'open'
    doc.updatedBy = userId as any
    await doc.save()
    return doc
  }

  async close(id: string, userId: string) {
    const doc = await BlanketOrder.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Blanket order not found')
    if (!['draft', 'open'].includes(String(doc.status))) {
      throw new GraphQLValidationError('Cannot close a blanket order that is already closed or cancelled')
    }
    doc.status = 'closed'
    doc.updatedBy = userId as any
    await doc.save()
    return doc
  }

  async cancel(id: string, userId: string) {
    const doc = await BlanketOrder.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Blanket order not found')
    if (doc.status === 'cancelled') throw new GraphQLValidationError('Already cancelled')
    doc.status = 'cancelled'
    doc.updatedBy = userId as any
    await doc.save()
    return doc
  }

  async softDelete(id: string, userId: string) {
    const doc = await BlanketOrder.findById(id)
    if (!doc) throw new GraphQLValidationError('Blanket order not found')
    if (!['draft', 'cancelled'].includes(String(doc.status))) {
      throw new GraphQLValidationError('Only draft or cancelled blanket orders can be deleted')
    }
    doc.deletedAt = new Date()
    doc.updatedBy = userId as any
    await doc.save()
    return doc
  }

  /**
   * Record that a PO "call-off" has been raised against this blanket order.
   * Increments orderedQty on the matched line.
   * Called by PurchaseOrderService when a PO references an agreement/blanket order.
   */
  async recordCallOff(blanketOrderId: string, productId: string, qty: number): Promise<void> {
    await BlanketOrder.updateOne(
      { _id: blanketOrderId, 'lines.productId': productId, deletedAt: null },
      { $inc: { 'lines.$.orderedQty': qty } },
    )
  }

  /**
   * Public GraphQL mutation: record a call-off by line subdocument ID.
   * Used by the frontend blanket-orders page "Call Off" drawer.
   */
  async recordCallOffByLineId(blanketOrderId: string, lineId: string, qty: number) {
    const doc = await BlanketOrder.findById(blanketOrderId)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Blanket order not found')
    if (doc.status !== 'open') throw new GraphQLValidationError('Call-offs can only be recorded on open blanket orders')
    if (!(qty > 0)) throw new GraphQLValidationError('Quantity must be positive')

    const line = (doc as any).lines.id(lineId)
    if (!line) throw new GraphQLValidationError(`Line ${lineId} not found on this blanket order`)

    const committed = Number(line.quantity ?? 0)
    const alreadyOrdered = Number(line.orderedQty ?? 0)
    if (alreadyOrdered + qty > committed + 0.001) {
      throw new GraphQLValidationError(
        `Call-off qty ${qty} would exceed the committed quantity of ${committed} (already ordered: ${alreadyOrdered})`
      )
    }

    line.orderedQty = alreadyOrdered + qty
    ;(doc as any).markModified('lines')
    await doc.save()
    return doc
  }

  /**
   * Check if a product's ordered qty exceeds commitment on a blanket order.
   * Returns { over: true, committed: X, ordered: Y } if over-committed.
   */
  async checkCommitment(
    blanketOrderId: string,
    productId: string,
    additionalQty: number,
  ): Promise<{ over: boolean; committed: number; ordered: number; remaining: number }> {
    const doc = await BlanketOrder.findById(blanketOrderId).lean() as any
    if (!doc) return { over: false, committed: 0, ordered: 0, remaining: 999999 }
    const line = (doc.lines ?? []).find((l: any) => String(l.productId) === String(productId))
    if (!line) return { over: false, committed: 0, ordered: 0, remaining: 999999 }
    const committed = Number(line.quantity ?? 0)
    const ordered = Number(line.orderedQty ?? 0) + additionalQty
    const remaining = committed - ordered
    return { over: ordered > committed, committed, ordered, remaining }
  }
}
