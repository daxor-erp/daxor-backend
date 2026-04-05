import { model, Schema } from 'mongoose'

const allocationSchema = new Schema(
	{
		invoiceId: { type: Schema.Types.ObjectId, ref: 'CustomerInvoice', required: true },
		amount: { type: Number, required: true, min: 0 },
		invoiceNumber: { type: String },
	},
	{ _id: false },
)

const customerPaymentSchema = new Schema(
	{
		paymentNumber: { type: String, required: true, unique: true },
		// Bill-to id: same as CustomerInvoice.customerId (CRM Client and/or registered Customer).
		customerId: { type: Schema.Types.ObjectId, required: true },
		paymentDate: { type: Date, required: true },
		paymentMethod: { type: String, required: true },
		referenceNumber: { type: String },
		totalAmount: { type: Number, required: true, min: 0 },
		allocations: [allocationSchema],
		notes: { type: String },
		status: {
			type: String,
			enum: ['draft', 'confirmed', 'cancelled'],
			default: 'confirmed',
		},
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

customerPaymentSchema.index({ customerId: 1 })
customerPaymentSchema.index({ organizationId: 1 })
customerPaymentSchema.index({ paymentDate: 1 })
customerPaymentSchema.index({ deletedAt: 1 })

export const CustomerPayment = model('CustomerPayment', customerPaymentSchema)
