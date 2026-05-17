import { model, Schema } from 'mongoose'

const allocationLineSchema = new Schema(
	{
		targetOrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		targetOrganizationName: { type: String },
		percentage: { type: Number, required: true, min: 0, max: 100 },
		amount: { type: Number, default: 0 },
		costCenter: { type: String },
		notes: { type: String },
	},
	{ _id: false },
)

/**
 * Intercompany allocation schedule — distributes a source cost / revenue across
 * multiple target organizations by % share. Used to build consolidated journals.
 */
const intercompanyAllocationSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		scheduleCode: { type: String, required: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		sourceAccount: { type: String, required: true },
		basisAmount: { type: Number, required: true, min: 0 },
		basisDate: { type: Date, required: true },
		allocationMethod: {
			type: String,
			enum: ['FIXED_PERCENT', 'HEADCOUNT', 'REVENUE_SHARE', 'CUSTOM'],
			default: 'FIXED_PERCENT',
		},
		lines: { type: [allocationLineSchema], default: [] },
		totalAllocated: { type: Number, default: 0 },
		status: {
			type: String,
			enum: ['DRAFT', 'ACTIVE', 'POSTED', 'REVERSED', 'ARCHIVED'],
			default: 'DRAFT',
			index: true,
		},
		postedAt: { type: Date },
		postedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		journalEntryId: { type: Schema.Types.ObjectId, ref: 'IntercompanyJournalEntry' },
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

intercompanyAllocationSchema.index({ organizationId: 1, scheduleCode: 1 }, { unique: true })

export const IntercompanyAllocation = model('IntercompanyAllocation', intercompanyAllocationSchema)
