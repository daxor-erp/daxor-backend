import { model, Schema } from 'mongoose'

const customerDepositSchema = new Schema(
	{
		depositNumber: { type: String, required: true, unique: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		customerId: { type: Schema.Types.ObjectId, required: true, index: true },
		depositDate: { type: Date, required: true },
		depositMethod: { type: String, required: true },
		referenceNumber: { type: String },
		amount: { type: Number, required: true, min: 0 },
		notes: { type: String },
		status: {
			type: String,
			enum: ['confirmed', 'cancelled'],
			default: 'confirmed',
		},
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

customerDepositSchema.index({ depositDate: -1 })
customerDepositSchema.index({ deletedAt: 1 })

export const CustomerDeposit = model('CustomerDeposit', customerDepositSchema)
