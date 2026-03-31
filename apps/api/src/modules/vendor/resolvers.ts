import { VendorService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new VendorService()

export const resolvers = {
  Query: {
    vendor: async (_: unknown, { id }: { id: string }) =>
      service.getVendorById(id),

    vendors: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, status, search } = args
      const filter: any = { organizationId }
      if (status) filter.status = status
      if (search) filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ]
      return service.getAllVendors(filter, page, limit)
    },
  },

  Mutation: {
    createVendor: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createVendor(input, ctx.user?.id ?? ''),

    updateVendor: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updateVendor(id, input, ctx.user?.id ?? ''),

    deleteVendor: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deleteVendor(id, ctx.user?.id ?? '')
      return true
    },
  },

  Vendor: {
    id: (parent: any) => parent._id || parent.id,
  },
}
