import { model, Schema } from 'mongoose'

/**
 * Bank master record (Odoo res.bank equivalent) — the bank itself, not a specific account.
 * Vendor/customer bank accounts reference this via bankId.
 */
const bankSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		/** Bank Identifier Code / SWIFT / IFSC-style code. */
		bankIdentifierCode: { type: String, default: '' },
		address: { type: String, default: '' },
		phone: { type: String, default: '' },
		email: { type: String, default: '' },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

bankSchema.index({ organizationId: 1, name: 1 })
bankSchema.index({ deletedAt: 1 })

export const Bank = model('Bank', bankSchema)
