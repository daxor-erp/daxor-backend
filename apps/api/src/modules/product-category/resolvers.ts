import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ProductCategoryService } from './service'

const service = new ProductCategoryService()

export const resolvers = {
	Query: {
		productCategory: async (_: unknown, { id }: { id: string }) => service.findById(id),
		productCategories: async (_: unknown, { organizationId, isActive }: any) =>
			service.list(organizationId, isActive),
	},
	Mutation: {
		createProductCategory: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateProductCategory: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Category not found')
			return updated
		},
		deleteProductCategory: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Category not found')
			return true
		},
	},
	ProductCategory: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		parentId: (p: any) => (p.parentId != null ? String(p.parentId) : null),
		fullPath: (p: any) => p.fullPath ?? p.name,
		isActive: (p: any) => p.isActive !== false,
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
