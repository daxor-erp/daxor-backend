import { model, Schema } from 'mongoose'

const depreciationEntrySchema = new Schema(
	{
		periodEndDate: { type: Date, required: true },
		amount: { type: Number, required: true, min: 0 },
		accumulatedDepreciation: { type: Number, required: true, min: 0 },
		bookValue: { type: Number, required: true, min: 0 },
		method: { type: String, enum: ['STRAIGHT_LINE', 'DECLINING_BALANCE', 'WDV', 'UNITS'], default: 'STRAIGHT_LINE' },
		notes: { type: String },
		postedAt: { type: Date, default: Date.now },
	},
	{ _id: false },
)

const fixedAssetSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		assetCode: { type: String, required: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		category: {
			type: String,
			enum: [
				'LAND',
				'BUILDING',
				'PLANT_MACHINERY',
				'FURNITURE',
				'VEHICLE',
				'COMPUTER',
				'SOFTWARE',
				'OFFICE_EQUIPMENT',
				'OTHER',
			],
			default: 'OTHER',
			index: true,
		},
		assignedToUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		siteLocationId: { type: Schema.Types.ObjectId, ref: 'SiteLocation' },
		vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
		purchaseDate: { type: Date, required: true },
		commissionedDate: { type: Date },
		disposalDate: { type: Date },
		acquisitionCost: { type: Number, required: true, min: 0 },
		salvageValue: { type: Number, default: 0, min: 0 },
		usefulLifeMonths: { type: Number, required: true, min: 1 },
		depreciationMethod: {
			type: String,
			enum: ['STRAIGHT_LINE', 'DECLINING_BALANCE', 'WDV', 'UNITS'],
			default: 'STRAIGHT_LINE',
		},
		depreciationRatePercent: { type: Number, min: 0, max: 100 },
		accumulatedDepreciation: { type: Number, default: 0, min: 0 },
		bookValue: { type: Number, default: 0 },
		status: {
			type: String,
			enum: ['ACTIVE', 'UNDER_MAINTENANCE', 'DISPOSED', 'LOST', 'RETIRED'],
			default: 'ACTIVE',
			index: true,
		},
		barcode: { type: String },
		serialNumber: { type: String },
		warrantyExpiryDate: { type: Date },
		depreciationHistory: { type: [depreciationEntrySchema], default: [] },
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

fixedAssetSchema.index({ organizationId: 1, assetCode: 1 }, { unique: true })
fixedAssetSchema.index({ organizationId: 1, category: 1, status: 1 })

export const FixedAsset = model('FixedAsset', fixedAssetSchema)
