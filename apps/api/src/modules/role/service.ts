import { RoleRepository } from './repository'
import { GraphQLValidationError } from '@repo/errors'
import {
	ORG_CUSTOM_ROLE_FORBIDDEN_RESOURCES,
	RESOURCES,
	ROLE_PERMISSIONS,
} from './permissions'

const VALID_ACTIONS = new Set(['create', 'read', 'update', 'delete'])
const RESOURCE_VALUES = new Set<string>(Object.values(RESOURCES))

/** Validates name + permission rows for roles created/updated by an organization admin. */
export function validateOrgTenantRoleDefinition(input: {
	name: string
	permissions: Array<{ resource: string; actions: string[] }>
}) {
	const name = String(input.name || '').trim()
	if (!/^[A-Z][A-Z0-9_]*$/.test(name)) {
		throw new GraphQLValidationError(
			'Role name must be UPPER_SNAKE_CASE starting with a letter (e.g. REGIONAL_LEAD).',
		)
	}
	if (ROLE_PERMISSIONS[name as keyof typeof ROLE_PERMISSIONS]) {
		throw new GraphQLValidationError('This name is reserved for a built-in role template.')
	}
	for (const p of input.permissions || []) {
		const res = String(p?.resource || '')
		if (!res || ORG_CUSTOM_ROLE_FORBIDDEN_RESOURCES.has(res)) {
			throw new GraphQLValidationError(
				`Resource not allowed in tenant-defined roles: ${res || '(missing)'}`,
			)
		}
		if (!RESOURCE_VALUES.has(res)) {
			throw new GraphQLValidationError(`Unknown resource: ${res}`)
		}
		for (const a of p.actions || []) {
			if (!VALID_ACTIONS.has(String(a))) {
				throw new GraphQLValidationError(`Invalid action: ${a}`)
			}
		}
	}
}

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
