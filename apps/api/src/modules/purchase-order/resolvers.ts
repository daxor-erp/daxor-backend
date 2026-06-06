import { PurchaseOrderService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated, isOrgAdmin } from '../auth/authz'
import { ApprovalRequestService, APPROVAL_ENTITY_PURCHASE_ORDER } from '../approval-request/service'

const service = new PurchaseOrderService()
const approvalService = new ApprovalRequestService()

export const resolvers = {
  Query: {
    purchaseorder: (_: unknown, { id }: { id: string }) => service.findById(id),
    purchaseorders: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, status } = args
      const filter: any = { organizationId, deletedAt: null }
      if (status) filter.status = status
      const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
      return result.data
    },
  },
  Mutation: {
    createPurchaseOrder: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.create(input, ctx.user?.id ?? ''),

    createPurchaseRequisition: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const orgId = ctx.user?.organizationId
      if (orgId == null || String(orgId) === '') {
        throw new GraphQLAuthError('Organization context required')
      }
      if (String(input.organizationId) !== String(orgId)) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfiguredForPurchases(String(orgId))
      const created = await service.create(input, ctx.user!.id)
      const poId = String(created._id ?? created.id)
      await service.submit(poId, ctx.user!.id)
      await approvalService.enqueuePurchaseOrderSubmitted(poId, ctx.user!.id)
      return service.findById(poId)
    },

    updatePurchaseOrder: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.update(id, input, ctx.user?.id),
    deletePurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.softDelete(id, ctx.user?.id ?? '')
      return true
    },
    submitPurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const poBefore = await service.findById(id)
      if (!poBefore || poBefore.deletedAt) throw new GraphQLAuthError('Purchase order not found')
      await approvalService.ensureApproverConfiguredForPurchases(String(poBefore.organizationId))
      const submitted = await service.submit(id, ctx.user!.id)
      await approvalService.enqueuePurchaseOrderSubmitted(id, ctx.user!.id)
      return submitted
    },
    approvePurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const pending = await approvalService.findPendingByEntity(APPROVAL_ENTITY_PURCHASE_ORDER, id)
      if (pending) {
        const isAssignee = String(pending.assigneeApproverUserId) === String(ctx.user!.id)
        if (!isAssignee && !isOrgAdmin(ctx)) {
          throw new GraphQLAuthError(
            'Only the designated approver (or organization admin) can approve this PO.',
          )
        }
      }
      return service.approve(id, ctx.user!.id)
    },
    receivePurchaseOrder: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      service.receive(id, ctx.user?.id ?? ''),
    billPurchaseOrder: (_: unknown, { id, billDate, dueDate }: any, ctx: GraphQLContext) =>
      service.billPurchaseOrder(id, billDate, dueDate, ctx.user?.id ?? ''),
  },
  PurchaseOrder: {
    id: (p: any) => p._id || p.id,
    orderDate: (p: any) => p.orderDate ? new Date(p.orderDate).toISOString() : new Date().toISOString(),
    deliveryDate: (p: any) => p.deliveryDate ? new Date(p.deliveryDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    updatedAt: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    vendorId: (p: any) => {
      if (!p.vendorId) return null
      return typeof p.vendorId === 'object' ? (p.vendorId._id?.toString() ?? p.vendorId.id) : p.vendorId?.toString()
    },
    vendor: (p: any) => {
      if (!p.vendorId) return null
      return typeof p.vendorId === 'object' ? p.vendorId : null
    },
    projectId: (p: any) => {
      if (!p.projectId) return null
      return typeof p.projectId === 'object' ? (p.projectId._id?.toString() ?? p.projectId.id) : p.projectId?.toString()
    },
    // Resolve vendorName/projectName from populated object or stored denormalized value
    vendorName: (p: any) => {
      if (typeof p.vendorId === 'object' && p.vendorId?.name) return p.vendorId.name
      return p.vendorName || null
    },
    projectName: (p: any) => {
      if (typeof p.projectId === 'object' && p.projectId?.name) return p.projectId.name
      return p.projectName || null
    },
    items: (p: any) => p.items ?? [],
    subtotal: (p: any) => p.subtotal ?? 0,
    totalAmount: (p: any) => p.totalAmount ?? 0,
  },
}
