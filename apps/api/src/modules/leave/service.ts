import { GraphQLValidationError } from '@repo/errors'
import {
	LeaveApplicationRepository,
	LeaveEnrollmentRepository,
	LeaveReinstatementRepository,
	LeaveTypeRepository,
} from './repository'

function inclusiveCalendarDays(start: Date, end: Date): number {
	const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
	const e = new Date(end.getFullYear(), end.getMonth(), end.getDate())
	if (e < s) return 0
	return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1
}

export class LeaveService {
	private types = new LeaveTypeRepository()
	private enrollments = new LeaveEnrollmentRepository()
	private applications = new LeaveApplicationRepository()
	private reinstatements = new LeaveReinstatementRepository()

	// --- Leave types ---
	async createLeaveType(data: any) {
		try {
			return await this.types.create(data)
		} catch (e: any) {
			if (e?.code === 11000) {
				throw new GraphQLValidationError('A leave type with this code already exists for the organization')
			}
			throw e
		}
	}

	async updateLeaveType(id: string, data: any) {
		return this.types.update(id, { ...data, updatedAt: new Date() })
	}

	async softDeleteLeaveType(id: string) {
		return this.types.update(id, { deletedAt: new Date() })
	}

	async findLeaveTypeById(id: string) {
		return this.types.findById(id)
	}

	async listLeaveTypes(organizationId: string, activeOnly?: boolean) {
		const filter: any = { organizationId, deletedAt: null }
		if (activeOnly) filter.active = true
		const r = await this.types.findPaginated(filter, 1, 500, { name: 1 })
		return r.data
	}

	// --- Enrollments ---
	async createLeaveEnrollment(data: any) {
		const dup = await this.enrollments.findOne({
			userId: data.userId,
			leaveTypeId: data.leaveTypeId,
			calendarYear: data.calendarYear,
			organizationId: data.organizationId,
			deletedAt: null,
		} as any)
		if (dup) {
			throw new GraphQLValidationError(
				'Enrollment already exists for this employee, leave type, and year',
			)
		}
		try {
			return await this.enrollments.create({
				...data,
				usedDays: 0,
				carriedForward: data.carriedForward ?? 0,
			})
		} catch (e: any) {
			if (e?.code === 11000) {
				throw new GraphQLValidationError(
					'Enrollment already exists for this employee, leave type, and year',
				)
			}
			throw e
		}
	}

	async updateLeaveEnrollment(id: string, data: any) {
		return this.enrollments.update(id, { ...data, updatedAt: new Date() })
	}

	async softDeleteLeaveEnrollment(id: string) {
		return this.enrollments.update(id, { deletedAt: new Date() })
	}

	async findEnrollmentById(id: string) {
		return this.enrollments.findById(id)
	}

	async listEnrollments(organizationId: string, userId?: string, calendarYear?: number) {
		const filter: any = { organizationId, deletedAt: null }
		if (userId) filter.userId = userId
		if (calendarYear != null) filter.calendarYear = calendarYear
		const r = await this.enrollments.findPaginated(filter, 1, 500, { calendarYear: -1, userId: 1 })
		return r.data
	}

