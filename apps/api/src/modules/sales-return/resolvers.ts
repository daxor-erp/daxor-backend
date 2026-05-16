import { SalesReturnService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_SALES } from '../approval-request/service'

const service = new SalesReturnService()
const approvalService = new ApprovalRequestService()

export const salesreturnResolvers = {
  Query: {
    salesreturn: async (_: any, { id }: { id: string }) => {
      return service.getById(id)
    },
    salesreturns: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId)
    },
  },
  Mutation: {
    createSalesReturn: async (_: any, { input }: any, context: GraphQLContext) => {
      return service.create(input, context.user?.id || 'system')
    },
    updateSalesReturn: async (_: any, { id, input }: any) => {
      return service.update(id, input)
    },
    submitSalesReturnForApproval: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      assertAuthenticated(context)
      const row = await service.getById(id)
      if (!row || row.isDeleted) throw new GraphQLAuthError('Sales return not found')
      if (String(row.organizationId) !== String(context.user?.organizationId ?? '')) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfigured(String(row.organizationId), MODULE_KEY_SALES)
      await service.submitForOrgApproval(id)
      await approvalService.enqueueSalesReturnSubmitted(id, context.user!.id)
      return service.getById(id)
    },
    deleteSalesReturn: async (_: any, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
  },
}
