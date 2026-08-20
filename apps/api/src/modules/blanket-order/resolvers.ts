import { BlanketOrderService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { assertAuthenticated } from '../auth/authz'

const service = new BlanketOrderService()

const iso = (d: unknown) => {
  if (!d) return null
  const t = new Date(d as string).getTime()
  return Number.isNaN(t) ? null : new Date(t).toISOString()
}

export const resolvers = {
  Query: {
    blanketOrder: (_: unknown, { id }: { id: string }) => service.findById(id),
    blanketOrders: (_: unknown, { organizationId, status, vendorId }: any) =>
      service.list(organizationId, { status, vendorId }),
  },
  Mutation: {
    createBlanketOrder: (_: unknown, { input }: any, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.create(input, ctx.user!.id)
    },
    updateBlanketOrder: (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.update(id, input, ctx.user!.id)
    },
    confirmBlanketOrder: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.confirm(id, ctx.user!.id)
    },
    closeBlanketOrder: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.close(id, ctx.user!.id)
    },
    cancelBlanketOrder: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.cancel(id, ctx.user!.id)
    },
    deleteBlanketOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      await service.softDelete(id, ctx.user!.id)
      return true
    },

    recordCallOff: (_: unknown, { id, lineId, qty }: { id: string; lineId: string; qty: number }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.recordCallOffByLineId(id, lineId, qty)
    },
  },
  BlanketOrder: {
    id:             (p: any) => String(p._id ?? p.id ?? ''),
    vendorId:       (p: any) => String(p.vendorId ?? ''),
    organizationId: (p: any) => String(p.organizationId ?? ''),
    seqNo:          (p: any) => p.seqNo ?? null,
    boNumber:       (p: any) => p.seqNo ?? null,           // alias
    validityStart:  (p: any) => iso(p.validityStart),
    validityEnd:    (p: any) => iso(p.validityEnd),
    startDate:      (p: any) => iso(p.validityStart),      // alias
    endDate:        (p: any) => iso(p.validityEnd),        // alias
    totalValue: (p: any) => {
      const lines: any[] = p.lines ?? []
      return lines.reduce((s, l) => s + Number(l.quantity ?? 0) * Number(l.unitPrice ?? 0), 0)
    },
    committedValue: (p: any) => {
      const lines: any[] = p.lines ?? []
      return lines.reduce((s, l) => s + Number(l.orderedQty ?? 0) * Number(l.unitPrice ?? 0), 0)
    },
    createdAt: (p: any) => iso(p.createdAt) ?? '',
    updatedAt: (p: any) => iso(p.updatedAt) ?? '',
    lines: (p: any) => (p.lines ?? []).map((l: any) => ({
      id:          String(l._id ?? ''),
      productId:   l.productId ? String(l.productId) : null,
      productName: l.productName ?? null,
      quantity:    Number(l.quantity ?? 0),
      orderedQty:  Number(l.orderedQty ?? 0),
      unitPrice:   Number(l.unitPrice ?? 0),
      lineTotal:   Math.round(Number(l.quantity ?? 0) * Number(l.unitPrice ?? 0) * 100) / 100,
      uomId:       l.uomId ? String(l.uomId) : null,
      notes:       l.notes ?? null,
    })),
  },
}
