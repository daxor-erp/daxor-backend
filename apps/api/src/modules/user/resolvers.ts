import { UserService } from './service'
import { AuditLogService } from '../audit-log/service'
import type { GraphQLContext } from '~/types/graphql.context'

const userService = new UserService()
const auditService = new AuditLogService()

export const resolvers = {
	Query: {
		user: async (_: unknown, { id }: { id: string }) => userService.findById(id),
		userByEmail: async (_: unknown, { email }: { email: string }) => userService.findByEmail(email),
		usersByRole: async (_: unknown, { role }: { role: string }) => userService.findByRole(role),
		usersByOrganization: async (_: unknown, args: any) => {
			const { organizationId, page = 1, limit = 10, type, status, search } = args
			const filter: any = { organizationId, deletedAt: null }
			if (type) filter.userType = type
			if (status) filter.status = status
			if (search) filter.$or = [
				{ email: { $regex: search, $options: 'i' } },
				{ firstName: { $regex: search, $options: 'i' } },
				{ lastName: { $regex: search, $options: 'i' } }
			]
			const result = await userService.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
			return { users: result.data, total: result.total, page, limit }
		},
	},
	Mutation: {
		createUser: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			const user = await userService.createUser(input, ctx.user?.id)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'create',
				entityType: 'User',
				entityId: user._id,
				newValues: { email: user.email, firstName: user.firstName }
			})
			return user
		},
		updateUser: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			const user = await userService.updateUser(id, input, ctx.user?.id)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'update',
				entityType: 'User',
				entityId: user._id,
				newValues: input
			})
			return user
		},
		deleteUser: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			const user = await userService.softDeleteUser(id, ctx.user?.id)
			await auditService.create({
				userId: ctx.user?.id,
				action: 'delete',
				entityType: 'User',
				entityId: user._id
			})
			return user
		},
	},
}
