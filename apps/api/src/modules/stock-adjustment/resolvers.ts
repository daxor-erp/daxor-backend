import { StockAdjustmentService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new StockAdjustmentService()

export const resolvers = {
  Query: {
    stockadjustment: (_: unknown, { id }: any) => service.getById(id),
    stockadjustments: (_: unknown, { organizationId, page, limit }: any) =>
      service.getAll(organizationId, page, limit),
  },
  Mutation: {
    createStockAdjustment: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.create(input, ctx.user?.id ?? ''),
    updateStockAdjustment: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.update(id, input, ctx.user?.id ?? ''),
    confirmStockAdjustment: (_: unknown, { id }: any, ctx: GraphQLContext) =>
      service.confirm(id, ctx.user?.id ?? ''),
    cancelStockAdjustment: (_: unknown, { id }: any, ctx: GraphQLContext) =>
      service.cancel(id, ctx.user?.id ?? ''),
    deleteStockAdjustment: async (_: unknown, { id }: any) => {
      await service.delete(id)
      return true
    },
  },
  StockAdjustment: {
    id: (p: any) => p._id || p.id,
    adjDate: (p: any) => (p.adjDate ? new Date(p.adjDate).toISOString() : null),
    createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : null),
  },
}
