import { GraphQLValidationError } from '@repo/errors'
import {
	deriveSalesEnquiryWorkflowStatus,
	RECORD_APPROVAL_APPROVED,
	RECORD_APPROVAL_DRAFT,
	RECORD_APPROVAL_PENDING,
	RECORD_APPROVAL_REJECTED,
} from '~/helpers/approval-workflow/record-approval-status'
import { SalesEnquiryRepository } from './repository'

export class SalesEnquiryService {
	private repository: SalesEnquiryRepository

	constructor() {
		this.repository = new SalesEnquiryRepository()
	}

	private async generateEnquiryNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null })
		const seqNumber = (count + 1).toString().padStart(4, '0')
		return `SE-${`${organizationId}`.slice(-6).toUpperCase()}-${seqNumber}`
	}

	async createSalesEnquiry(data: any, userId: string, organizationId: string): Promise<any> {
		const enquiryNumber = await this.generateEnquiryNumber(organizationId)
		const partyId = data.customerId || data.clientId
		if (!partyId) throw new GraphQLValidationError('customerId is required')
		return this.repository.create({
			...data,
			enquiryNumber,
			customerId: partyId,
			clientId: partyId,
			organizationId,
			createdBy: userId,
			approvalStatus: RECORD_APPROVAL_DRAFT,
		})
	}

	async updateSalesEnquiry(id: string, data: any): Promise<any> {
		return this.repository.update(id, { ...data, updatedAt: new Date() })
	}

	async submitForApproval(id: string): Promise<any> {
		const doc = await this.repository.findById(id)
		if (!doc || doc.deletedAt) throw new GraphQLValidationError('Sales enquiry not found')
		const wf = deriveSalesEnquiryWorkflowStatus(doc)
		if (wf !== RECORD_APPROVAL_DRAFT && wf !== RECORD_APPROVAL_REJECTED) {
			throw new GraphQLValidationError('Only draft or rejected enquiries can be sent for approval')
		}
		const now = new Date()
		return this.repository.update(id, {
			status: 'submitted',
			approvalStatus: RECORD_APPROVAL_PENDING,
			approvalRequestedAt: now,
			approvedAt: null,
			approvedBy: null,
			updatedAt: now,
		})
	}

	async approveApproval(id: string, decidedByUserId: string): Promise<any> {
		const doc = await this.repository.findById(id)
		if (!doc || doc.deletedAt) throw new GraphQLValidationError('Sales enquiry not found')
		if (deriveSalesEnquiryWorkflowStatus(doc) !== RECORD_APPROVAL_PENDING) {
			throw new GraphQLValidationError('Only enquiries pending approval can be approved')
		}
		const now = new Date()
		return this.repository.update(id, {
			status: 'under_review',
			approvalStatus: RECORD_APPROVAL_APPROVED,
			approvedAt: now,
			approvedBy: decidedByUserId,
			updatedAt: now,
		})
	}

	async declineApproval(id: string, decidedByUserId: string): Promise<any> {
		const doc = await this.repository.findById(id)
		if (!doc || doc.deletedAt) throw new GraphQLValidationError('Sales enquiry not found')
		if (deriveSalesEnquiryWorkflowStatus(doc) !== RECORD_APPROVAL_PENDING) {
			throw new GraphQLValidationError('Only enquiries pending approval can be declined')
		}
		const now = new Date()
		return this.repository.update(id, {
			status: 'approval_declined',
			approvalStatus: RECORD_APPROVAL_REJECTED,
			approvedAt: now,
			approvedBy: decidedByUserId,
			updatedAt: now,
		})
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async findByClientId(clientId: string): Promise<any[]> {
		return this.repository.findByClientId(clientId)
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.repository.findByStatus(status)
	}

	async findByAssignedTo(userId: string): Promise<any[]> {
		return this.repository.findByAssignedTo(userId)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}

	async findPaginated(filter: any, page: number, limit: number, sort: any): Promise<any> {
		return this.repository.findPaginated(filter, page, limit, sort)
	}

	async softDelete(id: string, userId: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}
}
