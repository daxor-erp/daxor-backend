import { model, Schema } from 'mongoose'

const ictLineSchema = new Schema(
  {
    itemDescription: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String },
  },
  { _id: false },
)

const intercompanyTransferSchema = new Schema(
  {
    transferNumber: { type: String, required: true, unique: true },
    transferDate: { type: Date, required: true },
    fromOrganizationId: { type: String, required: true, index: true },
    fromOrganizationName: { type: String },
    toOrganizationId: { type: String, required: true, index: true },
    toOrganizationName: { type: String },
    lineItems: [ictLineSchema],
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'cancelled'],
      default: 'draft',
    },
    notes: { type: String },
    organizationId: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true },
)

intercompanyTransferSchema.index({ organizationId: 1 })
intercompanyTransferSchema.index({ deletedAt: 1 })

export const IntercompanyTransfer = model('IntercompanyTransfer', intercompanyTransferSchema)
