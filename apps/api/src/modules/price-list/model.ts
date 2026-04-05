import mongoose, { Schema } from 'mongoose'

const priceListLineSchema = new Schema(
	{
		itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
		seqNo: { type: String },
		name: { type: String, required: true },
		unit: { type: String },
		rate: { type: Number },
		category: { type: String },
	},
	{ _id: false },
)

const priceListSchema = new Schema(
	{
		listNumber: { type: String, required: true, unique: true },
		organizationId: { type: String, required: true, index: true },
		title: { type: String, required: true },
		categoryFilter: { type: String },
		lines: { type: [priceListLineSchema], default: [] },
		generatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

priceListSchema.index({ organizationId: 1, createdAt: -1 })
priceListSchema.index({ deletedAt: 1 })

export const PriceList = mongoose.model('PriceList', priceListSchema)
