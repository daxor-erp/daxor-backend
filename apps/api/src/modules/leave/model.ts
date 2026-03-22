import { model, Schema } from 'mongoose'

const leaveTypeSchema = new Schema(
	{
		code: { type: String, required: true },
		name: { type: String, required: true },
		paid: { type: Boolean, default: true },
		defaultDaysPerYear: { type: Number, default: 0 },
		allowCarryForward: { type: Boolean, default: false },
		maxCarryForwardDays: { type: Number, default: 0 },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		active: { type: Boolean, default: true },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

leaveTypeSchema.index({ organizationId: 1, code: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })

export const LeaveType = model('LeaveType', leaveTypeSchema)

const leaveEnrollmentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		leaveTypeId: { type: Schema.Types.ObjectId, ref: 'LeaveType', required: true },
		calendarYear: { type: Number, required: true },
		entitledDays: { type: Number, required: true, default: 0 },
		usedDays: { type: Number, required: true, default: 0 },
		carriedForward: { type: Number, default: 0 },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		notes: { type: String },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

leaveEnrollmentSchema.index(
	{ userId: 1, leaveTypeId: 1, calendarYear: 1, organizationId: 1 },
	{ unique: true, partialFilterExpression: { deletedAt: null } },
)

export const LeaveEnrollment = model('LeaveEnrollment', leaveEnrollmentSchema)

const leaveApplicationSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		leaveTypeId: { type: Schema.Types.ObjectId, ref: 'LeaveType', required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		totalDays: { type: Number, required: true },
		reason: { type: String },
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected', 'cancelled'],
			default: 'pending',
		},
		approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		approvedAt: { type: Date },
		rejectedReason: { type: String },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

leaveApplicationSchema.index({ organizationId: 1, userId: 1 })
leaveApplicationSchema.index({ organizationId: 1, status: 1 })

export const LeaveApplication = model('LeaveApplication', leaveApplicationSchema)

const leaveReinstatementSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		leaveTypeId: { type: Schema.Types.ObjectId, ref: 'LeaveType', required: true },
		calendarYear: { type: Number, required: true },
		daysRestored: { type: Number, required: true },
		reason: { type: String, required: true },
		leaveApplicationId: { type: Schema.Types.ObjectId, ref: 'LeaveApplication' },
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		reviewedAt: { type: Date },
		reviewNotes: { type: String },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

leaveReinstatementSchema.index({ organizationId: 1, userId: 1 })

export const LeaveReinstatement = model('LeaveReinstatement', leaveReinstatementSchema)
