import { MongoBaseRepository } from '../base/mongo-repository'
import { ApprovalRequest } from './model'

export class ApprovalRequestRepository extends MongoBaseRepository<any> {
	constructor() {
		super(ApprovalRequest)
	}

	async findPendingForEntity(entityType: string, entityId: string): Promise<any | null> {
		return this.model
			.findOne({
				entityType,
				entityId,
				status: 'PENDING',
			})
			.exec()
	}

	async listPendingForAssignee(assigneeUserId: string): Promise<any[]> {
		return this.model
			.find({
				assigneeApproverUserId: assigneeUserId,
				status: 'PENDING',
			})
			.sort({ createdAt: -1 })
			.exec()
	}

	async listForUser(
		userId: string,
		opts: { status?: string; role?: 'REQUESTER' | 'APPROVER' | 'ANY'; limit?: number; skip?: number } = {},
	): Promise<any[]> {
		const role = opts.role ?? 'ANY'
		const userClause =
			role === 'REQUESTER'
				? { requesterUserId: userId }
				: role === 'APPROVER'
					? { assigneeApproverUserId: userId }
					: { $or: [{ requesterUserId: userId }, { assigneeApproverUserId: userId }] }

		const filter: Record<string, unknown> = { ...userClause }
		if (opts.status) filter.status = opts.status

		return this.model
			.find(filter)
			.sort({ updatedAt: -1, createdAt: -1 })
			.skip(Math.max(0, opts.skip ?? 0))
			.limit(Math.max(1, Math.min(opts.limit ?? 50, 200)))
			.exec()
	}
}
