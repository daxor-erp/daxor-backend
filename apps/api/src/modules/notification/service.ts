import { NotificationRepository } from './repository'

export type NotificationKind =
	| 'APPROVAL_REQUEST'
	| 'APPROVAL_APPROVED'
	| 'APPROVAL_REJECTED'
	| 'INVOICE_OVERDUE'
	| 'BILL_DUE'
	| 'LOW_STOCK'
	| 'NEW_LEAD'
	| 'MENTION'
	| 'SYSTEM'
	| 'BROADCAST'
	| 'MAINTENANCE'
	| 'ANNOUNCEMENT'
	| 'ALERT'

export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER'

export interface CreateNotificationInput {
	organizationId: string
	recipientUserId: string
	actorUserId?: string
	kind: NotificationKind
	severity?: NotificationSeverity
	title: string
	message?: string
	link?: string
	referenceModule?: string
	referenceId?: string
	moduleKey?: string
}

export class NotificationService {
	private repository: NotificationRepository

	constructor() {
		this.repository = new NotificationRepository()
	}

	/**
	 * Persist a single notification. Wrapped in try/catch so failures never
	 * break the source workflow that triggered the notification (e.g. an
	 * approval submission must succeed even if the notification fails).
	 */
	async notify(input: CreateNotificationInput): Promise<any | null> {
		try {
			return await this.repository.create({
				organizationId: input.organizationId,
				recipientUserId: input.recipientUserId,
				actorUserId: input.actorUserId,
				kind: input.kind,
				severity: input.severity ?? defaultSeverity(input.kind),
				title: input.title,
				message: input.message,
				link: input.link,
				referenceModule: input.referenceModule,
				referenceId: input.referenceId,
				moduleKey: input.moduleKey,
				isRead: false,
			})
		} catch (err) {
			// Swallow + log — notifications are best-effort.
			// eslint-disable-next-line no-console
			console.warn('[notification] failed to persist', err)
			return null
		}
	}

	/** Fan-out to many recipients (e.g. all org admins). Deduplicates ids. */
	async notifyMany(
		recipientUserIds: Array<string | null | undefined>,
		input: Omit<CreateNotificationInput, 'recipientUserId'>,
	): Promise<void> {
		const seen = new Set<string>()
		for (const raw of recipientUserIds) {
			if (!raw) continue
			const id = String(raw)
			if (seen.has(id)) continue
			seen.add(id)
			await this.notify({ ...input, recipientUserId: id })
		}
	}

	async listForRecipient(
		recipientUserId: string,
		options: { unreadOnly?: boolean; limit?: number; skip?: number } = {},
	): Promise<any[]> {
		return this.repository.listForRecipient(recipientUserId, options)
	}

	async countUnread(recipientUserId: string): Promise<number> {
		return this.repository.countUnread(recipientUserId)
	}

	async markRead(id: string, recipientUserId: string): Promise<any | null> {
		return this.repository.markRead(id, recipientUserId)
	}

	async markAllRead(recipientUserId: string): Promise<number> {
		return this.repository.markAllRead(recipientUserId)
	}

	async archive(id: string, recipientUserId: string): Promise<any | null> {
		return this.repository.archive(id, recipientUserId)
	}

	async archiveAll(recipientUserId: string): Promise<number> {
		return this.repository.archiveAll(recipientUserId)
	}
}

function defaultSeverity(kind: NotificationKind): NotificationSeverity {
	switch (kind) {
		case 'APPROVAL_APPROVED':
		case 'NEW_LEAD':
			return 'SUCCESS'
		case 'INVOICE_OVERDUE':
		case 'APPROVAL_REJECTED':
			return 'DANGER'
		case 'BILL_DUE':
		case 'LOW_STOCK':
			return 'WARNING'
		default:
			return 'INFO'
	}
}
