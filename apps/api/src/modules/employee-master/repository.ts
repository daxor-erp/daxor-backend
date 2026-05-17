import { MongoBaseRepository } from '../base/mongo-repository'
import { EmployeeMaster } from './model'

export class EmployeeMasterRepository extends MongoBaseRepository<any> {
	constructor() {
		super(EmployeeMaster)
	}

	async list(
		organizationId: string,
		filters: { status?: string; department?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.department) q.department = filters.department
		if (filters.search) {
			q.$or = [
				{ employeeCode: { $regex: filters.search, $options: 'i' } },
				{ firstName: { $regex: filters.search, $options: 'i' } },
				{ lastName: { $regex: filters.search, $options: 'i' } },
				{ workEmail: { $regex: filters.search, $options: 'i' } },
				{ phone: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ dateOfJoining: -1 }).limit(500).exec()
	}
}
