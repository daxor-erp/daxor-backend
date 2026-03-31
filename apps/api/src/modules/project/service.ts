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
    return this.repository.create({ ...data, seqNo, createdBy: userId, updatedBy: userId })
  }

  async findById(id: string): Promise<any> {
    return this.repository.findById(id)
  }

  async update(id: string, data: any, userId?: string): Promise<any> {
    return this.repository.update(id, { ...data, updatedBy: userId })
  }

  async findWithPagination(filter: any, options: any): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    return this.repository.findPaginated(filter, page, limit, sort)
  }
}
