import { MongoBaseRepository } from '../base/mongo-repository'
import { Notification } from './model'

export class NotificationRepository extends MongoBaseRepository<any> {
	constructor() {
		super(Notification)
	}

	async listForRecipient(
		recipientUserId: string,
		options: { unreadOnly?: boolean; limit?: number; skip?: number } = {},
	): Promise<any[]> {
		const { unreadOnly = false, limit = 50, skip = 0 } = options
		const query: Record<string, unknown> = { recipientUserId, archivedAt: null }
		if (unreadOnly) query.isRead = false
		return this.model
			.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(Math.max(1, Math.min(200, limit)))
			.exec()
	}

	async countUnread(recipientUserId: string): Promise<number> {
		return this.model.countDocuments({ recipientUserId, isRead: false, archivedAt: null }).exec()
	}

	async markRead(id: string, recipientUserId: string): Promise<any | null> {
		return this.model
			.findOneAndUpdate(
				{ _id: id, recipientUserId },
				{ $set: { isRead: true, readAt: new Date() } },
				{ new: true },
			)
			.exec()
	}

	async markAllRead(recipientUserId: string): Promise<number> {
		const res = await this.model
			.updateMany(
				{ recipientUserId, isRead: false, archivedAt: null },
				{ $set: { isRead: true, readAt: new Date() } },
			)
			.exec()
		return res.modifiedCount ?? 0
	}

	async archive(id: string, recipientUserId: string): Promise<any | null> {
		return this.model
			.findOneAndUpdate(
				{ _id: id, recipientUserId },
				{ $set: { archivedAt: new Date(), isRead: true, readAt: new Date() } },
				{ new: true },
			)
			.exec()
	}

	async archiveAll(recipientUserId: string): Promise<number> {
		const res = await this.model
			.updateMany(
				{ recipientUserId, archivedAt: null },
				{ $set: { archivedAt: new Date(), isRead: true, readAt: new Date() } },
			)
			.exec()
		return res.modifiedCount ?? 0
	}
}
