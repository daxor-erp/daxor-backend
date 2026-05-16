import { DeliveryChallanService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ApprovalRequestService, MODULE_KEY_SALES } from '../approval-request/service'

const service = new DeliveryChallanService()
const approvalService = new ApprovalRequestService()

export const deliverychallanResolvers = {
  Query: {
    deliverychallan: async (_: any, { id }: { id: string }) => {
      return service.getById(id)
    },
    deliverychallans: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId)
    },
  },
  Mutation: {
    createDeliveryChallan: async (_: any, { input }: any, context: GraphQLContext) => {
      const created = await service.create(input, context.user?.id || 'system')
      if (!created) {
        throw new Error('Failed to create delivery challan')
      }
      return created
    },
    updateDeliveryChallan: async (_: any, { id, input }: any) => {
      return service.update(id, input)
    },
    submitDeliveryChallanForApproval: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      assertAuthenticated(context)
      const row = await service.getById(id)
      if (!row || row.isDeleted) throw new GraphQLAuthError('Delivery challan not found')
      if (String(row.organizationId) !== String(context.user?.organizationId ?? '')) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfigured(String(row.organizationId), MODULE_KEY_SALES)
      await service.submitForOrgApproval(id)
      await approvalService.enqueueDeliveryChallanSubmitted(id, context.user!.id)
      return service.getById(id)
    },
    deleteDeliveryChallan: async (_: any, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
  },
}

export const resolvers = deliverychallanResolvers
