import { VendorPaymentService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new VendorPaymentService()

export const resolvers = {
  Query: {
    vendorPayment: async (_: unknown, { id }: { id: string }) =>
      service.getPaymentById(id),

    vendorPayments: async (_: unknown, args: any) => {
      const { organizationId, vendorId, page = 1, limit = 100 } = args
      const filter: any = {}
      if (vendorId) filter.vendorId = vendorId
      return service.getPayments(organizationId, filter, page, limit)
    },

    vendorPaymentsByVendor: async (_: unknown, { vendorId }: { vendorId: string }) =>
      service.getPaymentsByVendor(vendorId),
  },

  Mutation: {
    createVendorPayment: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createPayment(input, ctx.user?.id ?? ''),

    updateVendorPayment: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updatePayment(id, input, ctx.user?.id ?? ''),

    deleteVendorPayment: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deletePayment(id, ctx.user?.id ?? '')
      return true
    },
  },

  VendorPayment: {
    id: (parent: any) => parent._id || parent.id,
    paymentDate: (parent: any) => parent.paymentDate ? new Date(parent.paymentDate).toISOString() : null,
    vendorId: (parent: any) => {
      if (parent.vendorId && typeof parent.vendorId === 'object') return parent.vendorId._id?.toString() ?? parent.vendorId.id
      return parent.vendorId?.toString()
    },
    vendor: (parent: any) => {
      if (parent.vendorId && typeof parent.vendorId === 'object') return parent.vendorId
      return null
    },
  },
}
