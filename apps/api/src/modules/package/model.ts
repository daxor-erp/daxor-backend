import { model, Schema } from 'mongoose'

const packageSchema = new Schema(
	{
		packageName: { type: String, required: true, trim: true },
		externalName: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 },
		durationDays: { type: Number, required: true, min: 1 },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

packageSchema.index({ deletedAt: 1 })
packageSchema.index({ packageName: 1 })

export const Package = model('Package', packageSchema)
