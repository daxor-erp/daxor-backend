import { model, Schema } from 'mongoose'

const bomComponentSchema = new Schema(
	{
		itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
		itemName: { type: String, required: true },
		quantity: { type: Number, required: true, min: 0 },
		unit: { type: String, default: 'unit' },
		scrapPercent: { type: Number, default: 0, min: 0, max: 100 },
		standardCost: { type: Number, default: 0, min: 0 },
		notes: { type: String },
	},
	{ _id: false },
)

const billOfMaterialsSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		parentItemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
		parentItemName: { type: String, required: true },
		bomCode: { type: String, required: true, index: true },
		version: { type: String, default: 'v1' },
		description: { type: String },
		quantityProduced: { type: Number, default: 1, min: 0 },
		unit: { type: String, default: 'unit' },
		components: { type: [bomComponentSchema], default: [] },
		laborCost: { type: Number, default: 0, min: 0 },
		overheadCost: { type: Number, default: 0, min: 0 },
		totalMaterialCost: { type: Number, default: 0 },
		totalCost: { type: Number, default: 0 },
		status: {
			type: String,
			enum: ['DRAFT', 'ACTIVE', 'OBSOLETE', 'ARCHIVED'],
			default: 'DRAFT',
			index: true,
		},
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

billOfMaterialsSchema.index({ organizationId: 1, bomCode: 1, version: 1 }, { unique: true })
billOfMaterialsSchema.index({ organizationId: 1, parentItemId: 1, status: 1 })

export const BillOfMaterials = model('BillOfMaterials', billOfMaterialsSchema)
