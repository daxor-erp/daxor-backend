import { VendorService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_PURCHASES } from '../approval-request/service'

const service = new VendorService()
const approvalService = new ApprovalRequestService()

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

    submitVendorForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const row = await service.getVendorById(id)
      if (!row || (row as any).deletedAt) throw new GraphQLAuthError('Vendor not found')
      const ctxOrg = ctx.user?.organizationId
      if (ctxOrg == null || String(ctxOrg) !== String((row as any).organizationId)) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfigured(String((row as any).organizationId), MODULE_KEY_PURCHASES)
      await service.submitForOrgApproval(id, ctx.user!.id)
      await approvalService.enqueueVendorSubmitted(id, ctx.user!.id)
      return service.getVendorById(id)
    },
  },

  Vendor: {
    id: (parent: any) => parent._id || parent.id,
    orgApprovalStatus: (parent: any) => parent.orgApprovalStatus ?? 'approved',
  },
}
