import { model, Schema } from 'mongoose'

/**
 * Tenant-scoped in-app notification. Each row targets one user (recipientUserId)
 * inside a given organization. Multiple notifications can reference the same
 * underlying entity (e.g. an approval request) — `referenceModule` + `referenceId`
 * make it easy to navigate from the notification to the source page.
 */
const notificationSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		recipientUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		actorUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		kind: {
			type: String,
			required: true,
			enum: [
				'APPROVAL_REQUEST',
				'APPROVAL_APPROVED',
				'APPROVAL_REJECTED',
				'INVOICE_OVERDUE',
				'BILL_DUE',
				'LOW_STOCK',
				'NEW_LEAD',
				'MENTION',
				'SYSTEM',
				'BROADCAST',
				'MAINTENANCE',
				'ANNOUNCEMENT',
				'ALERT',
			],
			index: true,
		},
		severity: {
			type: String,
			required: true,
			enum: ['INFO', 'SUCCESS', 'WARNING', 'DANGER'],
			default: 'INFO',
		},
		title: { type: String, required: true },
		message: { type: String },
		link: { type: String },
		referenceModule: { type: String },
		referenceId: { type: Schema.Types.ObjectId },
		moduleKey: { type: String, index: true },
		isRead: { type: Boolean, default: false, index: true },
		readAt: { type: Date },
		archivedAt: { type: Date },
	},
	{ timestamps: true },
)

notificationSchema.index({ organizationId: 1, recipientUserId: 1, isRead: 1, createdAt: -1 })
notificationSchema.index({ recipientUserId: 1, createdAt: -1 })

export const Notification = model('Notification', notificationSchema)
