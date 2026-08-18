import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { ProductVariantService } from './service'

const service = new ProductVariantService()

export const resolvers = {
	Query: {
		productVariant: async (_: unknown, { id }: { id: string }) => service.findById(id),
		productVariantsByProduct: async (_: unknown, { productId }: { productId: string }) =>
			service.findByProduct(productId),
	},
	Mutation: {
		updateProductVariant: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.updateVariant(id, input)
			if (!updated) throw new GraphQLValidationError('Product variant not found')
			return updated
		},
	},
	ProductVariant: {
		id: (p: any) => String(p._id ?? p.id ?? ''),
		productId: (p: any) => String(p.productId ?? ''),
		attributeValues: (p: any) =>
			(p.attributeValues ?? []).map((v: any) => ({
				attributeId: String(v.attributeId),
				attributeName: v.attributeName,
				valueId: String(v.valueId),
				value: v.value,
			})),
		extraPrice: (p: any) => p.extraPrice ?? 0,
		isActive: (p: any) => p.isActive !== false,
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
