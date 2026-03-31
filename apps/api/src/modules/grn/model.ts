import { model, Schema } from 'mongoose'

const lineItemSchema = new Schema({
  itemDescription: { type: String, required: true },
  orderedQty: { type: Number, default: 0 },
  receivedQty: { type: Number, required: true },
  unitPrice: { type: Number, default: 0 },
}, { _id: false })

const grnSchema = new Schema({
  grnNumber: { type: String, required: true, unique: true },
  purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: { type: String },
  receivedDate: { type: Date, required: true },
  lineItems: [lineItemSchema],
  notes: { type: String },
  status: { type: String, enum: ['draft', 'confirmed'], default: 'confirmed' },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

grnSchema.index({ purchaseOrderId: 1 })
grnSchema.index({ organizationId: 1 })
grnSchema.index({ receivedDate: 1 })

export const GRN = model('GRN', grnSchema)
