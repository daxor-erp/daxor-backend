import { QuotationService } from './service'
import { Quotation } from './model'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_QUOTATIONS } from '../approval-request/service'
import { QUOTATION_PARTY_POPULATE, mapPartyRef } from './party'

const service = new QuotationService()
const approvalService = new ApprovalRequestService()

async function populateParty(doc: any) {
  if (!doc) return null
  return Quotation.populate(doc, [...QUOTATION_PARTY_POPULATE, { path: 'sentBy' }])
}

async function populatePartyList(docs: any[]) {
  if (!docs?.length) return docs
  return Quotation.populate(docs, QUOTATION_PARTY_POPULATE)
}

export const resolvers = {
  Query: {
    quotation: async (_: unknown, { id }: { id: string }) => {
      const doc = await service.getQuotationById(id)
      return populateParty(doc)
    },

    quotations: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, status } = args
      const filter: any = {}
      if (organizationId) filter.organizationId = organizationId
      if (status) filter.status = status
      const data = await service.getAllQuotations(filter, page, limit)
      return populatePartyList(data)
    },

    quotationsByOrganization: async (_: unknown, { organizationId }: { organizationId: string }) =>
      service.getQuotationsByOrganization(organizationId),

    quotationsByClient: async (_: unknown, { clientId }: { clientId: string }) =>
      service.getQuotationsByClient(clientId),

    quotationsByCustomer: async (_: unknown, { customerId }: { customerId: string }) =>
      service.getQuotationsByClient(customerId),

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
      return populateParty(updated)
    },
    sendQuotation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      service.sendQuotation(id, ctx.user?.id ?? '', ctx.user?.organizationId),
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
