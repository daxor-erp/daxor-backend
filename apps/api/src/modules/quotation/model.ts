import { model, Schema } from 'mongoose'

const quotationLineItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { _id: false })

const quotationSchema = new Schema({
  seqNo: { type: String, unique: true, sparse: true },
  quotationNumber: { type: String, required: true, unique: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  subject: { type: String, required: true },
  quotationDate: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  lineItems: [quotationLineItemSchema],
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  terms: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], default: 'draft' },
  sentAt: { type: Date },
  sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: false })

quotationSchema.index({ quotationNumber: 1 })
quotationSchema.index({ clientId: 1 })
quotationSchema.index({ organizationId: 1 })
quotationSchema.index({ status: 1 })
quotationSchema.index({ deletedAt: 1 })

export const Quotation = model('Quotation', quotationSchema)
