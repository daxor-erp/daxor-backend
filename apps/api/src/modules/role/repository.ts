import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Role } from './model'
import type { Document } from 'mongoose'

interface IRoleDocument extends IBaseEntity {
  name: string
  displayName: string
  description?: string
  permissions: Array<{ resource: string; actions: string[] }>
  organizationId?: any
  isSystemRole: boolean
}

export class RoleRepository extends MongoBaseRepository<IRoleDocument> {
  constructor() {
    super(Role as any)
  }

  async findByName(name: string, organizationId?: string) {
    const query: any = { name, deletedAt: null }
    if (organizationId) query.organizationId = organizationId
    return this.model.findOne(query)
  }

  async findByOrganization(organizationId: string) {
    return this.model.find({ organizationId, deletedAt: null })
  }

  async findSystemRoles() {
    return this.model.find({ isSystemRole: true, deletedAt: null })
  }
}
