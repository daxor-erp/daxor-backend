import { model, Schema } from 'mongoose'

const lineItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { _id: false })

const vendorBillSchema = new Schema({
  billNumber: { type: String, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
  billDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  lineItems: [lineItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 },
  paidAmount: { type: Number, default: 0 },       // updated as payments are applied
  outstandingAmount: { type: Number, default: 0 }, // totalAmount - paidAmount
  notes: { type: String },
  // draft → approved → partially_paid → paid → cancelled
  status: {
    type: String,
    enum: ['draft', 'approved', 'partially_paid', 'paid', 'cancelled'],
    default: 'draft',
  },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
}, { timestamps: true })

vendorBillSchema.index({ billNumber: 1 }, { unique: true })
vendorBillSchema.index({ vendorId: 1 })
vendorBillSchema.index({ organizationId: 1 })
vendorBillSchema.index({ status: 1 })
vendorBillSchema.index({ dueDate: 1 })
vendorBillSchema.index({ deletedAt: 1 })

export const VendorBill = model('VendorBill', vendorBillSchema)
