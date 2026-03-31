import { SalesOrderService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new SalesOrderService()

export const resolvers = {
	Query: {
		salesorder: async (_: unknown, { id }: { id: string }) => service.findById(id),
		salesorders: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (status) filter.status = status
			if (search) {
				filter.$or = [
					{ salesOrderNumber: { $regex: search, $options: 'i' } },
				]
			}
			const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return result.data
		},
	},
	Mutation: {
		createSalesOrder: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			service.create({ ...input, createdBy: ctx.user?.id }),
		updateSalesOrder: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			service.update(id, { 
				...input,
				...(input.customerId ? { clientId: input.customerId } : {}),
				updatedBy: ctx.user?.id,
			}),
		deleteSalesOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => 
			service.update(id, { deletedAt: new Date(), deletedBy: ctx.user?.id }),
	},
	SalesOrder: {
		seqNo: (parent: any) => String(parent.seqNo ?? parent.salesOrderNumber ?? parent._id ?? ''),
		customerId: (parent: any) => String(parent.customerId ?? parent.clientId ?? ''),
		clientId: (parent: any) => String(parent.clientId ?? parent.customerId ?? ''),
		organizationId: (parent: any) => String(parent.organizationId ?? ''),
		quotationId: (parent: any) => (parent.quotationId != null ? String(parent.quotationId) : null),
	},
}
