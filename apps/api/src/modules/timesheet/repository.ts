import { MongoBaseRepository } from '../base/mongo-repository'
import { TimesheetEntry } from './model'

export class TimesheetRepository extends MongoBaseRepository<any> {
	constructor() {
		super(TimesheetEntry)
	}

	async list(
		organizationId: string,
		filters: {
			employeeUserId?: string
			projectId?: string
			status?: string
			startDate?: string | Date
			endDate?: string | Date
			billable?: boolean
		} = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.employeeUserId) q.employeeUserId = filters.employeeUserId
		if (filters.projectId) q.projectId = filters.projectId
		if (filters.status) q.status = filters.status
		if (typeof filters.billable === 'boolean') q.billable = filters.billable
		if (filters.startDate || filters.endDate) {
			const range: Record<string, unknown> = {}
			if (filters.startDate) range.$gte = new Date(filters.startDate)
			if (filters.endDate) range.$lte = new Date(filters.endDate)
			q.entryDate = range
		}
		return this.model.find(q).sort({ entryDate: -1, createdAt: -1 }).limit(1000).exec()
	}

	async weeklySummary(
		organizationId: string,
		employeeUserId: string,
		weekStart: Date,
		weekEnd: Date,
	): Promise<{ totalHours: number; billableHours: number; approvedHours: number; pending: number; draft: number }> {
		const rows = await this.model
			.find({
				organizationId,
				employeeUserId,
				deletedAt: null,
				entryDate: { $gte: weekStart, $lte: weekEnd },
			})
			.exec()
		const totals = rows.reduce(
			(s, r: any) => {
				s.totalHours += Number(r.hours ?? 0)
				if (r.billable) s.billableHours += Number(r.hours ?? 0)
				if (r.status === 'APPROVED') s.approvedHours += Number(r.hours ?? 0)
				if (r.status === 'SUBMITTED') s.pending += Number(r.hours ?? 0)
				if (r.status === 'DRAFT') s.draft += Number(r.hours ?? 0)
				return s
			},
			{ totalHours: 0, billableHours: 0, approvedHours: 0, pending: 0, draft: 0 },
		)
		return totals
	}
}
