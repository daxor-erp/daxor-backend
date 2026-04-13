import { model, Schema } from 'mongoose'

const itemSchema = new Schema({
	itemName: { type: String, required: true },
	description: { type: String },
	quantity: { type: Number, required: true },
	unit: { type: String, default: 'pcs' },
	unitPrice: { type: Number, required: true },
	discount: { type: Number, default: 0 },
	tax: { type: Number, default: 0 },
	amount: { type: Number, required: true },
}, { _id: false })

const salesQuotationSchema = new Schema({
	seqNo: { type: String },
	quotationNumber: { type: String, required: true, maxlength: 50 },
	enquiryId: { type: Schema.Types.ObjectId, ref: 'SalesEnquiry' },
	clientId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	quotationDate: { type: Date, default: Date.now },
	validUntil: { type: Date, required: true },
	subject: { type: String, maxlength: 255, required: true },
	items: [itemSchema],
	subtotal: { type: Number, required: true },
	totalDiscount: { type: Number, default: 0 },
	totalTax: { type: Number, default: 0 },
	grandTotal: { type: Number, required: true },
	currency: { type: String, maxlength: 3, default: 'SGD' },
	paymentTerms: { type: String },
	deliveryTerms: { type: String },
	notes: { type: String },
	termsAndConditions: { type: String },
	status: { 
		type: String, 
		enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'], 
		default: 'draft' 
	},
	assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

salesQuotationSchema.index({ seqNo: 1 }, { unique: true, sparse: true })
salesQuotationSchema.index({ quotationNumber: 1 }, { unique: true })
salesQuotationSchema.index({ clientId: 1 })
salesQuotationSchema.index({ enquiryId: 1 })
salesQuotationSchema.index({ status: 1 })
salesQuotationSchema.index({ createdAt: 1 })
salesQuotationSchema.index({ deletedAt: 1 })
salesQuotationSchema.index({ organizationId: 1 })

export const SalesQuotation = model('SalesQuotation', salesQuotationSchema)
