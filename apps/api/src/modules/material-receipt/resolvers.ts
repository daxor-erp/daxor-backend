import { MaterialReceiptService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new MaterialReceiptService()

export const materialreceiptResolvers = {
  Query: {
    materialreceipt: (_: unknown, { id }: { id: string }) => service.getById(id),
    materialreceipts: (_: unknown, { organizationId, page, limit, status }: any) =>
      service.getAll(organizationId, page, limit, status),
    materialreceiptsByPO: (_: unknown, { purchaseOrderId }: { purchaseOrderId: string }) =>
      service.getByPO(purchaseOrderId),
  },
  Mutation: {
    createMaterialReceipt: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.create(input, ctx.user?.id ?? ''),
    updateMaterialReceipt: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.update(id, input, ctx.user?.id ?? ''),
    confirmMaterialReceipt: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      service.confirm(id, ctx.user?.id ?? ''),
    cancelMaterialReceipt: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      service.cancel(id, ctx.user?.id ?? ''),
    deleteMaterialReceipt: async (_: unknown, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
  },
  MaterialReceipt: {
    id: (p: any) => p._id || p.id,
    receiptDate: (p: any) => (p.receiptDate ? new Date(p.receiptDate).toISOString() : null),
    createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : null),
    updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : null),
  },
}
