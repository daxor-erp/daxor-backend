import { MongoBaseRepository } from '../base/mongo-repository'
import { QCInspection } from './model'

export class QualityControlRepository extends MongoBaseRepository<any> {
	constructor() {
		super(QCInspection)
	}

	async list(
		organizationId: string,
		filters: { outcome?: string; sourceModule?: string; sourceId?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.outcome) q.outcome = filters.outcome
		if (filters.sourceModule) q.sourceModule = filters.sourceModule
		if (filters.sourceId) q.sourceId = filters.sourceId
		if (filters.search) {
			q.$or = [
				{ docNumber: { $regex: filters.search, $options: 'i' } },
				{ itemName: { $regex: filters.search, $options: 'i' } },
				{ batchNumber: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ inspectionDate: -1, createdAt: -1 }).limit(500).exec()
	}

	async outcomeSummary(organizationId: string): Promise<any[]> {
		return this.model.aggregate([
			{ $match: { organizationId: this.toObjectId(organizationId), deletedAt: null } },
			{
				$group: {
					_id: '$outcome',
					count: { $sum: 1 },
					quantityInspected: { $sum: '$quantityInspected' },
					quantityPassed: { $sum: '$quantityPassed' },
					quantityFailed: { $sum: '$quantityFailed' },
				},
			},
		])
	}

	private toObjectId(id: string): any {
		const mongoose = require('mongoose')
		try {
			return new mongoose.Types.ObjectId(id)
		} catch {
			return id
		}
	}
}
