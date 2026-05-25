import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '~/types/graphql.context'
import { ROLES } from '~/modules/role/permissions'

export const requireAuth = (context: GraphQLContext) => {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    })
  }
  return context.user
}

function userHasResourceAction(
  user: NonNullable<GraphQLContext['user']>,
  resource: string,
  action: string,
): boolean {
  if (!user.roles?.length) return false
  if (user.roles.includes(ROLES.SUPER_ADMIN)) return true
  const rows = user.rbacPermissions
  if (!rows?.length) return false
  for (const p of rows) {
    if (p.resource === resource && p.actions.includes(action)) return true
  }
  return false
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
  
  if (!userHasResourceAction(user, resource, action)) {
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
  return userHasResourceAction(context.user, resource, action)
}
