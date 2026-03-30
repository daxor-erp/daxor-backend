import { ClientService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new ClientService()

export const resolvers = {
	Query: {
		client: async (_: unknown, { id }: { id: string }) => 
			service.findById(id),

		clients: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 100, status, search } = args
			const filter: any = {}
			if (organizationId) filter.organizationId = organizationId
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ name: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
					{ company: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findPaginated(filter, page, limit, { createdAt: -1 })
			return result.data
		},
	},

	Mutation: {
		createClient: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.create(input, ctx.user?.id),

		updateClient: async (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
			service.update(id, input),

		deleteClient: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.softDelete(id, ctx.user?.id),
	},
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
