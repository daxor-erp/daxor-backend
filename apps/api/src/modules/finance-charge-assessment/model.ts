import mongoose, { Schema } from 'mongoose'

const financeChargeLineSchema = new Schema(
	{
		invoiceId: { type: Schema.Types.ObjectId, ref: 'CustomerInvoice', required: true },
		invoiceNumber: { type: String },
		customerId: { type: Schema.Types.ObjectId, required: true },
		daysOverdue: { type: Number, required: true, min: 0 },
		outstandingBefore: { type: Number, required: true, min: 0 },
		chargeAmount: { type: Number, required: true, min: 0 },
	},
	{ _id: false },
)

const financeChargeAssessmentSchema = new Schema(
	{
		assessmentNumber: { type: String, required: true, unique: true },
		organizationId: { type: String, required: true, index: true },
		asOfDate: { type: Date, required: true },
		annualRatePercent: { type: Number, required: true, min: 0 },
		status: {
			type: String,
			enum: ['draft', 'posted', 'cancelled'],
			default: 'draft',
		},
		lines: { type: [financeChargeLineSchema], default: [] },
		totalChargeAmount: { type: Number, required: true, default: 0 },
		notes: { type: String },
		postedAt: { type: Date },
		postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

financeChargeAssessmentSchema.index({ organizationId: 1, status: 1 })
financeChargeAssessmentSchema.index({ deletedAt: 1 })

export const FinanceChargeAssessment = mongoose.model('FinanceChargeAssessment', financeChargeAssessmentSchema)
