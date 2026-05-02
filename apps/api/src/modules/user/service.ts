import { UserRepository } from './repository'
import { GraphQLValidationError } from '@repo/errors'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'
import bcrypt from 'bcryptjs'

export class UserService {
	private repository: UserRepository

	constructor() {
		this.repository = new UserRepository()
	}

	async createUser(data: any, createdBy?: string): Promise<any> {
		if (!data.email || !data.firstName || !data.lastName) {
			throw new GraphQLValidationError('Missing required fields')
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(data.email)) {
			throw new GraphQLValidationError('Invalid email format')
		}

		if (data.organizationId == null) {
			throw new GraphQLValidationError('organizationId is required')
		}

		const existing = await this.repository.findByEmailInOrganization(data.email, data.organizationId)
		if (existing) throw new GraphQLValidationError('User already exists')

		const orgKey = String(data.organizationId)
		const seq = await getNextSequence({ type: 'User', organizationId: orgKey })
		const seqNo = formatEntitySequence('U', orgKey, seq)
		const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : undefined

		return this.repository.create({
			...data,
			seqNo,
			passwordHash,
			password: undefined,
			status: data.status || 'active',
			createdBy,
			updatedBy: createdBy
		})
	}

	async updateUser(id: string, data: any, updatedBy?: string): Promise<any> {
		return this.repository.update(id, { ...data, updatedBy, updatedAt: new Date() })
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async findByEmail(email: string): Promise<any> {
		return this.repository.findByEmail(email)
	}

	async findByRole(role: string): Promise<any[]> {
		return this.repository.findByRole(role)
	}

	async findWithPagination(filter: any, options: any): Promise<any> {
		return this.repository.findWithPagination(filter, options)
	}

	async softDeleteUser(id: string, deletedBy?: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy, status: 'deleted' })
	}
}
