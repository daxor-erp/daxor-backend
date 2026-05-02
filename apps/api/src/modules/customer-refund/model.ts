import { model, Schema } from 'mongoose'

const customerRefundSchema = new Schema(
	{
		refundNumber: { type: String, required: true, unique: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		customerId: { type: Schema.Types.ObjectId, required: true },
		refundDate: { type: Date, required: true },
		refundMethod: { type: String, required: true },
		referenceNumber: { type: String },
		amount: { type: Number, required: true, min: 0 },
		customerInvoiceId: { type: Schema.Types.ObjectId, ref: 'CustomerInvoice' },
		notes: { type: String },
		status: {
			type: String,
			enum: ['issued', 'cancelled'],
			default: 'issued',
		},
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

customerRefundSchema.index({ customerId: 1 })
customerRefundSchema.index({ refundDate: -1 })
customerRefundSchema.index({ deletedAt: 1 })

export const CustomerRefund = model('CustomerRefund', customerRefundSchema)
