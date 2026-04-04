import { loadBillToParty } from '~/lib/bill-to-party'
import { FinanceChargeAssessmentService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new FinanceChargeAssessmentService()

const toIso = (d: unknown) =>
	d instanceof Date ? d.toISOString() : d ? new Date(d as string).toISOString() : null

export const resolvers = {
	Query: {
		financeChargeAssessment: async (_: unknown, { id }: { id: string }) => service.getById(id),

		financeChargeAssessments: async (_: unknown, args: any) => {
			const { organizationId, status, page = 1, limit = 100 } = args
			const filter: Record<string, unknown> = {}
			if (status) filter.status = status
			return service.list(organizationId, filter, page, limit)
		},
	},

	Mutation: {
		draftFinanceChargeAssessment: async (_: unknown, { input }: any, ctx: GraphQLContext) =>
			service.createDraft(input, ctx.user?.id ?? ''),

		postFinanceChargeAssessment: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.post(id, ctx.user?.id ?? ''),

		cancelFinanceChargeAssessment: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.cancel(id, ctx.user?.id ?? ''),

		deleteFinanceChargeAssessment: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			await service.softDelete(id, ctx.user?.id ?? '')
			return true
		},
	},

	FinanceChargeAssessment: {
		id: (parent: any) => parent._id?.toString() ?? parent.id,
		asOfDate: (parent: any) => toIso(parent.asOfDate) ?? '',
		postedAt: (parent: any) => (parent.postedAt ? toIso(parent.postedAt) : null),
		createdAt: (parent: any) => toIso(parent.createdAt) ?? '',
		updatedAt: (parent: any) => toIso(parent.updatedAt) ?? '',
		lines: (parent: any) => parent.lines ?? [],
	},

	FinanceChargeLine: {
		invoiceId: (parent: any) =>
			parent.invoiceId?._id?.toString() ?? parent.invoiceId?.toString() ?? '',
		customerId: (parent: any) =>
			parent.customerId?._id?.toString() ?? parent.customerId?.toString() ?? '',
		customer: async (parent: any) => {
			const id =
				parent.customerId?._id?.toString() ?? parent.customerId?.toString() ?? ''
			if (!id) return null
			return loadBillToParty(id)
		},
	},
}
