import { VendorPrepaymentService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new VendorPrepaymentService()

export const resolvers = {
  Query: {
    vendorPrepayment: (_: unknown, { id }: { id: string }) => service.getPrepaymentById(id),
    vendorPrepayments: (_: unknown, args: any) => {
      const { organizationId, vendorId } = args
      const filter: any = {}
      if (vendorId) filter.vendorId = vendorId
      return service.getPrepayments(organizationId, filter)
    },
    availableVendorPrepayments: (_: unknown, { organizationId, vendorId }: any) =>
      service.getAvailablePrepayments(organizationId, vendorId),
  },
  Mutation: {
    createVendorPrepayment: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createPrepayment(input, ctx.user?.id ?? ''),
    updateVendorPrepayment: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updatePrepayment(id, input, ctx.user?.id ?? ''),
    deleteVendorPrepayment: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deletePrepayment(id, ctx.user?.id ?? '')
      return true
    },
  },
  VendorPrepayment: {
    id: (p: any) => p._id || p.id,
    prepaymentDate: (p: any) => p.prepaymentDate ? new Date(p.prepaymentDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    updatedAt: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    vendorId: (p: any) => typeof p.vendorId === 'object' ? (p.vendorId._id?.toString() ?? p.vendorId.id) : p.vendorId?.toString(),
    vendor: (p: any) => typeof p.vendorId === 'object' ? p.vendorId : null,
  },
}
