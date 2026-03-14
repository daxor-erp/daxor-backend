import { EPMService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { EPMRepository } from './repository'

const epmRepo = new EPMRepository()
const epmService = new EPMService(epmRepo)

export const resolvers = {
	Query: {
		epm: async (_: unknown, { id }: { id: string }) => epmService.findById(id),
		epms: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.status = status
			return epmService.findAll(filter, page, limit)
		},
	},
	Mutation: {
		createEPM: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			epmService.create({ ...input, reviewerId: ctx.user?.id }),
		updateEPM: async (_: unknown, { id, input }: any) => 
			epmService.update(id, input),
		deleteEPM: async (_: unknown, { id }: { id: string }) => 
			epmService.delete(id),
	},
}
