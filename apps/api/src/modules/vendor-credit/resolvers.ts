import { VendorCreditService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new VendorCreditService()

export const resolvers = {
  Query: {
    vendorCredit: (_: unknown, { id }: { id: string }) => service.getCreditById(id),
    vendorCredits: (_: unknown, args: any) => {
      const { organizationId, vendorId } = args
      const filter: any = {}
      if (vendorId) filter.vendorId = vendorId
      return service.getCredits(organizationId, filter)
    },
    availableVendorCredits: (_: unknown, { organizationId, vendorId }: any) =>
      service.getAvailableCredits(organizationId, vendorId),
  },
  Mutation: {
    createVendorCredit: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createCredit(input, ctx.user?.id ?? ''),
    updateVendorCredit: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updateCredit(id, input, ctx.user?.id ?? ''),
    deleteVendorCredit: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deleteCredit(id, ctx.user?.id ?? '')
      return true
    },
  },
  VendorCredit: {
    id: (p: any) => p._id || p.id,
    creditDate: (p: any) => p.creditDate ? new Date(p.creditDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    updatedAt: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    vendorId: (p: any) => typeof p.vendorId === 'object' ? (p.vendorId._id?.toString() ?? p.vendorId.id) : p.vendorId?.toString(),
    vendor: (p: any) => typeof p.vendorId === 'object' ? p.vendorId : null,
  },
}
