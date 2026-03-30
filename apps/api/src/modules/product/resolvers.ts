import type { GraphQLContext } from '~/types/graphql.context'
import { ProductService } from './service'

const productService = new ProductService()

export const resolvers = {
  Query: {
    product: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      return productService.getProductById(id)
    },
    
    products: async (_: any, __: any, context: GraphQLContext) => {
      return productService.getAllProducts()
    },
    
    productsByOrganization: async (_: any, { organizationId }: { organizationId: string }, context: GraphQLContext) => {
      return productService.getProductsByOrganization(organizationId)
    },
    
    productsByCategory: async (_: any, { category, organizationId }: { category: string; organizationId: string }, context: GraphQLContext) => {
      return productService.getProductsByCategory(category, organizationId)
    },
    
    productsByStatus: async (_: any, { status, organizationId }: { status: string; organizationId: string }, context: GraphQLContext) => {
      return productService.getProductsByStatus(status, organizationId)
    },
  },
  
  Mutation: {
    createProduct: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      const userId = context.user?.id || '000000000000000000000000'
      return productService.createProduct(input, userId)
    },
    
    updateProduct: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      const userId = context.user?.id || '000000000000000000000000'
      return productService.updateProduct(id, input, userId)
    },
    
    deleteProduct: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      await productService.deleteProduct(id)
      return true
    },
  },
  
  Product: {
    id: (parent: any) => parent._id || parent.id,
  },
}
