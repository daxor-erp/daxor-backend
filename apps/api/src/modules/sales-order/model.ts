import { model, Schema } from 'mongoose'

const orderItemSchema = new Schema({
	itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
	itemDescription: { type: String, required: true },
	quantity: { type: Number, required: true },
	unitPrice: { type: Number, required: true },
	lineTotal: { type: Number, required: true },
}, { _id: true })

const salesOrderSchema = new Schema({
	seqNo: { type: String },
	salesOrderNumber: { type: String, required: true },
	customerId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	// Backward compatibility for any existing reads/writes expecting clientId.
	clientId: { type: Schema.Types.ObjectId, ref: 'Organization' },
	quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
	quotationStatus: { type: String, enum: ['pending', 'accepted', 'rejected'] },
	projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
	orderDate: { type: Date, required: true, default: Date.now },
	deliveryDate: { type: Date },
	subtotal: { type: Number, required: true, default: 0 },
	taxAmount: { type: Number, default: 0 },
	totalAmount: { type: Number, required: true, default: 0 },
	status: {
		type: String,
		enum: ['draft', 'submitted', 'approved', 'rejected', 'active', 'completed', 'cancelled', 'refunded'],
		default: 'draft',
	},
	cashSale: { type: Boolean, default: false },
	/**
	 * Odoo-style invoicing policy:
	 *   ordered_quantities  — invoice as soon as the SO is confirmed (default for most businesses).
	 *   delivered_quantities — invoice only after delivery is validated; blocks invoice creation otherwise.
	 */
	invoicingPolicy: {
		type: String,
		enum: ['ordered_quantities', 'delivered_quantities'],
		default: 'ordered_quantities',
	},
	/** Running count of quantity delivered across all delivery orders, used for invoicing policy check. */
	deliveredQuantity: { type: Number, default: 0 },
	refundedAt: { type: Date },
	refundAmount: { type: Number },
	refundMethod: { type: String },
	refundReferenceNumber: { type: String },
	refundNotes: { type: String },
	refundedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	items: [orderItemSchema],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

salesOrderSchema.index({ seqNo: 1 }, { unique: true, sparse: true })
salesOrderSchema.index({ salesOrderNumber: 1 }, { unique: true })
salesOrderSchema.index({ customerId: 1 })
salesOrderSchema.index({ clientId: 1 })
salesOrderSchema.index({ quotationId: 1 })
salesOrderSchema.index({ projectId: 1 })
salesOrderSchema.index({ organizationId: 1 })
salesOrderSchema.index({ deletedAt: 1 })

export const SalesOrder = model('SalesOrder', salesOrderSchema)
