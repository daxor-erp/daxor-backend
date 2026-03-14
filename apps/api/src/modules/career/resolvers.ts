import { CareerService, RecruitmentService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { CareerRepository, RecruitmentRepository } from './repository'

const careerRepo = new CareerRepository()
const recruitmentRepo = new RecruitmentRepository()
const careerService = new CareerService(careerRepo)
const recruitmentService = new RecruitmentService(recruitmentRepo)

export const resolvers = {
	Query: {
		career: async (_: unknown, { id }: { id: string }) => careerService.findById(id),
		careers: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.status = status
			return careerService.findAll(filter, page, limit)
		},
		recruitment: async (_: unknown, { id }: { id: string }) => recruitmentService.findById(id),
		recruitments: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.status = status
			return recruitmentService.findAll(filter, page, limit)
		},
	},
	Mutation: {
		createCareer: async (_: unknown, { input }: any) => 
			careerService.create(input),
		updateCareer: async (_: unknown, { id, input }: any) => 
			careerService.update(id, input),
		deleteCareer: async (_: unknown, { id }: { id: string }) => 
			careerService.delete(id),
		createRecruitment: async (_: unknown, { input }: any) => 
			recruitmentService.create(input),
		updateRecruitment: async (_: unknown, { id, input }: any) => 
			recruitmentService.update(id, input),
	},
}
