import { model, Schema } from 'mongoose'

const vendorSchema = new Schema({
  seqNo: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
  taxNumber: { type: String },
  paymentTerms: { type: String }, // e.g. "Net 30", "Net 60"
  notes: { type: String },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

vendorSchema.index({ organizationId: 1 })
vendorSchema.index({ name: 1 })
vendorSchema.index({ email: 1 })
vendorSchema.index({ deletedAt: 1 })

export const Vendor = model('Vendor', vendorSchema)
