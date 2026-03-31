import { model, Schema } from 'mongoose'

const mrnLineItemSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    itemDescription: { type: String, required: true },
    orderedQty: { type: Number, default: 0 },
    receivedQty: { type: Number, required: true },
    rejectedQty: { type: Number, default: 0 },
    unit: { type: String },
    unitPrice: { type: Number, default: 0 },
    lineTotal: { type: Number, default: 0 },
  },
  { _id: false },
)

const materialReceiptSchema = new Schema(
  {
    mrnNumber: { type: String, required: true, unique: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    purchaseOrderNumber: { type: String },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    vendorName: { type: String },
    receiptDate: { type: Date, required: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    warehouseName: { type: String },
    lineItems: [mrnLineItemSchema],
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'confirmed', 'cancelled'], default: 'draft' },
    notes: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true },
)

materialReceiptSchema.index({ purchaseOrderId: 1 })
materialReceiptSchema.index({ vendorId: 1 })
materialReceiptSchema.index({ organizationId: 1 })
materialReceiptSchema.index({ status: 1 })
materialReceiptSchema.index({ deletedAt: 1 })

export const MaterialReceipt = model('MaterialReceipt', materialReceiptSchema)
