import { GRNService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new GRNService()

function graphqlIsoDate(value: unknown): string {
  if (value == null) return new Date(0).toISOString()
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  if (typeof value === 'string' && value.length > 0) {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString()
  }
  return new Date(0).toISOString()
}

function asPlain(doc: unknown): Record<string, unknown> {
  if (doc == null) return {}
  const d = doc as {
    toJSON?: () => Record<string, unknown>
    toObject?: () => Record<string, unknown>
  }
  if (typeof d.toJSON === 'function') return d.toJSON()
  if (typeof d.toObject === 'function') return d.toObject()
  return doc as Record<string, unknown>
}

function refIdToString(value: unknown): string | null {
  if (value == null || value === '') return null
  return String(value)
}

function grnLineToGraphQL(item: Record<string, unknown>) {
  const od = item.orderedQty
  const rq = item.receivedQty
  const up = item.unitPrice
  const orderedQty = typeof od === 'number' ? od : parseFloat(String(od ?? 0)) || 0
  const receivedQty = typeof rq === 'number' ? rq : parseFloat(String(rq ?? 0)) || 0
  let unitPrice: number | null = null
  if (up != null && String(up) !== '') {
    const n = typeof up === 'number' ? up : parseFloat(String(up))
    unitPrice = Number.isFinite(n) ? n : null
  }
  return {
    itemDescription: String(item.itemDescription ?? ''),
    orderedQty,
    receivedQty,
    unitPrice,
  }
}

function grnToGraphQL(doc: unknown) {
  const o = asPlain(doc)
  const id = o._id != null ? String(o._id) : String(o.id ?? '')
  const lines = Array.isArray(o.lineItems) ? o.lineItems : []
  const orgId = refIdToString(o.organizationId)
  return {
    id,
    grnNumber: String(o.grnNumber ?? ''),
    purchaseOrderId: refIdToString(o.purchaseOrderId),
    vendorId: refIdToString(o.vendorId),
    vendorName:
      o.vendorName != null && String(o.vendorName).trim() !== '' ? String(o.vendorName) : null,
    receivedDate: graphqlIsoDate(o.receivedDate),
    lineItems: lines.map((li) => grnLineToGraphQL(asPlain(li))),
    notes: o.notes != null && String(o.notes).trim() !== '' ? String(o.notes) : null,
    status: String(o.status ?? 'confirmed'),
    organizationId: orgId ?? '',
    createdAt: o.createdAt != null ? graphqlIsoDate(o.createdAt) : null,
  }
}

export const resolvers = {
  Query: {
    grn: async (_: unknown, { id }: { id: string }) => {
      const row = await service.getGRNById(id)
      if (!row) return null
      const plain = asPlain(row)
      if (plain.deletedAt != null) return null
      return grnToGraphQL(row)
    },
    grns: async (
      _: unknown,
      { organizationId, page, limit }: { organizationId: string; page?: number; limit?: number },
    ) => {
      const rows = await service.getGRNs(organizationId, page ?? 1, limit ?? 100)
      return rows.map((r) => grnToGraphQL(r))
    },
    grnsByPO: async (_: unknown, { purchaseOrderId }: { purchaseOrderId: string }) => {
      const rows = await service.getGRNsByPO(purchaseOrderId)
      return rows.map((r) => grnToGraphQL(r))
    },
  },
  Mutation: {
    createGRN: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: GraphQLContext,
    ) => {
      const created = await service.createGRN(input, ctx.user?.id ?? '')
      return grnToGraphQL(created)
    },
    updateGRN: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
    ) => {
      const updated = await service.updateGRN(id, input)
      return grnToGraphQL(updated)
    },
    deleteGRN: async (_: unknown, { id }: { id: string }) => {
      await service.deleteGRN(id)
      return true
    },
  },
}
