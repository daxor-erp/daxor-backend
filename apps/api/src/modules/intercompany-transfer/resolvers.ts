import { IntercompanyTransferService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new IntercompanyTransferService()

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

function optionalTrim(value: unknown): string | null {
  if (value == null) return null
  const s = String(value).trim()
  return s === '' ? null : s
}

function mapLineItems(items: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(items)) return []
  return items.map((li: Record<string, unknown>) => ({
    itemDescription: String(li.itemDescription ?? ''),
    qty: coerceFloat(li.qty),
    unit:
      li.unit != null && String(li.unit).trim() !== ''
        ? String(li.unit)
        : null,
  }))
}

function intercompanyTransferToGraphQL(doc: unknown) {
  if (doc == null) {
    throw new Error('Intercompany transfer operation returned no document')
  }
  const o = asPlain(doc)
  const transferDateIso =
    graphqlIsoDate(o.transferDate) ?? new Date(0).toISOString()
  return {
    id: String(o._id ?? o.id ?? ''),
    transferNumber: String(o.transferNumber ?? ''),
    transferDate: transferDateIso,
    fromOrganizationId: String(o.fromOrganizationId ?? ''),
    fromOrganizationName: optionalTrim(o.fromOrganizationName),
    toOrganizationId: String(o.toOrganizationId ?? ''),
    toOrganizationName: optionalTrim(o.toOrganizationName),
    lineItems: mapLineItems(o.lineItems),
    status: String(o.status ?? 'draft'),
    notes: optionalTrim(o.notes),
    organizationId: String(o.organizationId ?? ''),
    createdAt: graphqlIsoDate(o.createdAt),
    updatedAt: graphqlIsoDate(o.updatedAt),
  }
}

export const resolvers = {
  Query: {
    intercompanyTransfer: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getById(id)
      if (!doc) return null
      const plain = asPlain(doc)
      if (plain.deletedAt != null) return null
      return intercompanyTransferToGraphQL(doc)
    },
    intercompanyTransfers: async (
      _: unknown,
      {
        organizationId,
        page,
        limit,
      }: { organizationId: string; page?: number; limit?: number },
    ) => {
      const rows = await service.getAll(organizationId, page ?? 1, limit ?? 100)
      return rows.map((d) => intercompanyTransferToGraphQL(d))
    },
  },
  Mutation: {
    createIntercompanyTransfer: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.create(input, ctx.user?.id ?? '')
      return intercompanyTransferToGraphQL(doc)
    },
    updateIntercompanyTransfer: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.update(id, input, ctx.user?.id ?? '')
      return intercompanyTransferToGraphQL(doc)
    },
    confirmIntercompanyTransfer: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.confirm(id, ctx.user?.id ?? '')
      return intercompanyTransferToGraphQL(doc)
    },
    cancelIntercompanyTransfer: async (
      _: unknown,
      { id }: { id: string },
      ctx: GraphQLContext,
    ) => {
      const doc = await service.cancel(id, ctx.user?.id ?? '')
      return intercompanyTransferToGraphQL(doc)
    },
    deleteIntercompanyTransfer: async (_: unknown, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
  },
}
