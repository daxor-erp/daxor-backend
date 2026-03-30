import { SalesQuotationService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new SalesQuotationService()

export const resolvers = {
	Query: {
		salesQuotation: async (_: unknown, { id }: { id: string }) => 
			service.findById(id),
		
		salesQuotations: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ quotationNumber: { $regex: search, $options: 'i' } },
					{ subject: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findWithPagination(filter, { 
				page, 
				limit, 
				sortBy: 'createdAt', 
				sortOrder: 'desc' 
			})
			return result.data
		},
		
		salesQuotationsByClient: async (_: unknown, { clientId }: { clientId: string }) => 
			service.findByClientId(clientId),
		
		salesQuotationsByStatus: async (_: unknown, { status }: { status: string }) => 
			service.findByStatus(status),
		
		salesQuotationsByEnquiry: async (_: unknown, { enquiryId }: { enquiryId: string }) => 
			service.findByEnquiryId(enquiryId),
	},
	
	Mutation: {
		createSalesQuotation: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.createQuotation(input, ctx.user?.id, ctx.user?.organizationId),
		
		updateSalesQuotation: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.updateQuotation(id, input),
		
		deleteSalesQuotation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.softDelete(id, ctx.user?.id),
	},
}
