import { MongoBaseRepository } from '../base/mongo-repository'
import { TaxRate } from './model'

export class TaxRateRepository extends MongoBaseRepository<any> {
	constructor() {
		super(TaxRate)
	}

	async listForOrganization(
		organizationId: string,
		filters: { status?: string; appliesTo?: string; search?: string } = {},
	): Promise<any[]> {
		const query: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.status) query.status = filters.status
		if (filters.appliesTo) query.appliesTo = filters.appliesTo
		if (filters.search) {
			query.$or = [
				{ name: { $regex: filters.search, $options: 'i' } },
				{ code: { $regex: filters.search, $options: 'i' } },
				{ hsnSacCode: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(query).sort({ name: 1 }).exec()
	}
}
