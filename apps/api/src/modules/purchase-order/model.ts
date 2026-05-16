import { model, Schema } from 'mongoose'

const poItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
  itemDescription: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, default: 0 },
  lineTotal: { type: Number, default: 0 },
}, { _id: true })

const purchaseOrderSchema = new Schema({
  seqNo: { type: String, unique: true, sparse: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: { type: String },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  orderDate: { type: Date },
  deliveryDate: { type: Date },
  subtotal: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'sent', 'received', 'cancelled', 'rejected'], default: 'draft' },
  items: [poItemSchema],
  notes: { type: String },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

purchaseOrderSchema.index({ vendorId: 1 })
purchaseOrderSchema.index({ projectId: 1 })
purchaseOrderSchema.index({ organizationId: 1 })
purchaseOrderSchema.index({ status: 1 })
purchaseOrderSchema.index({ deletedAt: 1 })

export const PurchaseOrder = model('PurchaseOrder', purchaseOrderSchema)
