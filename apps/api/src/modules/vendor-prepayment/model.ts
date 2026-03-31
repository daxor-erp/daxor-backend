import { model, Schema } from 'mongoose'

const vendorPrepaymentSchema = new Schema({
  prepaymentNumber: { type: String, required: true, unique: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  prepaymentDate: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  appliedAmount: { type: Number, default: 0 },   // applied against bills
  remainingAmount: { type: Number, default: 0 },  // amount - appliedAmount
  paymentMethod: { type: String, required: true },
  referenceNumber: { type: String },
  notes: { type: String },
  // open = has remaining balance, applied = fully used, cancelled
  status: { type: String, enum: ['open', 'applied', 'cancelled'], default: 'open' },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

vendorPrepaymentSchema.index({ vendorId: 1 })
vendorPrepaymentSchema.index({ organizationId: 1 })
vendorPrepaymentSchema.index({ status: 1 })

export const VendorPrepayment = model('VendorPrepayment', vendorPrepaymentSchema)
