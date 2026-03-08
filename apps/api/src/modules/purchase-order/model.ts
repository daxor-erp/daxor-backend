import { model, Schema } from 'mongoose'

const poItemSchema = new Schema({
	itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
	itemDescription: { type: String, required: true },
	quantity: { type: Number, required: true },
	unitPrice: { type: Number, required: true },
	lineTotal: { type: Number },
}, { _id: true })

const purchaseOrderSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	poNumber: { type: String, required: true, unique: true },
	vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	deliveryDate: { type: Date },
	subtotal: { type: Number, default: 0 },
	taxAmount: { type: Number, default: 0 },
	totalAmount: { type: Number, default: 0 },
	status: { type: String, enum: ['draft', 'submitted', 'approved', 'sent', 'received', 'cancelled'], default: 'draft' },
	items: [poItemSchema],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

purchaseOrderSchema.index({ poNumber: 1 })
purchaseOrderSchema.index({ vendorId: 1 })
purchaseOrderSchema.index({ organizationId: 1 })
purchaseOrderSchema.index({ deletedAt: 1 })

export const PurchaseOrder = model('PurchaseOrder', purchaseOrderSchema)
