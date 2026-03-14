import type { GraphQLContext } from '~/types/graphql.context'
import { RoleService } from './service'
import { requireAuth, requirePermission } from '~/middlewares/rbac.middleware'
import { RESOURCES, ACTIONS } from './permissions'

const roleService = new RoleService()

export const roleResolvers = {
  Query: {
    role: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requirePermission(context, RESOURCES.ROLE, ACTIONS.READ)
      return roleService.getRoleById(id)
    },
    
    roles: async (_: any, __: any, context: GraphQLContext) => {
      requirePermission(context, RESOURCES.ROLE, ACTIONS.READ)
      return roleService.getAllRoles()
    },
    
    rolesByOrganization: async (_: any, { organizationId }: { organizationId: string }, context: GraphQLContext) => {
      requirePermission(context, RESOURCES.ROLE, ACTIONS.READ)
      return roleService.getRolesByOrganization(organizationId)
    },
    
    systemRoles: async (_: any, __: any, context: GraphQLContext) => {
      requireAuth(context)
      return roleService.getSystemRoles()
    },
  },
  
  Mutation: {
    createRole: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      const user = requirePermission(context, RESOURCES.ROLE, ACTIONS.CREATE)
      return roleService.createRole(input, user.id)
    },
    
    updateRole: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      const user = requirePermission(context, RESOURCES.ROLE, ACTIONS.UPDATE)
      return roleService.updateRole(id, input, user.id)
    },
    
    deleteRole: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const user = requirePermission(context, RESOURCES.ROLE, ACTIONS.DELETE)
      await roleService.deleteRole(id, user.id)
      return true
    },
    
    seedSystemRoles: async (_: any, __: any, context: GraphQLContext) => {
      requirePermission(context, RESOURCES.ROLE, ACTIONS.CREATE)
      return roleService.seedSystemRoles()
    },
  },
  
  Role: {
    id: (parent: any) => parent._id || parent.id,
  },
}
