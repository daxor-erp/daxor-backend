import { model, Schema } from 'mongoose'

/**
 * Daily time entry by an employee. Aggregates power: payroll uses these to
 * compute billable hours; project management uses them for actuals; HR uses
 * them for attendance reconciliation.
 */
const timesheetEntrySchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		employeeUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
		workOrderId: { type: Schema.Types.ObjectId, ref: 'WorkOrder' },
		taskName: { type: String },
		entryDate: { type: Date, required: true, index: true },
		hours: { type: Number, required: true, min: 0, max: 24 },
		billable: { type: Boolean, default: false, index: true },
		billRate: { type: Number, default: 0, min: 0 },
		costRate: { type: Number, default: 0, min: 0 },
		notes: { type: String },
		status: {
			type: String,
			enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
			default: 'DRAFT',
			index: true,
		},
		submittedAt: { type: Date },
		approvedAt: { type: Date },
		approvedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		rejectionReason: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

timesheetEntrySchema.index({ organizationId: 1, employeeUserId: 1, entryDate: -1 })
timesheetEntrySchema.index({ organizationId: 1, projectId: 1, entryDate: -1 })

export const TimesheetEntry = model('TimesheetEntry', timesheetEntrySchema)
