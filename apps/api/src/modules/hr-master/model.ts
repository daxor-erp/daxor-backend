import { model, Schema } from 'mongoose'

/**
 * Generic HR master data store. Used for the lightweight masters that don't
 * need their own dedicated module: shift master, calendar master, FWL
 * qualification, asset name list, career progression salary grades, etc.
 *
 * The `kind` discriminator separates them inside one collection.
 */
const hrMasterSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		kind: {
			type: String,
			required: true,
			enum: [
				'SHIFT',
				'CALENDAR',
				'ASSET_NAME',
				'FWL_QUALIFICATION',
				'CAREER_GRADE',
				'EXIT_REASON',
				'DEPARTMENT',
				'DESIGNATION',
				'OTHER',
			],
			index: true,
		},
		code: { type: String, required: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		// Flexible metadata bag for kind-specific fields (e.g. shift hours, holiday dates, etc.)
		metadata: { type: Schema.Types.Mixed, default: {} },
		active: { type: Boolean, default: true, index: true },
		sortOrder: { type: Number, default: 0 },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

hrMasterSchema.index({ organizationId: 1, kind: 1, code: 1 }, { unique: true })

export const HrMaster = model('HrMaster', hrMasterSchema)
