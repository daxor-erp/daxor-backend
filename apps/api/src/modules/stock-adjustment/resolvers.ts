import { StockAdjustmentService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new StockAdjustmentService()

function graphqlIsoDate(value: unknown): string | null {
  if (value == null) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  if (typeof value === 'string' && value.length > 0) {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d.toISOString()
  }
  return null
}

function coerceFloat(v: unknown): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : 0
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

function mapLineItems(items: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(items)) return []
  return items.map((li: Record<string, unknown>) => ({
    itemId:
      li.itemId != null && String(li.itemId).trim() !== ''
        ? String(li.itemId)
        : null,
    itemDescription: String(li.itemDescription ?? ''),
    currentQty: coerceFloat(li.currentQty),
    adjustedQty: coerceFloat(li.adjustedQty),
    difference: coerceFloat(li.difference),
    unit:
      li.unit != null && String(li.unit).trim() !== ''
        ? String(li.unit)
        : null,
  }))
}

/** Plain GraphQL-safe payloads (IDs as strings, dates as ISO, no Mongoose refs). */
function stockAdjustmentToGraphQL(doc: unknown) {
  if (doc == null) {
    throw new Error('Stock adjustment operation returned no document')
  }
  const o = asPlain(doc)
  const adjDateIso = graphqlIsoDate(o.adjDate) ?? new Date(0).toISOString()
  return {
    id: String(o._id ?? o.id ?? ''),
    adjNumber: String(o.adjNumber ?? ''),
    adjDate: adjDateIso,
    warehouseId:
      o.warehouseId != null && String(o.warehouseId).trim() !== ''
        ? String(o.warehouseId)
        : null,
    warehouseName:
      o.warehouseName != null && String(o.warehouseName).trim() !== ''
        ? String(o.warehouseName)
        : null,
    adjustmentType: String(o.adjustmentType ?? ''),
    lineItems: mapLineItems(o.lineItems),
    reason:
      o.reason != null && String(o.reason).trim() !== ''
        ? String(o.reason)
        : null,
    status: String(o.status ?? 'draft'),
    notes:
      o.notes != null && String(o.notes).trim() !== ''
        ? String(o.notes)
        : null,
    organizationId: String(o.organizationId ?? ''),
    createdAt: graphqlIsoDate(o.createdAt),
    updatedAt: graphqlIsoDate(o.updatedAt),
  }
}

export const resolvers = {
  Query: {
    stockadjustment: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getById(id)
      return doc ? stockAdjustmentToGraphQL(doc) : null
    },
    stockadjustments: async (
      _: unknown,
      {
        organizationId,
        page,
        limit,
      }: { organizationId: string; page?: number; limit?: number },
    ) => {
      const rows = await service.getAll(organizationId, page, limit)
      return rows.map((d) => stockAdjustmentToGraphQL(d))
    },
  },
  Mutation: {
    createStockAdjustment: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.create(input, ctx.user?.id ?? 'system')
      return stockAdjustmentToGraphQL(doc)
    },
    updateStockAdjustment: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.update(id, input, ctx.user?.id ?? 'system')
      return stockAdjustmentToGraphQL(doc)
    },
    confirmStockAdjustment: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.confirm(id, ctx.user?.id ?? 'system')
      return stockAdjustmentToGraphQL(doc)
    },
    cancelStockAdjustment: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.cancel(id, ctx.user?.id ?? 'system')
      return stockAdjustmentToGraphQL(doc)
    },
    deleteStockAdjustment: async (_: unknown, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
  },
}
