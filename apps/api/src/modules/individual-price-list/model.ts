import { model, Schema } from 'mongoose'

const individualPriceListLineSchema = new Schema(
	{
		itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
		seqNo: { type: String },
		name: { type: String, required: true },
		unit: { type: String },
		category: { type: String },
		standardRate: { type: Number, default: 0 },
		customerRate: { type: Number, default: 0 },
	},
	{ _id: false },
)

const individualPriceListSchema = new Schema(
	{
		listNumber: { type: String, required: true },
		organizationId: { type: String, required: true, index: true },
		customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
		title: { type: String, required: true },
		lines: { type: [individualPriceListLineSchema], default: [] },
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

individualPriceListSchema.index(
	{ organizationId: 1, customerId: 1 },
	{ unique: true, partialFilterExpression: { deletedAt: null } },
)
individualPriceListSchema.index({ deletedAt: 1 })

export const IndividualPriceList = model('IndividualPriceList', individualPriceListSchema)
