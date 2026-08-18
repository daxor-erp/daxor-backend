import { model, Schema } from 'mongoose'

const attributeValueSchema = new Schema(
	{
		value: { type: String, required: true, trim: true },
	},
	{ timestamps: false },
)

/**
 * Reusable product attribute master (Odoo product.attribute equivalent), e.g. Make, Model, Size.
 * Each attribute owns a reusable list of values (e.g. Make -> NAKSHTRA, ESAB, ...).
 * Products reference a subset of an attribute's values via "attribute lines"; the cartesian
 * product of selected values across lines generates variants.
 */
const attributeSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		values: { type: [attributeValueSchema], default: [] },
		isActive: { type: Boolean, default: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

attributeSchema.index({ organizationId: 1, name: 1 }, { unique: true })
attributeSchema.index({ deletedAt: 1 })

export const Attribute = model('Attribute', attributeSchema)
