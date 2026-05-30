import { Types } from 'mongoose'
import { MongoBaseRepository } from '../base/mongo-repository'
import { PackageAssignment } from './model'

function toObjectId(id: string): Types.ObjectId | null {
	if (!id || !Types.ObjectId.isValid(id)) return null
	return new Types.ObjectId(id)
}

export class PackageAssignmentRepository extends MongoBaseRepository<any> {
	constructor() {
		super(PackageAssignment)
	}

	async findByPackageAndOrg(packageId: string, organizationId: string): Promise<any | null> {
		const pid = toObjectId(packageId)
		const oid = toObjectId(organizationId)
		if (!pid || !oid) return null
		return this.model
			.findOne({ packageId: pid, organizationId: oid })
			.lean()
			.exec()
	}

	async listByPackage(packageId: string): Promise<any[]> {
		const pid = toObjectId(packageId)
		if (!pid) return []
		return this.model
			.find({ packageId: pid })
			.sort({ updatedAt: -1 })
			.lean()
			.exec()
	}

	async findForOrganization(organizationId: string): Promise<any | null> {
		const oid = toObjectId(organizationId)
		if (!oid) return null
		return this.model
			.findOne({ organizationId: oid })
			.sort({ updatedAt: -1 })
			.lean()
			.exec()
	}
}
