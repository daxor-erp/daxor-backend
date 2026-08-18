import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { TagService } from './service'

const service = new TagService()

export const resolvers = {
	Query: {
		tag: async (_: unknown, { id }: { id: string }) => service.findById(id),
		tags: async (_: unknown, args: any) => {
			const { organizationId, search, category, isActive } = args
			return service.list(organizationId, { search, category, isActive })
		},
	},
	Mutation: {
		createTag: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateTag: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Tag not found')
			return updated
		},
		deleteTag: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Tag not found')
			return true
		},
	},
	Tag: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		color: (p: any) => p.color ?? '#94a3b8',
		isActive: (p: any) => p.isActive !== false,
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
