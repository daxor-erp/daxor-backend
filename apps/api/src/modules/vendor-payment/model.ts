import { model, Schema } from 'mongoose'

const allocationSchema = new Schema({
  billId: { type: Schema.Types.ObjectId, ref: 'VendorBill', required: true },
  amount: { type: Number, required: true, min: 0 },
}, { _id: false })

const vendorPaymentSchema = new Schema({
  paymentNumber: { type: String, required: true, unique: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  paymentDate: { type: Date, required: true },
  // bank_transfer, cheque, cash, credit_card
  paymentMethod: { type: String, required: true },
  referenceNumber: { type: String }, // cheque no, bank ref, etc.
  totalAmount: { type: Number, required: true, min: 0 },
  allocations: [allocationSchema], // which bills this payment settles
  notes: { type: String },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

vendorPaymentSchema.index({ vendorId: 1 })
vendorPaymentSchema.index({ organizationId: 1 })
vendorPaymentSchema.index({ paymentDate: 1 })
vendorPaymentSchema.index({ deletedAt: 1 })

export const VendorPayment = model('VendorPayment', vendorPaymentSchema)
