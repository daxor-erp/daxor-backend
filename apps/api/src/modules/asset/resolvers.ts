import { AssetService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { AssetRepository } from './repository'

const assetRepo = new AssetRepository()
const assetService = new AssetService(assetRepo)

export const resolvers = {
	Query: {
		asset: async (_: unknown, { id }: { id: string }) => assetService.findById(id),
		assets: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.status = status
			return assetService.findAll(filter, page, limit)
		},
	},
	Mutation: {
		createAsset: async (_: unknown, { input }: any) => 
			assetService.create(input),
		updateAsset: async (_: unknown, { id, input }: any) => 
			assetService.update(id, input),
		deleteAsset: async (_: unknown, { id }: { id: string }) => 
			assetService.delete(id),
	},
}
