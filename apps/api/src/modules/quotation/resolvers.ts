import { QuotationService } from './service'
import { Quotation } from './model'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_QUOTATIONS } from '../approval-request/service'
import { QUOTATION_PARTY_POPULATE, mapPartyRef } from './party'

const service = new QuotationService()
const approvalService = new ApprovalRequestService()

async function withPartyPopulated(doc: unknown) {
  if (!doc) return doc
  return Quotation.populate(doc, [...QUOTATION_PARTY_POPULATE])
}

export const resolvers = {
  Query: {
    quotation: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getQuotationById(id)
      if (!doc) return null
      return withPartyPopulated(doc)
    },

    quotations: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, status } = args
      const filter: any = {}
      if (organizationId) filter.organizationId = organizationId
      if (status) filter.status = status
      const data = await service.getAllQuotations(filter, page, limit)
      return withPartyPopulated(data)
    },

    quotationsByOrganization: async (_: unknown, { organizationId }: { organizationId: string }) =>
      withPartyPopulated(await service.getQuotationsByOrganization(organizationId)),

    quotationsByClient: async (_: unknown, { clientId }: { clientId: string }) =>
      withPartyPopulated(await service.getQuotationsByClient(clientId)),

    quotationsByCustomer: async (_: unknown, { customerId }: { customerId: string }) =>
      withPartyPopulated(await service.getQuotationsByClient(customerId)),

    quotationsByStatus: async (_: unknown, { status, organizationId }: { status: string; organizationId: string }) =>
      withPartyPopulated(await service.getQuotationsByStatus(status, organizationId)),
  },

  Mutation: {
    createQuotation: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      const created = await service.createQuotation(input, ctx.user?.id ?? '')
      return withPartyPopulated(created)
    },

    updateQuotation: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
      const updated = await service.updateQuotation(id, input, ctx.user?.id ?? '')
      return withPartyPopulated(updated)
    },

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
      return updated ? withPartyPopulated(updated) : updated
    },
    sendQuotation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const result = await service.sendQuotation(
        id,
        ctx.user?.id ?? '',
        ctx.user?.organizationId ?? undefined,
      )
      return {
        ...result,
        quotation: await withPartyPopulated(result.quotation),
      }
    },
  },

  Quotation: {
    customerId: (parent: any) => mapPartyRef(parent),
    clientId: (parent: any) => mapPartyRef(parent),
    organizationId: (parent: any) => String(parent.organizationId?._id ?? parent.organizationId ?? ''),
    sentAt: (parent: any) => (parent.sentAt ? new Date(parent.sentAt).toISOString() : null),
    sentBy: (parent: any) => (parent.sentBy != null ? String(parent.sentBy) : null),
  },

  QuotationLineItem: {
    itemId: (parent: any) => (parent.itemId != null ? String(parent.itemId) : null),
  },
}
