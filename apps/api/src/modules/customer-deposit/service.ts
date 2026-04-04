import { CustomerDepositRepository } from './repository'

export class CustomerDepositService {
	private repository: CustomerDepositRepository

	constructor() {
		this.repository = new CustomerDepositRepository()
	}

	private async generateDepositNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null } as any)
		const seq = (count + 1).toString().padStart(5, '0')
		return `CDEP-${`${organizationId}`.slice(-6).toUpperCase()}-${seq}`
	}

	async create(data: any, userId: string) {
		const amount = Math.round(Number(data.amount) * 100) / 100
		if (!(amount > 0)) throw new Error('Deposit amount must be positive')

		const depositNumber = await this.generateDepositNumber(data.organizationId)

		return this.repository.create({
			organizationId: data.organizationId,
			customerId: data.customerId,
			depositDate: data.depositDate ? new Date(data.depositDate) : new Date(),
			depositMethod: String(data.depositMethod),
			referenceNumber: data.referenceNumber?.trim() || undefined,
			amount,
			notes: data.notes?.trim() || undefined,
			status: 'confirmed',
			depositNumber,
			createdBy: userId,
			updatedBy: userId,
		} as any)
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async list(organizationId: string, filter: Record<string, unknown> = {}, page = 1, limit = 100) {
		const result = await this.repository.findPaginated(
			{ organizationId, deletedAt: null, ...filter } as any,
			page,
			limit,
			{ depositDate: -1 },
		)
		return result.data
	}

	async cancel(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Deposit not found')
		if ((doc as any).deletedAt) throw new Error('Deposit was already removed')
		if ((doc as any).status !== 'confirmed') throw new Error('Only confirmed deposits can be cancelled')
		return this.repository.update(id, {
			status: 'cancelled',
			deletedAt: new Date(),
			updatedBy: userId,
		} as any)
	}
}
