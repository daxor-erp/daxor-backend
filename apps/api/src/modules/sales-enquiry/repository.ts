import { MongoBaseRepository } from '../base/mongo-repository'
import { SalesEnquiry } from './model'
import {
	RECORD_APPROVAL_DRAFT,
	RECORD_APPROVAL_PENDING,
} from '~/helpers/approval-workflow/record-approval-status'

export class SalesEnquiryRepository extends MongoBaseRepository<any> {
	constructor() {
		super(SalesEnquiry)
	}

	async findByClientId(clientId: string): Promise<any[]> {
		return this.findAllActive({ clientId })
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.findAllActive({ status })
	}

	async findByAssignedTo(userId: string): Promise<any[]> {
		return this.findAllActive({ assignedTo: userId })
	}

	async findByEnquiryNumber(enquiryNumber: string): Promise<any | null> {
		return this.findOne({ enquiryNumber, deletedAt: null })
	}

	async findByOrganization(organizationId: string): Promise<any[]> {
		return this.findAllActive({ organizationId })
	}

	async findPendingApprovalByOrganization(organizationId: string): Promise<any[]> {
		return this.model
			.find({
				organizationId,
				deletedAt: null,
				$or: [
					{ approvalStatus: RECORD_APPROVAL_PENDING },
					{
						status: 'submitted',
						approvalStatus: { $in: [null, RECORD_APPROVAL_DRAFT] },
					},
				],
			})
			.exec()
	}
}
