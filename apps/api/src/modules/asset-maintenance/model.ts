import { model, Schema } from 'mongoose'

const partUsageSchema = new Schema(
	{
		itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
		itemName: { type: String, required: true },
		quantity: { type: Number, required: true, min: 0 },
		unit: { type: String, default: 'unit' },
		costPerUnit: { type: Number, default: 0, min: 0 },
		lineTotal: { type: Number, default: 0 },
	},
	{ _id: false },
)

/**
 * Maintenance work order against a fixed asset. Schedule-driven (preventive)
 * or break-fix (corrective). Tracks downtime + parts + labor cost.
 */
const assetMaintenanceSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		docNumber: { type: String, required: true, index: true },
		assetId: { type: Schema.Types.ObjectId, ref: 'FixedAsset', required: true, index: true },
		assetCode: { type: String },
		assetName: { type: String },
		maintenanceType: {
			type: String,
			enum: ['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'INSPECTION'],
			default: 'PREVENTIVE',
			index: true,
		},
		priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
		scheduledDate: { type: Date, required: true, index: true },
		startedAt: { type: Date },
		completedAt: { type: Date },
		downtimeHours: { type: Number, default: 0, min: 0 },
		description: { type: String, required: true },
		assignedToUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		assignedToName: { type: String },
		vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
		partsUsed: { type: [partUsageSchema], default: [] },
		laborHours: { type: Number, default: 0, min: 0 },
		laborRate: { type: Number, default: 0, min: 0 },
		partsCost: { type: Number, default: 0 },
		laborCost: { type: Number, default: 0 },
		totalCost: { type: Number, default: 0 },
		nextScheduledDate: { type: Date },
		intervalDays: { type: Number, min: 0 },
		status: {
			type: String,
			enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'],
			default: 'SCHEDULED',
			index: true,
		},
		findings: { type: String },
		actionsTaken: { type: String },
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

assetMaintenanceSchema.index({ organizationId: 1, docNumber: 1 }, { unique: true })
assetMaintenanceSchema.index({ organizationId: 1, assetId: 1, scheduledDate: -1 })

export const AssetMaintenance = model('AssetMaintenance', assetMaintenanceSchema)
