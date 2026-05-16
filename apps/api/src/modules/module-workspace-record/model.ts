import { model, Schema } from 'mongoose'

/** Ad-hoc per-page drafts routed through org-admin module approvers when no domain entity exists. */
const moduleWorkspaceRecordSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		routePath: { type: String, required: true, index: true },
		approvalModuleKey: { type: String, required: true, index: true },
		title: { type: String, required: true },
		detail: { type: String },
		snapshot: { type: Schema.Types.Mixed },
		status: {
			type: String,
			enum: ['draft', 'pending_approval', 'approved', 'rejected'],
			default: 'draft',
			index: true,
		},
		createdByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		deletedAt: { type: Date },
	},
	{ timestamps: true },
)

moduleWorkspaceRecordSchema.index({ organizationId: 1, routePath: 1, createdAt: -1 })

export const ModuleWorkspaceRecord = model('ModuleWorkspaceRecord', moduleWorkspaceRecordSchema)
