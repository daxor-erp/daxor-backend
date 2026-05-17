import { model, Schema } from 'mongoose'

const taxRateSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		name: { type: String, required: true },
		code: { type: String, required: true, index: true },
		ratePercent: { type: Number, required: true, min: 0, max: 100 },
		taxType: { type: String, enum: ['GST', 'IGST', 'CGST', 'SGST', 'VAT', 'CESS', 'OTHER'], default: 'GST' },
		appliesTo: { type: String, enum: ['SALES', 'PURCHASE', 'BOTH'], default: 'BOTH' },
		hsnSacCode: { type: String },
		description: { type: String },
		isCompound: { type: Boolean, default: false },
		isInclusive: { type: Boolean, default: false },
		status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
		effectiveFrom: { type: Date },
		effectiveTo: { type: Date },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

taxRateSchema.index({ organizationId: 1, code: 1 }, { unique: true })

export const TaxRate = model('TaxRate', taxRateSchema)
