import { model, Schema } from 'mongoose'

/** Workflow row for org-assigned approvers (see Organization.moduleApprovers). */
const approvalRequestSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		moduleKey: { type: String, required: true, index: true },
		entityType: { type: String, required: true, index: true },
		entityId: { type: Schema.Types.ObjectId, required: true, index: true },
		title: { type: String, required: true },
		status: {
			type: String,
			enum: ['PENDING', 'APPROVED', 'REJECTED'],
			default: 'PENDING',
			index: true,
		},
		requesterUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		requesterDisplayName: { type: String },
		assigneeApproverUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		resolutionNote: { type: String },
		decidedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		decidedAt: { type: Date },
	},
	{ timestamps: true },
)

approvalRequestSchema.index(
	{ entityType: 1, entityId: 1, status: 1 },
	{ partialFilterExpression: { status: 'PENDING' } },
)

export const ApprovalRequest = model('ApprovalRequest', approvalRequestSchema)
