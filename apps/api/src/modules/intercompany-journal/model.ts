import { model, Schema } from 'mongoose'

const journalLineSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		account: { type: String, required: true },
		accountName: { type: String },
		costCenter: { type: String },
		debit: { type: Number, default: 0, min: 0 },
		credit: { type: Number, default: 0, min: 0 },
		description: { type: String },
	},
	{ _id: false },
)

/**
 * Intercompany journal entry. Each entry contains lines posted across two or
 * more organizations. Eliminations are auto-paired by reversal docs.
 */
const intercompanyJournalSchema = new Schema(
	{
		originatingOrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		docNumber: { type: String, required: true, index: true },
		entryDate: { type: Date, required: true, index: true },
		description: { type: String },
		allocationId: { type: Schema.Types.ObjectId, ref: 'IntercompanyAllocation' },
		lines: { type: [journalLineSchema], default: [] },
		totalDebit: { type: Number, default: 0 },
		totalCredit: { type: Number, default: 0 },
		status: {
			type: String,
			enum: ['DRAFT', 'POSTED', 'REVERSED'],
			default: 'DRAFT',
			index: true,
		},
		postedAt: { type: Date },
		postedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		reversalOfId: { type: Schema.Types.ObjectId, ref: 'IntercompanyJournalEntry' },
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

intercompanyJournalSchema.index({ originatingOrganizationId: 1, docNumber: 1 }, { unique: true })

export const IntercompanyJournalEntry = model('IntercompanyJournalEntry', intercompanyJournalSchema)
