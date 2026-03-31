import { StockTransferService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new StockTransferService()

export const resolvers = {
  Query: {
    stocktransfer: (_: unknown, { id }: any) => service.getById(id),
    stocktransfers: (_: unknown, { organizationId, page, limit }: any) =>
      service.getAll(organizationId, page, limit),
  },
  Mutation: {
    createStockTransfer: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.create(input, ctx.user?.id ?? ''),
    updateStockTransfer: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.update(id, input, ctx.user?.id ?? ''),
    confirmStockTransfer: (_: unknown, { id }: any, ctx: GraphQLContext) =>
      service.confirm(id, ctx.user?.id ?? ''),
    cancelStockTransfer: (_: unknown, { id }: any, ctx: GraphQLContext) =>
      service.cancel(id, ctx.user?.id ?? ''),
    deleteStockTransfer: async (_: unknown, { id }: any) => {
      await service.delete(id)
      return true
    },
  },
  StockTransfer: {
    id: (p: any) => p._id || p.id,
    transferDate: (p: any) => (p.transferDate ? new Date(p.transferDate).toISOString() : null),
    createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : null),
  },
}
