import type { GraphQLContext } from '~/types/graphql.context'
import { QuotationService } from './service'
import { ClientService } from '../client/service'
import { requireAuth } from '~/middlewares/rbac.middleware'

const quotationService = new QuotationService()
const clientService = new ClientService()

export const resolvers = {
  Query: {
    quotation: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      return quotationService.getQuotationById(id)
    },
    
    quotations: async (_: any, __: any, context: GraphQLContext) => {
      return quotationService.getAllQuotations()
    },
    
    quotationsByOrganization: async (_: any, { organizationId }: { organizationId: string }, context: GraphQLContext) => {
      requireAuth(context)
      return quotationService.getQuotationsByOrganization(organizationId)
    },
    
    quotationsByClient: async (_: any, { clientId }: { clientId: string }, context: GraphQLContext) => {
      requireAuth(context)
      return quotationService.getQuotationsByClient(clientId)
    },
    
    quotationsByStatus: async (_: any, { status, organizationId }: { status: string; organizationId: string }, context: GraphQLContext) => {
      requireAuth(context)
      return quotationService.getQuotationsByStatus(status, organizationId)
    },
  },
  
  Mutation: {
    createQuotation: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      const userId = context.user?.id || '000000000000000000000000'
      return quotationService.createQuotation(input, userId)
    },
    
    updateQuotation: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      const userId = context.user?.id || '000000000000000000000000'
      return quotationService.updateQuotation(id, input, userId)
    },
    
    deleteQuotation: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      await quotationService.deleteQuotation(id)
      return true
    },
    
    sendQuotation: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const userId = context.user?.id || '000000000000000000000000'
      return quotationService.sendQuotation(id, userId)
    },
  },
  
  Quotation: {
    id: (parent: any) => parent._id || parent.id,
    clientId: async (parent: any) => {
      if (!parent.clientId) return null
      return clientService.getClientById(parent.clientId)
    },
  },
}
