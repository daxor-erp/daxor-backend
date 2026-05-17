import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { TaxRateService } from './service'

const service = new TaxRateService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		taxRate: async (_: unknown, { id }: { id: string }) => service.findById(id),
		taxRates: async (
			_: unknown,
			{ organizationId, status, appliesTo, search }: any,
		) => service.list(organizationId, { status, appliesTo, search }),
	},
	Mutation: {
		createTaxRate: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateTaxRate: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Tax rate not found')
			return updated
		},
		deleteTaxRate: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Tax rate not found')
			return deleted
		},
	},
	TaxRate: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		taxType: (p: any) => p.taxType ?? 'GST',
		appliesTo: (p: any) => p.appliesTo ?? 'BOTH',
		isCompound: (p: any) => !!p.isCompound,
		isInclusive: (p: any) => !!p.isInclusive,
		status: (p: any) => p.status ?? 'ACTIVE',
		effectiveFrom: (p: any) => iso(p.effectiveFrom),
		effectiveTo: (p: any) => iso(p.effectiveTo),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