	// --- Applications ---
	async createLeaveApplication(data: any) {
		const lt = await this.types.findById(data.leaveTypeId)
		if (!lt || lt.deletedAt || !lt.active) {
			throw new GraphQLValidationError('Leave type not found or inactive')
		}
		if (lt.organizationId?.toString() !== data.organizationId?.toString()) {
			throw new GraphQLValidationError('Leave type does not belong to this organization')
		}
		const start = new Date(data.startDate)
		const end = new Date(data.endDate)
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
			throw new GraphQLValidationError('Invalid dates')
		}
		if (end < start) throw new GraphQLValidationError('End date must be on or after start date')
		const totalDays = inclusiveCalendarDays(start, end)
		return this.applications.create({
			userId: data.userId,
			leaveTypeId: data.leaveTypeId,
			startDate: start,
			endDate: end,
			totalDays,
			reason: data.reason,
			organizationId: data.organizationId,
			status: 'pending',
		})
	}

	async updateLeaveApplication(id: string, data: any) {
		const existing = await this.applications.findById(id)
		if (!existing || existing.deletedAt) throw new GraphQLValidationError('Application not found')
		if (['approved', 'rejected', 'cancelled'].includes(existing.status)) {
			throw new GraphQLValidationError('Cannot edit a closed application')
		}
		const patch: any = { ...data, updatedAt: new Date() }
		if (data.startDate || data.endDate) {
			const start = new Date(data.startDate ?? existing.startDate)
			const end = new Date(data.endDate ?? existing.endDate)
			patch.startDate = start
			patch.endDate = end
			patch.totalDays = inclusiveCalendarDays(start, end)
		}
		return this.applications.update(id, patch)
	}

	async softDeleteLeaveApplication(id: string) {
		return this.applications.update(id, { deletedAt: new Date() })
	}

	async findApplicationById(id: string) {
		return this.applications.findById(id)
	}

	async listApplications(organizationId: string, userId?: string, status?: string) {
		const filter: any = { organizationId, deletedAt: null }
		if (userId) filter.userId = userId
		if (status) filter.status = status
		const r = await this.applications.findPaginated(filter, 1, 500, { createdAt: -1 })
		return r.data
	}

	async approveLeaveApplication(id: string, approverId?: string) {
		const app = await this.applications.findById(id)
		if (!app || app.deletedAt) throw new GraphQLValidationError('Application not found')
		if (app.status !== 'pending') throw new GraphQLValidationError('Only pending applications can be approved')

		const year = new Date(app.startDate).getFullYear()
		const enr = await this.enrollments.findOne({
			userId: app.userId,
			leaveTypeId: app.leaveTypeId,
			calendarYear: year,
			organizationId: app.organizationId,
			deletedAt: null,
		} as any)
		if (!enr) {
			throw new GraphQLValidationError(
				`No leave enrollment for this employee and leave type for year ${year}. Create enrollment first.`,
			)
		}
		const balance = Number(enr.entitledDays) + Number(enr.carriedForward || 0) - Number(enr.usedDays || 0)
		if (balance < Number(app.totalDays)) {
			throw new GraphQLValidationError(
				`Insufficient leave balance. Available: ${balance} day(s), requested: ${app.totalDays}`,
			)
		}

		await this.enrollments.update(enr._id.toString(), {
			usedDays: Number(enr.usedDays || 0) + Number(app.totalDays),
			updatedAt: new Date(),
		})

		return this.applications.update(id, {
			status: 'approved',
			approvedBy: approverId,
			approvedAt: new Date(),
			updatedAt: new Date(),
		})
	}

	async rejectLeaveApplication(id: string, reason: string) {
		const app = await this.applications.findById(id)
		if (!app || app.deletedAt) throw new GraphQLValidationError('Application not found')
		if (app.status !== 'pending') throw new GraphQLValidationError('Only pending applications can be rejected')
		return this.applications.update(id, {
			status: 'rejected',
			rejectedReason: reason,
			updatedAt: new Date(),
		})
	}

	// --- Reinstatement ---
	async createLeaveReinstatement(data: any) {
		if (data.daysRestored <= 0) throw new GraphQLValidationError('Days restored must be positive')
		return this.reinstatements.create({
			...data,
			leaveApplicationId: data.leaveApplicationId || undefined,
			status: 'pending',
		})
	}

	async updateLeaveReinstatement(id: string, data: any) {
		const row = await this.reinstatements.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Reinstatement not found')
		if (['approved', 'rejected'].includes(row.status)) {
			throw new GraphQLValidationError('Cannot edit a processed reinstatement')
		}
		return this.reinstatements.update(id, { ...data, updatedAt: new Date() })
	}

	async softDeleteLeaveReinstatement(id: string) {
		return this.reinstatements.update(id, { deletedAt: new Date() })
	}

	async findReinstatementById(id: string) {
		return this.reinstatements.findById(id)
	}

	async listReinstatements(organizationId: string, userId?: string, status?: string) {
		const filter: any = { organizationId, deletedAt: null }
		if (userId) filter.userId = userId
		if (status) filter.status = status
		const r = await this.reinstatements.findPaginated(filter, 1, 500, { createdAt: -1 })
		return r.data
	}

	async approveLeaveReinstatement(id: string, reviewerId?: string) {
		const row = await this.reinstatements.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Reinstatement not found')
		if (row.status !== 'pending') throw new GraphQLValidationError('Only pending reinstatements can be approved')

		const enr = await this.enrollments.findOne({
			userId: row.userId,
			leaveTypeId: row.leaveTypeId,
			calendarYear: row.calendarYear,
			organizationId: row.organizationId,
			deletedAt: null,
		} as any)
		if (!enr) {
			throw new GraphQLValidationError('No matching leave enrollment to restore balance against')
		}

		const used = Math.max(0, Number(enr.usedDays || 0) - Number(row.daysRestored))
		await this.enrollments.update(enr._id.toString(), { usedDays: used, updatedAt: new Date() })

		return this.reinstatements.update(id, {
			status: 'approved',
			reviewedBy: reviewerId,
			reviewedAt: new Date(),
			updatedAt: new Date(),
		})
	}

	async rejectLeaveReinstatement(id: string, reviewNotes?: string) {
		const row = await this.reinstatements.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Reinstatement not found')
		if (row.status !== 'pending') throw new GraphQLValidationError('Only pending reinstatements can be rejected')
		return this.reinstatements.update(id, {
			status: 'rejected',
			reviewNotes: reviewNotes ?? '',
			reviewedAt: new Date(),
			updatedAt: new Date(),
		})
	}
}
