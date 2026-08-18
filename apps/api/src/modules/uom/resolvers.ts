import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { UomService } from './service'

const service = new UomService()

export const resolvers = {
	Query: {
		uom: async (_: unknown, { id }: { id: string }) => service.findById(id),
		uoms: async (_: unknown, { organizationId, category, isActive }: any) =>
			service.list(organizationId, { category, isActive }),
	},
	Mutation: {
		createUom: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateUom: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('UoM not found')
			return updated
		},
		deleteUom: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('UoM not found')
			return true
		},
		ensureDefaultUoms: async (_: unknown, { organizationId }: { organizationId: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.ensureDefaultsForOrganization(organizationId, ctx.user?.id)
		},
	},
	Uom: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		ratio: (p: any) => p.ratio ?? 1,
		type: (p: any) => p.type ?? 'reference',
		gstUqc: (p: any) => p.gstUqc ?? '',
		isActive: (p: any) => p.isActive !== false,
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
