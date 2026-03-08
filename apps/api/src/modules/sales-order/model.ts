import { model, Schema } from 'mongoose'

const orderItemSchema = new Schema({
	itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
	itemDescription: { type: String, required: true },
	quantity: { type: Number, required: true },
	unitPrice: { type: Number, required: true },
	lineTotal: { type: Number, required: true },
}, { _id: true })

const salesOrderSchema = new Schema({
	seqNo: { type: String, unique: true, sparse: true },
	salesOrderNumber: { type: String, required: true },
	clientId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
	orderDate: { type: Date, required: true, default: Date.now },
	deliveryDate: { type: Date },
	subtotal: { type: Number, required: true, default: 0 },
	taxAmount: { type: Number, default: 0 },
	totalAmount: { type: Number, required: true, default: 0 },
	status: { type: String, enum: ['draft', 'submitted', 'approved', 'active', 'completed', 'cancelled'], default: 'draft' },
	items: [orderItemSchema],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

salesOrderSchema.index({ salesOrderNumber: 1 })
salesOrderSchema.index({ clientId: 1 })
salesOrderSchema.index({ projectId: 1 })
salesOrderSchema.index({ deletedAt: 1 })

export const SalesOrder = model('SalesOrder', salesOrderSchema)
