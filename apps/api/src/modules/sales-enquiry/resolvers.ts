import { SalesEnquiryService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new SalesEnquiryService()

export const resolvers = {
	Query: {
		salesEnquiry: async (_: unknown, { id }: { id: string }) => 
			service.findById(id),
		
		salesEnquiries: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ enquiryNumber: { $regex: search, $options: 'i' } },
					{ subject: { $regex: search, $options: 'i' } },
					{ projectType: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findPaginated(filter, page, limit, { createdAt: -1 })
			return result.data
		},
		
		salesEnquiriesByClient: async (_: unknown, { clientId }: { clientId: string }) => 
			service.findByClientId(clientId),
		
		salesEnquiriesByStatus: async (_: unknown, { status }: { status: string }) => 
			service.findByStatus(status),
		
		salesEnquiriesByAssignedTo: async (_: unknown, { userId }: { userId: string }) => 
			service.findByAssignedTo(userId),
	},
	
	Mutation: {
		createSalesEnquiry: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.createSalesEnquiry(input, ctx.user?.id, ctx.user?.organizationId),
		
		updateSalesEnquiry: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.updateSalesEnquiry(id, input),
		
		deleteSalesEnquiry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.softDelete(id, ctx.user?.id),
	},
}
