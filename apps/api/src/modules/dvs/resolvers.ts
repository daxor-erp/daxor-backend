import { DVSService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { DVSRepository } from './repository'

const dvsRepo = new DVSRepository()
const dvsService = new DVSService(dvsRepo)

export const resolvers = {
	Query: {
		dvs: async (_: unknown, { id }: { id: string }) => dvsService.findById(id),
		dvsRecords: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.verificationStatus = status
			return dvsService.findAll(filter, page, limit)
		},
	},
	Mutation: {
		createDVS: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			dvsService.create(input),
		updateDVS: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => 
			dvsService.update(id, { ...input, verifiedBy: ctx.user?.id }),
		deleteDVS: async (_: unknown, { id }: { id: string }) => 
			dvsService.delete(id),
	},
}
