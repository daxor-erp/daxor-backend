import { model, Schema } from 'mongoose'

const customerSchema = new Schema({
  docNumber: { type: String, unique: true, sparse: true },
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
  paymentTerms: { type: String },
  bankName: { type: String },
  bankAccountNumber: { type: String },
  bankIfsc: { type: String },
  bankBranch: { type: String },
  notes: { type: String },
  organizationId: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  /** When false, customer is excluded from invoice billing workflows and lists. */
  invoiceBillable: { type: Boolean, default: true },
  createdBy: { type: String },
  updatedBy: { type: String },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })

customerSchema.index({ organizationId: 1 })
customerSchema.index({ name: 1 })
customerSchema.index({ deletedAt: 1 })

export const Customer = model('Customer', customerSchema)
