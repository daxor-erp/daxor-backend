import { model, Schema } from 'mongoose'

const stLineSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    itemDescription: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String },
  },
  { _id: false }
)

const stockTransferSchema = new Schema(
  {
    transferNumber: { type: String, required: true, unique: true },
    transferDate: { type: Date, required: true },
    fromWarehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    fromWarehouseName: { type: String },
    toWarehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    toWarehouseName: { type: String },
    lineItems: [stLineSchema],
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

stockTransferSchema.index({ organizationId: 1 })
stockTransferSchema.index({ deletedAt: 1 })

export const StockTransfer = model('StockTransfer', stockTransferSchema)
