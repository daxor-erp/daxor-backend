import { RoleRepository } from './repository'
import { ROLE_PERMISSIONS } from './permissions'

export class RoleService {
  private repository: RoleRepository

  constructor() {
    this.repository = new RoleRepository()
  }

  async createRole(data: any, userId: string) {
    return this.repository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async getRoleById(id: string) {
    return this.repository.findById(id)
  }

  async getRoleByName(name: string, organizationId?: string) {
    return this.repository.findByName(name, organizationId)
  }

  async getRolesByOrganization(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getSystemRoles() {
    return this.repository.findSystemRoles()
  }

  async getAllRoles() {
    return this.repository.findAll()
  }

  async updateRole(id: string, data: any, userId: string) {
    return this.repository.update(id, {
      ...data,
      updatedBy: userId,
    })
  }

  async deleteRole(id: string, userId: string) {
    return this.repository.softDelete(id)
  }

  async seedSystemRoles() {
    const existingRoles = await this.getSystemRoles()
    if (existingRoles.length > 0) return existingRoles

    const roles = Object.entries(ROLE_PERMISSIONS).map(([name, config]) => ({
      name,
      displayName: config.displayName,
      description: config.description,
      permissions: config.permissions,
      isSystemRole: true,
    }))

    return Promise.all(roles.map(role => this.repository.create(role)))
  }
}
