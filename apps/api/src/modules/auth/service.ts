import { UserRepository } from '../user/repository'
import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '~/config'

export class AuthService {
	private userRepository: UserRepository

	constructor() {
		this.userRepository = new UserRepository()
	}

	async login(email: string, password: string) {
		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new GraphQLAuthError('Invalid credentials')

		const isValid = await bcrypt.compare(password, user.passwordHash)
		if (!isValid) throw new GraphQLAuthError('Invalid credentials')

		const roles = Array.isArray(user.roles) ? user.roles : []
		const organizationId =
			user.organizationId != null ? String(user.organizationId) : null
		const token = jwt.sign(
			{
				id: String(user._id),
				email: user.email,
				roles,
				role: roles[0],
				organizationId,
			},
			config.jwtSecret,
			{ expiresIn: config.jwtExpiresIn }
		)

		return { token, user }
	}

	async register(data: any) {
		if (!data.email || !data.password) throw new GraphQLValidationError('Email and password required')

		const existing = await this.userRepository.findByEmail(data.email)
		if (existing) throw new GraphQLValidationError('User already exists')

		const passwordHash = await bcrypt.hash(data.password, 10)
		const user = await this.userRepository.create({ ...data, passwordHash, status: 'active' })

		const roles = Array.isArray(user.roles) ? user.roles : []
		const organizationId =
			user.organizationId != null ? String(user.organizationId) : null
		const token = jwt.sign(
			{
				id: String(user._id),
				email: user.email,
				roles,
				role: roles[0],
				organizationId,
			},
			config.jwtSecret,
			{ expiresIn: config.jwtExpiresIn }
		)

		return { token, user }
	}

	async getUserById(id: string) {
		return this.userRepository.findById(id)
	}
}
