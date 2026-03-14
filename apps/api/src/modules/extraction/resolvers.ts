import { ExtractionService, RawMaterialRequisitionService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { ExtractionRepository, RawMaterialRequisitionRepository } from './repository'

const extractionRepo = new ExtractionRepository()
const requisitionRepo = new RawMaterialRequisitionRepository()
const extractionService = new ExtractionService(extractionRepo)
const requisitionService = new RawMaterialRequisitionService(requisitionRepo)

export const resolvers = {
	Query: {
		extraction: async (_: unknown, { id }: { id: string }) => extractionService.findById(id),
		extractions: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.status = status
			return extractionService.findAll(filter, page, limit)
		},
		rawMaterialRequisition: async (_: unknown, { id }: { id: string }) => requisitionService.findById(id),
		rawMaterialRequisitions: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.status = status
			return requisitionService.findAll(filter, page, limit)
		},
	},
	Mutation: {
		createExtraction: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			extractionService.create({ ...input, createdBy: ctx.user?.id }),
		updateExtraction: async (_: unknown, { id, input }: any) => 
			extractionService.update(id, input),
		deleteExtraction: async (_: unknown, { id }: { id: string }) => 
			extractionService.delete(id),
		createRawMaterialRequisition: async (_: unknown, { input }: any, ctx: GraphQLContext) => 
			requisitionService.create({ ...input, requestedBy: ctx.user?.id }),
		updateRawMaterialRequisition: async (_: unknown, { id, input }: any) => 
			requisitionService.update(id, input),
	},
}
