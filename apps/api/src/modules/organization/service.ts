import { OrganizationRepository } from './repository'
import { UserService } from '../user/service'
import { ROLES } from '../role/permissions'

export class OrganizationService {
	private repository: OrganizationRepository

	constructor() {
		this.repository = new OrganizationRepository()
	}

	async create(data: any): Promise<any> {
		return this.repository.create(data)
	}

	async createWithOrgAdmin(
		payload: {
			organization: Record<string, unknown>
			orgAdmin: {
				email: string
				firstName: string
				lastName: string
				password: string
			}
		},
		platformUserId: string,
		parentOrganizationId?: string | null,
	): Promise<any> {
		const code = (payload.organization.code as string | undefined)?.trim()
			? String(payload.organization.code).trim().toUpperCase()
			: await this.generateOrganizationCode()
		const org = await this.repository.create({
			...payload.organization,
			code,
			parentOrganizationId: parentOrganizationId || null,
			createdBy: platformUserId,
			status: 'active',
		})
		const userService = new UserService()
		try {
			await userService.createUser(
				{
					email: payload.orgAdmin.email,
					firstName: payload.orgAdmin.firstName,
					lastName: payload.orgAdmin.lastName,
					password: payload.orgAdmin.password,
					organizationId: org._id,
					roles: [ROLES.ORG_ADMIN],
				},
				platformUserId,
			)
		} catch (err) {
			await this.repository.delete(org._id)
			throw err
		}
		return org
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async update(id: string, data: any): Promise<any> {
		return this.repository.update(id, data)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}

	async findChildren(parentOrganizationId: string): Promise<any[]> {
		return (this.repository as any).model
			.find({ parentOrganizationId, deletedAt: null })
			.sort({ createdAt: -1 })
			.lean()
			.exec()
	}

	private async generateOrganizationCode(): Promise<string> {
		const count = await (this.repository as any).model.countDocuments({}).exec()
		return `ORG-${String(count + 1).padStart(4, '0')}`
	}
}
