import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { PaymentTerm } from './model'

interface IPaymentTermDocument extends IBaseEntity {
	name: string
	dueDays: number
	description?: string
	isActive: boolean
	organizationId: unknown
}

export class PaymentTermRepository extends MongoBaseRepository<IPaymentTermDocument> {
	constructor() {
		super(PaymentTerm as any)
	}

	async listForOrganization(organizationId: string, filters: { isActive?: boolean } = {}) {
		const q: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filters.isActive != null) q.isActive = filters.isActive
		return this.model.find(q).sort({ dueDays: 1, name: 1 }).limit(200).exec()
	}
}
