import { model, Schema } from 'mongoose'

/**
 * Payment terms master (Odoo "Payment Terms"): a named term with a due-date computation rule.
 * Kept simple (single due line) — extend to multi-line installment schedules later if needed.
 */
const paymentTermSchema = new Schema(
	{
		name: { type: String, required: true, trim: true }, // e.g. "Net 30", "Due on Receipt", "15 Days"
		/** Number of days after invoice/order date the balance is due. 0 = due on receipt. */
		dueDays: { type: Number, default: 0, min: 0 },
		/** Optional: day-of-month cutoff rule, e.g. "End of following month". Free text description for UI. */
		description: { type: String, default: '' },
		isActive: { type: Boolean, default: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

paymentTermSchema.index({ organizationId: 1, name: 1 }, { unique: true })
paymentTermSchema.index({ deletedAt: 1 })

export const PaymentTerm = model('PaymentTerm', paymentTermSchema)
