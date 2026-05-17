import { model, Schema } from 'mongoose'

/**
 * Generic attachment / document model. Any ERP entity can have multiple
 * documents attached by setting (parentModule, parentId).
 *
 * Storage: files are written to disk under `uploads/<orgId>/<docId><ext>`
 * relative to the API process cwd. `storagePath` records the resolved path.
 * Swap-friendly for S3 later (add a `storageKind` discriminator).
 */
const documentSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		uploadedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		parentModule: { type: String, required: true, index: true },
		parentId: { type: Schema.Types.ObjectId, required: true, index: true },
		filename: { type: String, required: true },
		mimeType: { type: String },
		sizeBytes: { type: Number, default: 0 },
		storagePath: { type: String, required: true },
		category: { type: String },
		description: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

documentSchema.index({ organizationId: 1, parentModule: 1, parentId: 1, createdAt: -1 })

export const Document = model('Document', documentSchema)
