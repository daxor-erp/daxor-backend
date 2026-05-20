import { GraphQLValidationError } from '@repo/errors'
import { EmployeeMasterRepository } from './repository'
import { User } from '../user/model'

export interface EmployeeMasterInput {
	organizationId: string
	userId?: string | null
	employeeCode?: string
	firstName: string
	lastName: string
	dateOfBirth?: string | Date | null
	gender?: string
	bloodGroup?: string
	nationality?: string
	maritalStatus?: string
	personalEmail?: string
	workEmail?: string
	phone?: string
	alternatePhone?: string
	address?: string
	city?: string
	state?: string
	country?: string
	pincode?: string
	designation?: string
	department?: string
	reportsToUserId?: string | null
	dateOfJoining: string | Date
	dateOfConfirmation?: string | Date | null
	dateOfRelieving?: string | Date | null
	employmentType?: string
	workLocation?: string
	shiftMasterId?: string | null
	basicSalary?: number
	currency?: string
	panNumber?: string
	aadhaarNumber?: string
	uanNumber?: string
	esiNumber?: string
	bankDetails?: { bankName?: string; accountNumber?: string; ifscCode?: string; branchName?: string }
	emergencyContact?: { name?: string; relation?: string; phone?: string }
	status?: string
	notes?: string
}

export class EmployeeMasterService {
	private repository: EmployeeMasterRepository
	constructor() {
		this.repository = new EmployeeMasterRepository()
	}

	async create(input: EmployeeMasterInput): Promise<any> {
		this.validate(input)
		const employeeCode = input.employeeCode?.trim()
			? input.employeeCode.trim().toUpperCase()
			: await this.generateEmployeeCode(input.organizationId)
		const userId = input.userId?.toString().trim()
			? input.userId
			: await this.provisionUser(input)
		return this.repository.create({
			...input,
			userId,
			employeeCode,
			firstName: input.firstName.trim(),
			lastName: input.lastName.trim(),
		})
	}

	private async provisionUser(input: EmployeeMasterInput): Promise<string> {
		const firstName = input.firstName.trim()
		const lastName = input.lastName.trim()
		const email = (input.workEmail || input.personalEmail || '').trim().toLowerCase()
		const fallbackEmail = email || `${firstName}.${lastName}.${Date.now()}@noemail.local`.toLowerCase().replace(/\s+/g, '-')
		const user = await User.create({
			firstName,
			lastName,
			email: fallbackEmail,
			phone: input.phone,
			organizationId: input.organizationId,
			roles: ['employee'],
			userType: 'employee',
			status: 'active',
		})
		return String(user._id)
	}

	private async generateEmployeeCode(organizationId: string): Promise<string> {
		const count = await (this.repository as any).model.countDocuments({ organizationId }).exec()
		return `EMP-${String(count + 1).padStart(4, '0')}`
	}

	async update(id: string, input: Partial<EmployeeMasterInput>): Promise<any> {
		const patch: Record<string, unknown> = { ...input }
		if (input.employeeCode) patch.employeeCode = input.employeeCode.trim().toUpperCase()
		if (input.firstName) patch.firstName = input.firstName.trim()
		if (input.lastName) patch.lastName = input.lastName.trim()
		return this.repository.update(id, patch as any)
	}

	async list(organizationId: string, filters: any = {}) {
		return this.repository.list(organizationId, filters)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string) {
		return this.repository.softDelete(id)
	}

	private validate(input: EmployeeMasterInput) {
		if (!input.organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!input.firstName?.trim() || !input.lastName?.trim()) {
			throw new GraphQLValidationError('First + last name are required')
		}
		if (!input.dateOfJoining) throw new GraphQLValidationError('Date of joining is required')
	}
}
