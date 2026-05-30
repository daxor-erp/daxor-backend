import { MongoBaseRepository } from '../base/mongo-repository'
import { Types } from 'mongoose'
import { ApprovalRequest } from './model'

export class ApprovalRequestRepository extends MongoBaseRepository<any> {
	constructor() {
		super(ApprovalRequest)
	}

	async findPendingForEntity(entityType: string, entityId: string): Promise<any | null> {
		let entityOid: Types.ObjectId
		try {
			entityOid = new Types.ObjectId(String(entityId))
		} catch {
			return null
		}
		return this.model
			.findOne({
				entityType,
				entityId: entityOid,
				status: 'PENDING',
			})
			.exec()
	}

	async countPendingForEntity(entityType: string, entityId: string): Promise<number> {
		return this.model
			.countDocuments({
				entityType,
				entityId,
				status: 'PENDING',
			})
			.exec()
	}

	async listForEntity(entityType: string, entityId: string, limit = 50): Promise<any[]> {
		return this.model
			.find({ entityType, entityId })
			.sort({ createdAt: -1 })
			.limit(Math.max(1, Math.min(limit, 200)))
			.exec()
	}

	/**
	 * When multiple vendor approvers receive parallel assignments, resolving one clears the others.
	 */
	async rejectOtherPendingForEntityExcept(
		entityType: string,
		entityId: string,
		exceptMongoId: string,
		decidedByUserId: string,
		note: string,
	): Promise<void> {
		let oid: Types.ObjectId
		try {
			oid = new Types.ObjectId(String(exceptMongoId))
		} catch {
			return
		}
		await this.model
			.updateMany(
				{
					entityType,
					entityId,
					status: 'PENDING',
					_id: { $ne: oid },
				},
				{
					$set: {
						status: 'REJECTED',
						decidedByUserId,
						decidedAt: new Date(),
						resolutionNote: note,
					},
				},
			)
			.exec()
	}

	async listPendingForAssignee(assigneeUserId: string, organizationId?: string): Promise<any[]> {
		let assigneeOid: Types.ObjectId
		try {
			assigneeOid = new Types.ObjectId(String(assigneeUserId))
		} catch {
			return []
		}
		const filter: Record<string, unknown> = {
			assigneeApproverUserId: assigneeOid,
			status: 'PENDING',
		}
		if (organizationId) {
			try {
				filter.organizationId = new Types.ObjectId(String(organizationId))
			} catch {
				filter.organizationId = organizationId
			}
		}
		return this.model.find(filter).sort({ createdAt: -1 }).exec()
	}

	async reassignPendingModuleRows(
		organizationId: string,
		moduleKey: string,
		newAssigneeUserId: string,
	): Promise<void> {
		let orgOid: Types.ObjectId
		let assigneeOid: Types.ObjectId
		try {
			orgOid = new Types.ObjectId(String(organizationId))
			assigneeOid = new Types.ObjectId(String(newAssigneeUserId))
		} catch {
			return
		}
		await this.model
			.updateMany(
				{
					organizationId: orgOid,
					moduleKey,
					status: 'PENDING',
					assigneeApproverUserId: { $ne: assigneeOid },
				},
				{
					$set: {
						assigneeApproverUserId: assigneeOid,
						updatedAt: new Date(),
					},
				},
			)
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
