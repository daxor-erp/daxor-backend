import { MongoBaseRepository } from '../base/mongo-repository'
import { IntercompanyJournalEntry } from './model'

export class IntercompanyJournalRepository extends MongoBaseRepository<any> {
	constructor() {
		super(IntercompanyJournalEntry)
	}

	async list(
		originatingOrganizationId: string,
		filters: { status?: string; allocationId?: string; search?: string } = {},
	): Promise<any[]> {
		const q: Record<string, unknown> = { originatingOrganizationId, deletedAt: null }
		if (filters.status) q.status = filters.status
		if (filters.allocationId) q.allocationId = filters.allocationId
		if (filters.search) {
			q.$or = [
				{ docNumber: { $regex: filters.search, $options: 'i' } },
				{ description: { $regex: filters.search, $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ entryDate: -1, createdAt: -1 }).limit(500).exec()
	}
}
