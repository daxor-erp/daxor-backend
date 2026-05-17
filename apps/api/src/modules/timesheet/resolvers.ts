import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated } from '../auth/authz'
import { TimesheetService } from './service'

const service = new TimesheetService()

function iso(d: unknown): string | null {
	if (d == null) return null
	const t = new Date(d as string | number | Date).getTime()
	if (Number.isNaN(t)) return null
	return new Date(t).toISOString()
}

export const resolvers = {
	Query: {
		timesheetEntry: async (_: unknown, { id }: { id: string }) => service.findById(id),
		timesheetEntries: async (
			_: unknown,
			{ organizationId, employeeUserId, projectId, status, startDate, endDate, billable }: any,
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.list(organizationId, {
				employeeUserId,
				projectId,
				status,
				startDate,
				endDate,
				billable: typeof billable === 'boolean' ? billable : undefined,
			})
		},
		timesheetWeeklySummary: async (
			_: unknown,
			{ organizationId, employeeUserId, weekStart, weekEnd }: any,
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			return service.weeklySummary(organizationId, employeeUserId, new Date(weekStart), new Date(weekEnd))
		},
	},
	Mutation: {
		createTimesheetEntry: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.create(input)
		},
		updateTimesheetEntry: async (_: unknown, { id, input }: any, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const updated = await service.update(id, input)
			if (!updated) throw new GraphQLValidationError('Timesheet entry not found')
			return updated
		},
		deleteTimesheetEntry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			const deleted = await service.softDelete(id)
			if (!deleted) throw new GraphQLValidationError('Timesheet entry not found')
			return deleted
		},
		submitTimesheetEntry: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
			assertAuthenticated(ctx)
			return service.submit(id, ctx.user!.id)
		},
		resolveTimesheetEntry: async (
			_: unknown,
			{ id, decision, reason }: { id: string; decision: string; reason?: string },
			ctx: GraphQLContext,
		) => {
			assertAuthenticated(ctx)
			const d = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED'
			return service.resolve(id, d, ctx.user!.id, reason ?? undefined)
		},
	},
	TimesheetEntry: {
		id: (p: any) => String(p?._id ?? p?.id ?? ''),
		organizationId: (p: any) => String(p.organizationId ?? ''),
		employeeUserId: (p: any) => String(p.employeeUserId ?? ''),
		projectId: (p: any) => (p.projectId != null ? String(p.projectId) : null),
		workOrderId: (p: any) => (p.workOrderId != null ? String(p.workOrderId) : null),
		approvedByUserId: (p: any) => (p.approvedByUserId != null ? String(p.approvedByUserId) : null),
		billable: (p: any) => !!p.billable,
		billRate: (p: any) => Number(p.billRate ?? 0),
		costRate: (p: any) => Number(p.costRate ?? 0),
		status: (p: any) => p.status ?? 'DRAFT',
		entryDate: (p: any) => iso(p.entryDate) ?? '',
		submittedAt: (p: any) => iso(p.submittedAt),
		approvedAt: (p: any) => iso(p.approvedAt),
		createdAt: (p: any) => iso(p.createdAt) ?? '',
		updatedAt: (p: any) => iso(p.updatedAt) ?? '',
	},
}
