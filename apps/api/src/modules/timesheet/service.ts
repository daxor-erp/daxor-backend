import { GraphQLValidationError } from '@repo/errors'
import { TimesheetRepository } from './repository'
import { NotificationService } from '../notification/service'

export interface TimesheetEntryInput {
	organizationId: string
	employeeUserId: string
	projectId?: string | null
	workOrderId?: string | null
	taskName?: string
	entryDate: string | Date
	hours: number
	billable?: boolean
	billRate?: number
	costRate?: number
	notes?: string
}

export class TimesheetService {
	private repository: TimesheetRepository
	private notifications: NotificationService

	constructor() {
		this.repository = new TimesheetRepository()
		this.notifications = new NotificationService()
	}

	async create(input: TimesheetEntryInput): Promise<any> {
		this.validate(input)
		return this.repository.create({
			...input,
			entryDate: new Date(input.entryDate),
			status: 'DRAFT',
		})
	}

	async createMany(inputs: TimesheetEntryInput[]): Promise<any[]> {
		const docs: any[] = []
		for (const input of inputs) {
			this.validate(input)
			docs.push({
				...input,
				entryDate: new Date(input.entryDate),
				status: 'DRAFT',
			})
		}
		return this.repository.bulkWrite(docs.map((d) => ({ insertOne: { document: d } })))
	}

	async update(id: string, input: Partial<TimesheetEntryInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (patch.entryDate) patch.entryDate = new Date(patch.entryDate as string | Date)
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: any = {}) {
		return this.repository.list(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	async submit(id: string, submittedByUserId: string): Promise<any> {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Timesheet entry not found')
		const updated = await this.repository.update(id, {
			status: 'SUBMITTED',
			submittedAt: new Date(),
		} as any)

		// Best-effort notification to the requester confirming submission
		try {
			await this.notifications.notify({
				organizationId: String(row.organizationId),
				recipientUserId: submittedByUserId,
				kind: 'SYSTEM',
				severity: 'INFO',
				title: 'Timesheet submitted',
				message: `Your timesheet for ${new Date(row.entryDate).toLocaleDateString()} (${row.hours}h) is awaiting approval.`,
				link: '/hr/timesheets',
				referenceModule: 'timesheet',
				referenceId: String(row._id ?? row.id ?? id),
				moduleKey: 'hr',
			})
		} catch {}
		return updated
	}

	async resolve(id: string, decision: 'APPROVED' | 'REJECTED', deciderUserId: string, reason?: string): Promise<any> {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Timesheet entry not found')
		const updated = await this.repository.update(id, {
			status: decision,
			approvedAt: decision === 'APPROVED' ? new Date() : undefined,
			approvedByUserId: decision === 'APPROVED' ? deciderUserId : undefined,
			rejectionReason: decision === 'REJECTED' ? reason : undefined,
		} as any)

		try {
			await this.notifications.notify({
				organizationId: String(row.organizationId),
				recipientUserId: String(row.employeeUserId),
				actorUserId: deciderUserId,
				kind: decision === 'APPROVED' ? 'APPROVAL_APPROVED' : 'APPROVAL_REJECTED',
				severity: decision === 'APPROVED' ? 'SUCCESS' : 'DANGER',
				title: decision === 'APPROVED' ? 'Timesheet approved' : 'Timesheet rejected',
				message: reason
					? `${decision === 'APPROVED' ? 'Approved' : 'Rejected'}: ${reason}`
					: `Your timesheet for ${new Date(row.entryDate).toLocaleDateString()} (${row.hours}h) was ${decision.toLowerCase()}.`,
				link: '/hr/timesheets',
				referenceModule: 'timesheet',
				referenceId: String(row._id ?? row.id ?? id),
				moduleKey: 'hr',
			})
		} catch {}
		return updated
	}

	async weeklySummary(organizationId: string, employeeUserId: string, weekStart: Date, weekEnd: Date) {
		return this.repository.weeklySummary(organizationId, employeeUserId, weekStart, weekEnd)
	}

	private validate(input: TimesheetEntryInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.employeeUserId) throw new GraphQLValidationError('employeeUserId is required')
		if (!input.entryDate) throw new GraphQLValidationError('entryDate is required')
		if (typeof input.hours !== 'number' || input.hours <= 0 || input.hours > 24) {
			throw new GraphQLValidationError('Hours must be between 0 and 24')
		}
	}
}
