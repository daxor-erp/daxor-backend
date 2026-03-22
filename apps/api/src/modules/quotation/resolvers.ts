import { QuotationService } from './service'
import { Quotation } from './model'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new QuotationService()

export const resolvers = {
	Query: {
		quotation: async (_: unknown, { id }: { id: string }) =>
			service.findById(id),

		quotations: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 100, status } = args
			const filter: any = {}
			if (organizationId) filter.organizationId = organizationId
			if (status) filter.status = status
			const result = await service.findPaginated(filter, page, limit, { createdAt: -1 })
			// Populate clientId for each quotation
			const populated = await Quotation.populate(result.data, { path: 'clientId', select: 'id name email' })
			return populated
		},

		quotationsByClient: async (_: unknown, { clientId }: { clientId: string }) => {
			const result = await service.findPaginated({ clientId }, 1, 100, { createdAt: -1 })
			return Quotation.populate(result.data, { path: 'clientId', select: 'id name email' })
		},
	},

	Mutation: {
		createQuotation: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			const doc = await service.create(input, ctx.user?.id, input.organizationId)
			return Quotation.populate(doc, { path: 'clientId', select: 'id name email' })
		},

		updateQuotation: async (_: unknown, { id, input }: any) => {
			const doc = await service.update(id, input)
			return Quotation.populate(doc, { path: 'clientId', select: 'id name email' })
		},

		deleteQuotation: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.softDelete(id, ctx.user?.id),
	},

	Quotation: {
		clientId: (parent: any) => {
			if (parent.clientId && typeof parent.clientId === 'object') {
				return {
					id: parent.clientId._id?.toString() ?? parent.clientId.id,
					name: parent.clientId.name,
					email: parent.clientId.email,
				}
			}
			return { id: parent.clientId?.toString(), name: '', email: '' }
		},
	},
}
