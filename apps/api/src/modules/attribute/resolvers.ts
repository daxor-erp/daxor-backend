import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { AttributeService } from './service'

const service = new AttributeService()

export const resolvers = {
	Query: {
		attribute: async (_: unknown, { id }: { id: string }) => service.findById(id),
		attributes: async (_: unknown, { organizationId, isActive }: any) => service.list(organizationId, isActive),
	},
	Mutation: {
		createAttribute: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateAttribute: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Attribute not found')
			return updated
		},
		addAttributeValue: async (_: unknown, { id, value }: { id: string; value: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.addValue(id, value)
		},
		deleteAttribute: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Attribute not found')
			return true
		},
	},
	Attribute: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		values: (p: any) => (p.values ?? []).map((v: any) => ({ id: String(v._id ?? ''), value: v.value })),
		isActive: (p: any) => p.isActive !== false,
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
