import { model, Schema } from 'mongoose'

const variantAttributeValueSchema = new Schema(
	{
		attributeId: { type: Schema.Types.ObjectId, ref: 'Attribute', required: true },
		attributeName: { type: String, required: true }, // denormalized for display
		valueId: { type: Schema.Types.ObjectId, required: true },
		value: { type: String, required: true }, // denormalized for display
	},
	{ _id: false },
)

/**
 * A generated combination of a product's attribute-line values (e.g. Make=NAKSHTRA,
 * Model=250MIG/ARC, Size=0.8mm). Each variant can carry its own sku/barcode/stock.
 */
const productVariantSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		/** Denormalized for quick display without a Product lookup, e.g. "TOOLS-WELDING SPOOL (NAKSHTRA, 250MIG/ARC, 0.8 mm)". */
		displayName: { type: String, required: true },
		attributeValues: { type: [variantAttributeValueSchema], default: [] },
		sku: { type: String, default: '' },
		barcode: { type: String, default: '' },
		/** Optional per-variant price delta added to the product's base salesPrice. */
		extraPrice: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

productVariantSchema.index({ productId: 1 })
productVariantSchema.index({ organizationId: 1 })
productVariantSchema.index({ sku: 1, organizationId: 1 }, { unique: true, sparse: true })
productVariantSchema.index({ deletedAt: 1 })

export const ProductVariant = model('ProductVariant', productVariantSchema)
