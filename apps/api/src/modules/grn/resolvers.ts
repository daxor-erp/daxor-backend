import { GRNService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new GRNService()

export const resolvers = {
  Query: {
    grn: (_: unknown, { id }: { id: string }) => service.getGRNById(id),
    grns: (_: unknown, { organizationId, page, limit }: any) =>
      service.getGRNs(organizationId, page, limit),
    grnsByPO: (_: unknown, { purchaseOrderId }: { purchaseOrderId: string }) =>
      service.getGRNsByPO(purchaseOrderId),
  },
  Mutation: {
    createGRN: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createGRN(input, ctx.user?.id ?? ''),
    deleteGRN: async (_: unknown, { id }: { id: string }) => {
      await service.deleteGRN(id)
      return true
    },
  },
  GRN: {
    id: (p: any) => p._id || p.id,
    receivedDate: (p: any) => p.receivedDate ? new Date(p.receivedDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
  },
}
