import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { EmployeeMasterService } from './service'

const service = new EmployeeMasterService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		employeeMaster: async (_: unknown, { id }: { id: string }) => service.findById(id),
		employeeMasters: async (_: unknown, { organizationId, status, department, search }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, { status, department, search })
		},
	},
	Mutation: {
		createEmployeeMaster: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateEmployeeMaster: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Employee not found')
			return updated
		},
		deleteEmployeeMaster: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Employee not found')
			return deleted
		},
	},
	EmployeeMaster: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		userId: (p: any) => (p.userId != null ? String(p.userId) : null),
		reportsToUserId: (p: any) => (p.reportsToUserId != null ? String(p.reportsToUserId) : null),
		shiftMasterId: (p: any) => (p.shiftMasterId != null ? String(p.shiftMasterId) : null),
		dateOfBirth: (p: any) => iso(p.dateOfBirth),
		dateOfJoining: (p: any) => iso(p.dateOfJoining) ?? '',
		dateOfConfirmation: (p: any) => iso(p.dateOfConfirmation),
		dateOfRelieving: (p: any) => iso(p.dateOfRelieving),
		basicSalary: (p: any) => Number(p.basicSalary ?? 0),
		currency: (p: any) => p.currency ?? 'INR',
		status: (p: any) => p.status ?? 'ACTIVE',
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
