import { MaterialReceiptService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_PURCHASES } from '../approval-request/service'

const service = new MaterialReceiptService()
const approvalService = new ApprovalRequestService()

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
    submitMaterialReceiptForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const row = await service.getById(id)
      if (!row || (row as any).deletedAt) throw new GraphQLAuthError('Material receipt not found')
      const ctxOrg = ctx.user?.organizationId
      if (ctxOrg == null || String(ctxOrg) !== String((row as any).organizationId)) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfigured(String((row as any).organizationId), MODULE_KEY_PURCHASES)
      await service.submitForOrgApproval(id, ctx.user!.id)
      await approvalService.enqueueMaterialReceiptSubmitted(id, ctx.user!.id)
      return service.getById(id)
    },
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
