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
}
