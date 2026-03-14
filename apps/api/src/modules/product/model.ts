import { model, Schema } from 'mongoose'

const productSchema = new Schema({
  seqNo: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  brand: { type: String },
  unit: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  costPrice: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  minStockLevel: { type: Number, default: 0 },
  maxStockLevel: { type: Number, default: 0 },
  reorderPoint: { type: Number, default: 0 },
  barcode: { type: String },
  images: [{ type: String }],
  specifications: { type: Map, of: String },
  status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active' },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: false })

productSchema.index({ sku: 1, organizationId: 1 }, { unique: true })
productSchema.index({ organizationId: 1 })
productSchema.index({ category: 1 })
productSchema.index({ status: 1 })
productSchema.index({ deletedAt: 1 })

export const Product = model('Product', productSchema)
