import { model, Schema } from 'mongoose'

const lineItemSchema = new Schema({
	itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
	description: { type: String, required: true },
	quantity: { type: Number, required: true, min: 0 },
	unitPrice: { type: Number, required: true, min: 0 },
	discount: { type: Number, default: 0 },
	tax: { type: Number, default: 0 },
	total: { type: Number, required: true },
}, { _id: false })

const quotationSchema = new Schema({
	quotationNumber: { type: String, unique: true },
	clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
	subject: { type: String, required: true },
	quotationDate: { type: Date, required: true },
	validUntil: { type: Date, required: true },
	lineItems: [lineItemSchema],
	subtotal: { type: Number, default: 0 },
	discountAmount: { type: Number, default: 0 },
	taxAmount: { type: Number, default: 0 },
	totalAmount: { type: Number, default: 0 },
	terms: { type: String },
	notes: { type: String },
	status: {
		type: String,
		enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
		default: 'draft',
	},
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	deletedAt: { type: Date },
}, { timestamps: true })

quotationSchema.index({ organizationId: 1 })
quotationSchema.index({ clientId: 1 })
quotationSchema.index({ status: 1 })
quotationSchema.index({ quotationNumber: 1 })

export const Quotation = model('Quotation', quotationSchema)
