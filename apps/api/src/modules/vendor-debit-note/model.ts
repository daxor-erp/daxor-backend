import { model, Schema } from 'mongoose'

const vendorDebitNoteSchema = new Schema(
  {
    debitNumber: { type: String, required: true, unique: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    vendorBillId: { type: Schema.Types.ObjectId, ref: 'VendorBill' },
    debitDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    appliedAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    billAllocations: [
      {
        billId: { type: Schema.Types.ObjectId, ref: 'VendorBill' },
        amount: { type: Number, default: 0 },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    reason: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['open', 'applied', 'cancelled'], default: 'open' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true },
)

vendorDebitNoteSchema.index({ vendorId: 1 })
vendorDebitNoteSchema.index({ organizationId: 1 })
vendorDebitNoteSchema.index({ purchaseOrderId: 1 })
vendorDebitNoteSchema.index({ vendorBillId: 1 })

export const VendorDebitNote = model('VendorDebitNote', vendorDebitNoteSchema)
