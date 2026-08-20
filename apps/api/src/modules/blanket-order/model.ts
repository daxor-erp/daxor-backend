/**
 * Blanket Order (Purchase Agreement)
 * Mirrors Odoo 19: Purchase › Orders › Blanket Orders
 *
 * A blanket order is a long-term agreement with a vendor for a set of products
 * at agreed prices and quantities over a defined validity period.
 * Individual POs ("call-offs") reference the blanket order and draw down the committed qty.
 */

import { model, Schema } from 'mongoose'

const blanketOrderLineSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0 },
    /** Qty already drawn down via linked POs. */
    orderedQty: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    uomId: { type: Schema.Types.ObjectId, ref: 'Uom', default: null },
    notes: { type: String, default: '' },
  },
  { _id: true },
)

const blanketOrderSchema = new Schema(
  {
    seqNo: { type: String, unique: true, sparse: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: { type: String, default: '' },
    agreementType: {
      type: String,
      enum: ['purchase_agreement', 'blanket_order'],
      default: 'blanket_order',
    },
    lines: { type: [blanketOrderLineSchema], default: [] },
    validityStart: { type: Date },
    validityEnd: { type: Date },
    currency: { type: String, default: 'INR' },
    notes: { type: String, default: '' },
    /**
     * draft  — being configured
     * open   — active, POs can reference it
     * closed — validity ended or manually closed
     * cancelled
     */
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'cancelled'],
      default: 'draft',
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

blanketOrderSchema.index({ organizationId: 1 })
blanketOrderSchema.index({ vendorId: 1 })
blanketOrderSchema.index({ status: 1 })
blanketOrderSchema.index({ deletedAt: 1 })

export const BlanketOrder = model('BlanketOrder', blanketOrderSchema)
