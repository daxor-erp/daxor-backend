import { ReturnAuthorizationRepository } from './repository'

export class ReturnAuthorizationService {
	private repository: ReturnAuthorizationRepository

	constructor() {
		this.repository = new ReturnAuthorizationRepository()
	}

	private async generateRaNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({
			organizationId,
			deletedAt: null,
		} as any)
		return `RA-${`${organizationId}`.slice(-4).toUpperCase()}-${String(count + 1).padStart(5, '0')}`
	}

	async create(data: any, userId: string) {
		const lines = data.lines ?? []
		if (!lines.length) throw new Error('At least one line item is required')
		for (const line of lines) {
			if (!line.description?.trim()) throw new Error('Each line must have a description')
			if (!(Number(line.quantity) > 0)) throw new Error('Each line must have a positive quantity')
		}
		const raNumber = await this.generateRaNumber(data.organizationId)
		return this.repository.create({
			...data,
			raNumber,
			status: 'pending',
			requestedDate: data.requestedDate ? new Date(data.requestedDate) : new Date(),
			createdBy: userId,
			updatedBy: userId,
		})
	}

	async getById(id: string) {
		return this.repository.findById(id)
	}

	async list(organizationId: string, filter: Record<string, unknown> = {}, page = 1, limit = 100) {
		const f: Record<string, unknown> = { organizationId, deletedAt: null }
		if (filter.status) f.status = filter.status
		if (filter.customerId) f.customerId = filter.customerId
		if (filter.receiptComplete === true) {
			f.receiptComplete = true
		} else if (filter.receiptComplete === false) {
			// Include legacy docs without the field (treated as not complete)
			f.receiptComplete = { $ne: true } as any
		}
		const result = await this.repository.findPaginated(f as any, page, limit, { requestedDate: -1 })
		return result.data
	}

	async receiveGoods(
		input: {
			returnAuthorizationId: string
			receivedDate: string
			notes?: string
			lines: Array<{ lineId: string; quantityReceived: number }>
		},
		userId: string,
	) {
		const linesIn = input.lines ?? []
		if (!linesIn.length) throw new Error('At least one line is required')

		const doc = await this.repository.findById(input.returnAuthorizationId)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'approved') throw new Error('Only approved return authorizations can receive goods')

		const receivedDate = new Date(input.receivedDate)
		if (Number.isNaN(receivedDate.getTime())) throw new Error('Invalid received date')

		for (const row of linesIn) {
			const sub = (doc as any).lines.id(row.lineId)
			if (!sub) throw new Error(`Line ${row.lineId} not found`)
			const add = Number(row.quantityReceived)
			if (!(add > 0)) throw new Error('Each line must have a positive quantity received')
			const max = Number(sub.quantity)
			const prev = Number(sub.quantityReceived ?? 0)
			sub.quantityReceived = Math.min(max, prev + add)
		}

		;(doc as any).markModified('lines')
		if (!(doc as any).goodsReceivedAt) (doc as any).goodsReceivedAt = receivedDate
		if (input.notes?.trim()) (doc as any).receiptNotes = input.notes.trim()
		const allComplete = (doc as any).lines.every(
			(l: any) => Number(l.quantityReceived ?? 0) >= Number(l.quantity),
		)
		;(doc as any).receiptComplete = allComplete
		;(doc as any).goodsReceivedBy = userId
		;(doc as any).updatedBy = userId
		await (doc as any).save()
		return doc
	}

	async approve(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'pending') throw new Error('Only pending return authorizations can be approved')
		return this.repository.update(id, {
			status: 'approved',
			approvedAt: new Date(),
			approvedBy: userId,
			updatedBy: userId,
		})
	}

	async reject(id: string, userId: string, rejectionReason?: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'pending') throw new Error('Only pending return authorizations can be rejected')
		return this.repository.update(id, {
			status: 'rejected',
			rejectionReason: rejectionReason ?? '',
			rejectedAt: new Date(),
			rejectedBy: userId,
			updatedBy: userId,
		})
	}

	async cancel(id: string, userId: string) {
		const doc = await this.repository.findById(id)
		if (!doc) throw new Error('Return authorization not found')
		if ((doc as any).deletedAt) throw new Error('Return authorization was deleted')
		if (doc.status !== 'pending') throw new Error('Only pending return authorizations can be cancelled')
		return this.repository.update(id, {
			status: 'cancelled',
			updatedBy: userId,
		})
	}

	async softDelete(id: string, userId: string) {
		return this.repository.update(id, { deletedAt: new Date(), updatedBy: userId })
	}
}
