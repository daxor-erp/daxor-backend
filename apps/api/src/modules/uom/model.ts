import { model, Schema } from 'mongoose'

/**
 * Unit of Measure master (Odoo uom.uom equivalent).
 * `category` groups convertible units (e.g. "Weight": kg/g/ton); `ratio` is relative to the
 * category's reference unit (ratio=1 for the reference unit itself). `type` marks which unit
 * in a category is the reference ("reference" | "bigger" | "smaller").
 * `gstUqc` carries the Indian GST Unit Quantity Code (NOS, BOX, KGS, ...) for HSN/GST filing.
 */
const uomSchema = new Schema(
	{
		name: { type: String, required: true, trim: true }, // e.g. "Nos", "Box", "kg"
		category: { type: String, required: true, trim: true }, // e.g. "Unit", "Weight", "Volume"
		ratio: { type: Number, default: 1, min: 0 },
		type: { type: String, enum: ['reference', 'bigger', 'smaller'], default: 'reference' },
		/** Indian GST Unit Quantity Code, e.g. NOS, BOX, KGS. */
		gstUqc: { type: String, default: '' },
		isActive: { type: Boolean, default: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

uomSchema.index({ organizationId: 1, name: 1 }, { unique: true })
uomSchema.index({ organizationId: 1, category: 1 })
uomSchema.index({ deletedAt: 1 })

export const Uom = model('Uom', uomSchema)
