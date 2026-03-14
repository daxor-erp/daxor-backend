import type { GraphQLContext } from '~/types/graphql.context'
import { ClientService } from './service'
import { requireAuth } from '~/middlewares/rbac.middleware'

const clientService = new ClientService()

export const resolvers = {
  Query: {
    client: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireAuth(context)
      return clientService.getClientById(id)
    },
    
    clients: async (_: any, __: any, context: GraphQLContext) => {
      // Remove auth requirement for testing
      return clientService.getAllClients()
    },
    
    clientsByOrganization: async (_: any, { organizationId }: { organizationId: string }, context: GraphQLContext) => {
      requireAuth(context)
      return clientService.getClientsByOrganization(organizationId)
    },
    
    clientsByStatus: async (_: any, { status, organizationId }: { status: string; organizationId: string }, context: GraphQLContext) => {
      requireAuth(context)
      return clientService.getClientsByStatus(status, organizationId)
    },
  },
  
  Mutation: {
    createClient: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      try {
        const userId = context.user?.id || '000000000000000000000000'
        const result = await clientService.createClient(input, userId)
        return result
      } catch (error: any) {
        console.error('Error creating client:', error.message)
        throw new Error(`Failed to create client: ${error.message}`)
      }
    },
    
    updateClient: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      const user = requireAuth(context)
      return clientService.updateClient(id, input, user.id)
    },
    
    deleteClient: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireAuth(context)
      await clientService.deleteClient(id)
      return true
    },
  },
  
  Client: {
    id: (parent: any) => parent._id || parent.id,
  },
}
