import { QuotationService } from './service'
import { Quotation } from './model'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_QUOTATIONS } from '../approval-request/service'

const service = new QuotationService()
const approvalService = new ApprovalRequestService()

export const resolvers = {
  Query: {
    quotation: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getQuotationById(id)
      if (!doc) return null
      return Quotation.populate(doc, { path: 'clientId', select: 'id name email' })
    },

    quotations: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, status } = args
      const filter: any = {}
      if (organizationId) filter.organizationId = organizationId
      if (status) filter.status = status
      const data = await service.getAllQuotations(filter, page, limit)
      return Quotation.populate(data, { path: 'clientId', select: 'id name email' })
    },

    quotationsByOrganization: async (_: unknown, { organizationId }: { organizationId: string }) =>
      service.getQuotationsByOrganization(organizationId),

    quotationsByClient: async (_: unknown, { clientId }: { clientId: string }) =>
      service.getQuotationsByClient(clientId),

    quotationsByStatus: async (_: unknown, { status, organizationId }: { status: string; organizationId: string }) =>
      service.getQuotationsByStatus(status, organizationId),
  },

  Mutation: {
    createQuotation: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createQuotation(input, ctx.user?.id ?? ''),

    updateQuotation: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updateQuotation(id, input, ctx.user?.id ?? ''),

    deleteQuotation: async (_: unknown, { id }: { id: string }) => {
      await service.deleteQuotation(id)
      return true
    },

    submitQuotationForApproval: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const doc = await service.getQuotationById(id)
      if (!doc || doc.deletedAt) throw new GraphQLAuthError('Quotation not found')
      await approvalService.ensureApproverConfigured(String(doc.organizationId), MODULE_KEY_QUOTATIONS)
      await service.submitForApproval(id, ctx.user!.id)
      await approvalService.enqueueQuotationSubmitted(id, ctx.user!.id)
      const updated = await service.getQuotationById(id)
      return updated ? Quotation.populate(updated, { path: 'clientId', select: 'id name email' }) : updated
    },
    sendQuotation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      service.sendQuotation(id, ctx.user?.id ?? '', ctx.user?.organizationId),
  },

  Quotation: {
    clientId: (parent: any) => {
      if (parent.clientId && typeof parent.clientId === 'object') {
        return {
          id: parent.clientId._id?.toString() ?? parent.clientId.id,
          name: parent.clientId.name,
          email: parent.clientId.email,
        }
      }
      return { id: parent.clientId?.toString(), name: '', email: '' }
    },
    organizationId: (parent: any) => String(parent.organizationId?._id ?? parent.organizationId ?? ''),
    sentAt: (parent: any) => (parent.sentAt ? new Date(parent.sentAt).toISOString() : null),
    sentBy: (parent: any) => (parent.sentBy != null ? String(parent.sentBy) : null),
  },

  QuotationLineItem: {
    itemId: (parent: any) => (parent.itemId != null ? String(parent.itemId) : null),
  },
}
