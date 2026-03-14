import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '~/types/graphql.context'
import { hasPermission } from '~/modules/role/permissions'

export const requireAuth = (context: GraphQLContext) => {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    })
  }
  return context.user
}

export const requirePermission = (
  context: GraphQLContext,
  resource: string,
  action: string
) => {
  const user = requireAuth(context)
  
  if (!user.roles || user.roles.length === 0) {
    throw new GraphQLError('No roles assigned', {
      extensions: { code: 'FORBIDDEN' }
    })
  }
  
  if (!hasPermission(user.roles, resource, action)) {
    throw new GraphQLError(`Permission denied: ${action} on ${resource}`, {
      extensions: { code: 'FORBIDDEN' }
    })
  }
  
  return user
}

export const checkPermission = (
  context: GraphQLContext,
  resource: string,
  action: string
): boolean => {
  if (!context.user || !context.user.roles) return false
  return hasPermission(context.user.roles, resource, action)
}
