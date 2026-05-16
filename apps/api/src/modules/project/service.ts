import { GraphQLValidationError } from '@repo/errors'
import { ProjectRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'

export class ProjectService {
  private repository: ProjectRepository

  constructor() {
    this.repository = new ProjectRepository()
  }

  async create(data: any, userId?: string): Promise<any> {
    const seq = await getNextSequence({ type: 'Project', organizationId: data.organizationId })
    const seqNo = formatEntitySequence('PRJ', data.organizationId.toString(), seq)
    const { status: _st, orgApprovalStatus: _oa, ...rest } = data
    return this.repository.create({
      ...rest,
      seqNo,
      orgApprovalStatus: 'draft',
      status: 'inactive',
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async findById(id: string): Promise<any> {
    return this.repository.findById(id)
  }

  async update(id: string, data: any, userId?: string): Promise<any> {
    const existing = await this.repository.findById(id)
    if (!existing || existing.deletedAt) throw new GraphQLValidationError('Project not found')
    const ap = String(existing.orgApprovalStatus ?? 'approved')
    if (ap === 'submitted') throw new GraphQLValidationError('Project is pending approval and cannot be edited')
    const { status: incomingStatus, orgApprovalStatus: _strip, ...rest } = data
    const payload: Record<string, unknown> = { ...rest, updatedBy: userId }
    if (ap === 'approved' && incomingStatus != null && String(incomingStatus).trim() !== '') {
      payload.status = incomingStatus
    }
    return this.repository.update(id, payload)
  }

  async submitForOrgApproval(id: string, userId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Project not found')
    const ap = String(row.orgApprovalStatus ?? 'approved')
    if (ap !== 'draft' && ap !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined projects can be sent for approval')
    }
    return this.repository.update(id, { orgApprovalStatus: 'submitted', updatedBy: userId })
  }

  async approveFromApprovalQueue(id: string, userId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Project not found')
    if (String(row.orgApprovalStatus ?? 'approved') !== 'submitted') {
      throw new GraphQLValidationError('Only projects pending approval can be approved')
    }
    return this.repository.update(id, {
      orgApprovalStatus: 'approved',
      status: 'active',
      updatedBy: userId,
    })
  }

  async declineFromApprovalQueue(id: string, userId?: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Project not found')
    if (String(row.orgApprovalStatus ?? 'approved') !== 'submitted') {
      throw new GraphQLValidationError('Only projects pending approval can be declined')
    }
    return this.repository.update(id, {
      orgApprovalStatus: 'approval_declined',
      status: 'inactive',
      updatedBy: userId,
    })
  }

  async findWithPagination(filter: any, options: any): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    return this.repository.findPaginated(filter, page, limit, sort)
  }
}
