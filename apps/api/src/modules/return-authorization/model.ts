import mongoose, { Schema } from 'mongoose'

const lineSchema = new Schema(
	{
		itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
		description: { type: String, required: true },
		quantity: { type: Number, required: true, min: 0 },
		quantityReceived: { type: Number, default: 0, min: 0 },
	},
	{ _id: true },
)

const returnAuthorizationSchema = new Schema(
	{
		raNumber: { type: String, required: true, unique: true },
		organizationId: { type: String, required: true, index: true },
		customerId: { type: Schema.Types.ObjectId, required: true },
		salesOrderId: { type: Schema.Types.ObjectId, ref: 'SalesOrder' },
		reason: { type: String },
		notes: { type: String },
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected', 'cancelled'],
			default: 'pending',
		},
		requestedDate: { type: Date, required: true },
		lines: { type: [lineSchema], default: [] },
		rejectionReason: { type: String },
		approvedAt: { type: Date },
		approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		goodsReceivedAt: { type: Date },
		goodsReceivedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		receiptComplete: { type: Boolean, default: false },
		receiptNotes: { type: String },
		rejectedAt: { type: Date },
		rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

returnAuthorizationSchema.index({ organizationId: 1, status: 1 })
returnAuthorizationSchema.index({ customerId: 1 })
returnAuthorizationSchema.index({ deletedAt: 1 })

export const ReturnAuthorization = mongoose.model('ReturnAuthorization', returnAuthorizationSchema)
