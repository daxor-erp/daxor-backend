import { GraphQLValidationError } from '@repo/errors'
import { EmployeeMasterRepository } from './repository'

export interface EmployeeMasterInput {
	organizationId: string
	userId?: string | null
	employeeCode: string
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
		return this.repository.create({
			...input,
			employeeCode: input.employeeCode.trim().toUpperCase(),
			firstName: input.firstName.trim(),
			lastName: input.lastName.trim(),
		})
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
		if (!input.employeeCode?.trim()) throw new GraphQLValidationError('Employee code is required')
		if (!input.firstName?.trim() || !input.lastName?.trim()) {
			throw new GraphQLValidationError('First + last name are required')
		}
		if (!input.dateOfJoining) throw new GraphQLValidationError('Date of joining is required')
	}
}
