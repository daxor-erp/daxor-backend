import { model, Schema } from 'mongoose'

const vendorCreditSchema = new Schema({
  creditNumber: { type: String, required: true, unique: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  creditDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true, default: 0 },
  appliedAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  reason: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['open', 'applied', 'cancelled'], default: 'open' },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

vendorCreditSchema.index({ vendorId: 1 })
vendorCreditSchema.index({ organizationId: 1 })
vendorCreditSchema.index({ status: 1 })

export const VendorCredit = model('VendorCredit', vendorCreditSchema)
