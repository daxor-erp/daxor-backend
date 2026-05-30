import { VendorBillService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_PAYABLES } from '../approval-request/service'

const service = new VendorBillService()
const approvalService = new ApprovalRequestService()

export const resolvers = {
  Query: {
    vendorBill: async (_: unknown, { id }: { id: string }) =>
      service.getBillById(id),

    vendorBills: async (_: unknown, args: any) => {
      const { organizationId, vendorId, status, page = 1, limit = 100 } = args
      const filter: any = {}
      if (vendorId) filter.vendorId = vendorId
      if (status) filter.status = status
      return service.getBills(organizationId, filter, page, limit)
    },

    vendorBillsByVendor: async (_: unknown, { vendorId }: { vendorId: string }) =>
      service.getBillsByVendor(vendorId),

    outstandingVendorBills: async (_: unknown, { organizationId }: { organizationId: string }) =>
      service.getOutstandingBills(organizationId),
  },

  Mutation: {
    createVendorBill: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createBill(input, ctx.user?.id ?? ''),

    updateVendorBill: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updateBill(id, input, ctx.user?.id ?? ''),

    approveVendorBill: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      service.approveBill(id, ctx.user?.id ?? ''),

    submitVendorBillForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const bill = await service.getBillById(id)
      if (!bill || (bill as any).deletedAt) throw new GraphQLAuthError('Vendor bill not found')
      const ctxOrg = ctx.user?.organizationId
      if (ctxOrg == null || String(ctxOrg) !== String((bill as any).organizationId)) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfigured(String((bill as any).organizationId), MODULE_KEY_PAYABLES)
      await service.submitForApproval(id, ctx.user!.id)
      await approvalService.enqueueVendorBillSubmitted(id, ctx.user!.id)
      return service.getBillById(id)
    },

    syncVendorBillAccounting: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      await service.syncAccounting(id, ctx.user!.id)
      return service.getBillById(id)
    },

    deleteVendorBill: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deleteBill(id, ctx.user?.id ?? '')
      return true
    },
  },

  VendorBill: {
    debitNotesApplied: (parent: any) => Number(parent.debitNotesApplied ?? 0),
    id: (parent: any) => parent._id || parent.id,
    billDate: (parent: any) => parent.billDate ? new Date(parent.billDate).toISOString() : null,
    dueDate: (parent: any) => parent.dueDate ? new Date(parent.dueDate).toISOString() : null,
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
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
