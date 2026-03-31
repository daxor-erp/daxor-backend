import { model, Schema } from 'mongoose'

const invoiceItemSchema = new Schema({
	itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
	itemDescription: { type: String, required: true },
	quantity: { type: Number, required: true },
	unitPrice: { type: Number, required: true },
	lineTotal: { type: Number, required: true },
}, { _id: true })

const customerInvoiceSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	invoiceNumber: { type: String, required: true, unique: true },
	salesOrderId: { type: Schema.Types.ObjectId, ref: 'SalesOrder' },
	projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
	customerId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	// Backward compatibility for modules still reading clientId.
	clientId: { type: Schema.Types.ObjectId, ref: 'Organization' },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	invoiceDate: { type: Date, required: true, default: Date.now },
	dueDate: { type: Date },
	subtotal: { type: Number, required: true, default: 0 },
	taxAmount: { type: Number, default: 0 },
	totalAmount: { type: Number, required: true, default: 0 },
	paidAmount: { type: Number, default: 0 },
	status: { type: String, enum: ['draft', 'approved', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled'], default: 'draft' },
	items: [invoiceItemSchema],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

customerInvoiceSchema.index({ invoiceNumber: 1 })
customerInvoiceSchema.index({ salesOrderId: 1 })
customerInvoiceSchema.index({ projectId: 1 })
customerInvoiceSchema.index({ customerId: 1 })
customerInvoiceSchema.index({ clientId: 1 })
customerInvoiceSchema.index({ organizationId: 1 })
customerInvoiceSchema.index({ deletedAt: 1 })

export const CustomerInvoice = model('CustomerInvoice', customerInvoiceSchema)
