import { model, Schema } from 'mongoose'

const defectSchema = new Schema(
	{
		code: { type: String, required: true },
		description: { type: String },
		severity: { type: String, enum: ['MINOR', 'MAJOR', 'CRITICAL'], default: 'MINOR' },
		quantity: { type: Number, default: 1, min: 0 },
		rootCause: { type: String },
		correctiveAction: { type: String },
	},
	{ _id: false },
)

/**
 * Quality Control inspection record. Linked to a source entity (GRN, work
 * order, sales return) to gate acceptance/rejection.
 */
const qcInspectionSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		docNumber: { type: String, required: true, index: true },
		inspectionDate: { type: Date, required: true, index: true },
		inspectorUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		inspectorName: { type: String },
		sourceModule: {
			type: String,
			enum: ['GRN', 'WORK_ORDER', 'MATERIAL_RECEIPT', 'SALES_RETURN', 'OTHER'],
			required: true,
			index: true,
		},
		sourceId: { type: Schema.Types.ObjectId, index: true },
		itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
		itemName: { type: String, required: true },
		batchNumber: { type: String },
		quantityInspected: { type: Number, required: true, min: 0 },
		quantityPassed: { type: Number, default: 0, min: 0 },
		quantityFailed: { type: Number, default: 0, min: 0 },
		quantityReworked: { type: Number, default: 0, min: 0 },
		defects: { type: [defectSchema], default: [] },
		outcome: {
			type: String,
			enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CONDITIONAL', 'REWORK'],
			default: 'PENDING',
			index: true,
		},
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

qcInspectionSchema.index({ organizationId: 1, docNumber: 1 }, { unique: true })

export const QCInspection = model('QCInspection', qcInspectionSchema)
