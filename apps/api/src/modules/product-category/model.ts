import { model, Schema } from 'mongoose'

/**
 * Hierarchical product category tree (e.g. All -> Tools -> Tools Consumables).
 * `fullPath` is denormalized at write-time for breadcrumb display without recursive lookups.
 */
const productCategorySchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		parentId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', default: null },
		/** Denormalized "All / Tools / Tools Consumables" breadcrumb, recomputed on create/parent change. */
		fullPath: { type: String, default: '' },
		isActive: { type: Boolean, default: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

productCategorySchema.index({ organizationId: 1, parentId: 1 })
productCategorySchema.index({ organizationId: 1, name: 1 })
productCategorySchema.index({ deletedAt: 1 })

export const ProductCategory = model('ProductCategory', productCategorySchema)
