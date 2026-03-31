import { model, Schema } from 'mongoose'

const saLineSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    itemDescription: { type: String, required: true },
    currentQty: { type: Number, default: 0 },
    adjustedQty: { type: Number, required: true },
    difference: { type: Number, default: 0 },
    unit: { type: String },
  },
  { _id: false }
)

const stockAdjustmentSchema = new Schema(
  {
    adjNumber: { type: String, required: true, unique: true },
    adjDate: { type: Date, required: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    warehouseName: { type: String },
    adjustmentType: {
      type: String,
      enum: ['increase', 'decrease', 'write-off', 'recount'],
      default: 'recount',
    },
    lineItems: [saLineSchema],
    reason: { type: String },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'cancelled'],
      default: 'draft',
    },
    notes: { type: String },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true }
)

stockAdjustmentSchema.index({ organizationId: 1 })
stockAdjustmentSchema.index({ deletedAt: 1 })

export const StockAdjustment = model('StockAdjustment', stockAdjustmentSchema)
