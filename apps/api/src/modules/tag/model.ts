import { model, Schema } from 'mongoose'

/**
 * Reusable tag master (used by Vendor, and later Customer/Product).
 * Odoo-style: name + color (index/hex) + category (grouping label) + active flag.
 */
const tagSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		/** Hex color (e.g. #22c55e) or a palette index string; UI decides rendering. */
		color: { type: String, default: '#94a3b8' },
		/** Free-text grouping label, e.g. "Vendor Type", "Region". */
		category: { type: String, default: '' },
		isActive: { type: Boolean, default: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

tagSchema.index({ organizationId: 1, name: 1 }, { unique: true })
tagSchema.index({ organizationId: 1, isActive: 1 })
tagSchema.index({ deletedAt: 1 })

export const Tag = model('Tag', tagSchema)
