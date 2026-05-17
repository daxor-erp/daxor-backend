import { MongoBaseRepository } from '../base/mongo-repository'
import { AssetMaintenance } from './model'

export class AssetMaintenanceRepository extends MongoBaseRepository<any> {
	constructor() {
		super(AssetMaintenance)
	}

	async list(
		organizationId: string,
		filters: { status?: string; assetId?: string; maintenanceType?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.assetId) q.assetId = filters.assetId
		if (filters.maintenanceType) q.maintenanceType = filters.maintenanceType
		if (filters.search) {
			q.$or = [
				{ docNumber: { $regex: filters.search, $options: 'i' } },
				{ assetName: { $regex: filters.search, $options: 'i' } },
				{ description: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ scheduledDate: -1, createdAt: -1 }).limit(500).exec()
	}

	async upcoming(organizationId: string, days = 30): Promise<any[]> {
		const now = new Date()
		const horizon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
		return this.model
			.find({
				organizationId,
				deletedAt: null,
				status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'OVERDUE'] },
				scheduledDate: { $gte: now, $lte: horizon },
			})
			.sort({ scheduledDate: 1 })
			.exec()
	}
}
