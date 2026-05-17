import { MongoBaseRepository } from '../base/mongo-repository'
import { FixedAsset } from './model'

export class FixedAssetRepository extends MongoBaseRepository<any> {
	constructor() {
		super(FixedAsset)
	}

	async listForOrganization(
		organizationId: string,
		filters: { status?: string; category?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.category) q.category = filters.category
		if (filters.search) {
			q.$or = [
				{ name: { $regex: filters.search, $options: 'i' } },
				{ assetCode: { $regex: filters.search, $options: 'i' } },
				{ serialNumber: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ createdAt: -1 }).exec()
	}

	async summaryByCategory(organizationId: string): Promise<any[]> {
		return this.model.aggregate([
			{ $match: { organizationId: this.toObjectId(organizationId), deletedAt: null } },
			{
				$group: {
					_id: '$category',
					count: { $sum: 1 },
					acquisitionCost: { $sum: '$acquisitionCost' },
					accumulatedDepreciation: { $sum: '$accumulatedDepreciation' },
					bookValue: { $sum: '$bookValue' },
				},
			},
		])
	}

	private toObjectId(id: string): any {
		// Mongoose handles string→ObjectId in match, but be defensive on legacy data
		const mongoose = require('mongoose')
		try {
			return new mongoose.Types.ObjectId(id)
		} catch {
			return id
		}
	}
}
