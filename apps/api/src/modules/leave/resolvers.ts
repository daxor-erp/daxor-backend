import { LeaveService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new LeaveService()

function assertOrg(inputOrg: string, ctx: GraphQLContext) {
	if (ctx.user?.organizationId && inputOrg !== ctx.user.organizationId) {
		throw new Error('Organization mismatch')
	}
}

export const resolvers = {
	Query: {
		leaveType: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.findLeaveTypeById(id)
			if (!doc || doc.deletedAt) return null
			return doc
		},
		leaveTypes: async (_: unknown, { organizationId, activeOnly }: { organizationId: string; activeOnly?: boolean }) =>
			service.listLeaveTypes(organizationId, activeOnly),

		leaveEnrollment: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.findEnrollmentById(id)
			if (!doc || doc.deletedAt) return null
			return doc
		},
		leaveEnrollments: async (
			_: unknown,
			{ organizationId, userId, calendarYear }: { organizationId: string; userId?: string; calendarYear?: number },
		) => service.listEnrollments(organizationId, userId, calendarYear),

		leaveApplication: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.findApplicationById(id)
			if (!doc || doc.deletedAt) return null
			return doc
		},
		leaveApplications: async (
			_: unknown,
			{ organizationId, userId, status }: { organizationId: string; userId?: string; status?: string },
		) => service.listApplications(organizationId, userId, status),

		leaveReinstatement: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.findReinstatementById(id)
			if (!doc || doc.deletedAt) return null
			return doc
		},
		leaveReinstatements: async (
			_: unknown,
			{ organizationId, userId, status }: { organizationId: string; userId?: string; status?: string },
		) => service.listReinstatements(organizationId, userId, status),
	},

	Mutation: {
		createLeaveType: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertOrg(input.organizationId, ctx)
			return service.createLeaveType(input)
		},
		updateLeaveType: async (_: unknown, { id, input }: any) => service.updateLeaveType(id, input),
		deleteLeaveType: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.softDeleteLeaveType(id)
			if (!doc) throw new Error('Leave type not found')
			return doc
		},

		createLeaveEnrollment: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertOrg(input.organizationId, ctx)
			return service.createLeaveEnrollment(input)
		},
		updateLeaveEnrollment: async (_: unknown, { id, input }: any) => service.updateLeaveEnrollment(id, input),
		deleteLeaveEnrollment: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.softDeleteLeaveEnrollment(id)
			if (!doc) throw new Error('Enrollment not found')
			return doc
		},

		createLeaveApplication: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertOrg(input.organizationId, ctx)
			return service.createLeaveApplication(input)
		},
		updateLeaveApplication: async (_: unknown, { id, input }: any) => service.updateLeaveApplication(id, input),
		deleteLeaveApplication: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.softDeleteLeaveApplication(id)
			if (!doc) throw new Error('Application not found')
			return doc
		},
		approveLeaveApplication: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.approveLeaveApplication(id, ctx.user?.id),
		rejectLeaveApplication: async (_: unknown, { id, reason }: { id: string; reason: string }) =>
			service.rejectLeaveApplication(id, reason),

		createLeaveReinstatement: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
			assertOrg(input.organizationId, ctx)
			return service.createLeaveReinstatement(input)
		},
		updateLeaveReinstatement: async (_: unknown, { id, input }: any) => service.updateLeaveReinstatement(id, input),
		approveLeaveReinstatement: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
			service.approveLeaveReinstatement(id, ctx.user?.id),
		rejectLeaveReinstatement: async (_: unknown, { id, reviewNotes }: { id: string; reviewNotes?: string }) =>
			service.rejectLeaveReinstatement(id, reviewNotes),
		deleteLeaveReinstatement: async (_: unknown, { id }: { id: string }) => {
			const doc = await service.softDeleteLeaveReinstatement(id)
			if (!doc) throw new Error('Reinstatement not found')
			return doc
		},
	},

	LeaveType: {
		id: (p: any) => p.id ?? p._id?.toString(),
		organizationId: (p: any) => p.organizationId?.toString?.() ?? String(p.organizationId),
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},

	LeaveEnrollment: {
		id: (p: any) => p.id ?? p._id?.toString(),
		userId: (p: any) => p.userId?.toString?.() ?? String(p.userId),
		leaveTypeId: (p: any) => p.leaveTypeId?.toString?.() ?? String(p.leaveTypeId),
		organizationId: (p: any) => p.organizationId?.toString?.() ?? String(p.organizationId),
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},

	LeaveApplication: {
		id: (p: any) => p.id ?? p._id?.toString(),
		userId: (p: any) => p.userId?.toString?.() ?? String(p.userId),
		leaveTypeId: (p: any) => p.leaveTypeId?.toString?.() ?? String(p.leaveTypeId),
		startDate: (p: any) => (p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : ''),
		endDate: (p: any) => (p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : ''),
		organizationId: (p: any) => p.organizationId?.toString?.() ?? String(p.organizationId),
		approvedBy: (p: any) => (p.approvedBy != null ? p.approvedBy.toString() : null),
		approvedAt: (p: any) => (p.approvedAt ? new Date(p.approvedAt).toISOString() : null),
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},

	LeaveReinstatement: {
		id: (p: any) => p.id ?? p._id?.toString(),
		userId: (p: any) => p.userId?.toString?.() ?? String(p.userId),
		leaveTypeId: (p: any) => p.leaveTypeId?.toString?.() ?? String(p.leaveTypeId),
		leaveApplicationId: (p: any) =>
			p.leaveApplicationId != null ? p.leaveApplicationId.toString() : null,
		organizationId: (p: any) => p.organizationId?.toString?.() ?? String(p.organizationId),
		reviewedBy: (p: any) => (p.reviewedBy != null ? p.reviewedBy.toString() : null),
		reviewedAt: (p: any) => (p.reviewedAt ? new Date(p.reviewedAt).toISOString() : null),
		createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : ''),
		updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : ''),
	},
}
