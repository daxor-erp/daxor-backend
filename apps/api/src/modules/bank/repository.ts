import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Bank } from './model'

interface IBankDocument extends IBaseEntity {
	name: string
	bankIdentifierCode?: string
	address?: string
	phone?: string
	email?: string
	organizationId: unknown
}

export class BankRepository extends MongoBaseRepository<IBankDocument> {
	constructor() {
		super(Bank as any)
	}

	async listForOrganization(organizationId: string, search?: string) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (search?.trim()) {
			q.$or = [
				{ name: { $regex: search.trim(), $options: 'i' } },
				{ bankIdentifierCode: { $regex: search.trim(), $options: 'i' } },
			]
		}
		return this.model.find(q).sort({ name: 1 }).limit(500).exec()
	}
}
