import { ApplicantService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { ApplicantRepository } from './repository'

const applicantRepo = new ApplicantRepository()
const applicantService = new ApplicantService(applicantRepo)

export const resolvers = {
	Query: {
		applicant: async (_: unknown, { id }: { id: string }) => applicantService.findById(id),
		applicants: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, status } = args
			const filter: any = { organizationId, isDeleted: false }
			if (status) filter.applicationStatus = status
			return applicantService.findAll(filter, page, limit)
		},
	},
	Mutation: {
		createApplicant: async (_: unknown, { input }: any) => 
			applicantService.create(input),
		updateApplicant: async (_: unknown, { id, input }: any) => 
			applicantService.update(id, input),
		deleteApplicant: async (_: unknown, { id }: { id: string }) => 
			applicantService.delete(id),
	},
}
