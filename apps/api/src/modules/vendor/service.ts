import { GraphQLValidationError } from '@repo/errors'
import { userIdForRef } from '~/lib/user-ref'
import { VendorRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'

export class VendorService {
  private repository: VendorRepository

  constructor() {
    this.repository = new VendorRepository()
  }

  async createVendor(data: any, userId: string) {
    const { createdBy: _c, updatedBy: _u, ...rest } = data
    const seq = await getNextSequence({ type: 'Vendor', organizationId: rest.organizationId })
    const seqNo = formatEntitySequence('V', rest.organizationId.toString(), seq)
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = {
      ...rest,
      seqNo,
      orgApprovalStatus: 'draft',
      status: 'inactive',
    }
    if (uid) {
      payload.createdBy = uid
      payload.updatedBy = uid
    }
    return this.repository.create(payload)
  }

  async getVendorById(id: string) {
    return this.repository.findById(id)
  }

  async getAllVendors(filter: any = {}, page = 1, limit = 100) {
    const result = await this.repository.findPaginated(
      { ...filter, deletedAt: null },
      page,
      limit,
      { createdAt: -1 }
    )
    return result.data
  }

  async updateVendor(id: string, data: any, userId: string) {
    const existing = await this.repository.findById(id)
    if (!existing || existing.deletedAt) throw new GraphQLValidationError('Vendor not found')
    const ap = String((existing as any).orgApprovalStatus ?? 'approved')
    if (ap === 'submitted') throw new GraphQLValidationError('Vendor is pending approval and cannot be edited')
    const { createdBy: _c, updatedBy: _u, status: incomingStatus, orgApprovalStatus: _oa, ...rest } = data
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = { ...rest }
    if (uid) payload.updatedBy = uid
    if (ap === 'approved' && incomingStatus != null && String(incomingStatus).trim() !== '') {
      payload.status = incomingStatus
    }
    return this.repository.update(id, payload)
  }

	async submitForOrgApproval(id: string, userId: string) {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Vendor not found')
		const ap = String((row as any).orgApprovalStatus ?? 'approved')
		if (ap !== 'draft' && ap !== 'approval_declined') {
			throw new GraphQLValidationError('Only draft or declined vendors can be sent for approval')
		}
		const uid = userIdForRef(userId)
		const payload: Record<string, unknown> = { orgApprovalStatus: 'submitted' }
		if (uid) payload.updatedBy = uid
		return this.repository.update(id, payload)
	}

	/**
	 * Roll back vendor lifecycle if approval queue enqueue fails after transitioning to submitted.
	 */
	async revertSubmissionAfterEnqueueFailure(id: string, userId: string) {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) return row
		if (String((row as any).orgApprovalStatus ?? '') !== 'submitted') return row
		const uid = userIdForRef(userId)
		const payload: Record<string, unknown> = { orgApprovalStatus: 'draft' }
		if (uid) payload.updatedBy = uid
		return this.repository.update(id, payload)
	}

  async approveFromApprovalQueue(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Vendor not found')
    if (String((row as any).orgApprovalStatus ?? 'approved') !== 'submitted') {
      throw new GraphQLValidationError('Only vendors pending approval can be approved')
    }
    const uid = userIdForRef(userId)
    return this.repository.update(id, {
      orgApprovalStatus: 'approved',
      status: 'active',
      ...(uid ? { updatedBy: uid } : {}),
    })
  }

  async declineFromApprovalQueue(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Vendor not found')
    if (String((row as any).orgApprovalStatus ?? 'approved') !== 'submitted') {
      throw new GraphQLValidationError('Only vendors pending approval can be declined')
    }
    const uid = userIdForRef(userId)
    return this.repository.update(id, {
      orgApprovalStatus: 'approval_declined',
      status: 'inactive',
      ...(uid ? { updatedBy: uid } : {}),
    })
  }

  async deleteVendor(id: string, userId: string) {
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = { deletedAt: new Date() }
    if (uid) payload.deletedBy = uid
    return this.repository.update(id, payload)
  }
}
