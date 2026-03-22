import { GraphQLValidationError } from '@repo/errors'
import { logger } from '~/lib/logger'
import { Quotation } from './model'
import { QuotationRepository } from './repository'
import { sendQuotationEmailToClient } from './quotation-email'

export class QuotationService {
	private repository: QuotationRepository

	constructor() {
		this.repository = new QuotationRepository()
	}

	private async generateQuotationNumber(organizationId: string): Promise<string> {
		const count = await this.repository.count({ organizationId, deletedAt: null })
		const seq = (count + 1).toString().padStart(4, '0')
		return `QT-${organizationId.slice(-6).toUpperCase()}-${seq}`
	}

	async create(data: any, userId: string, organizationId: string): Promise<any> {
		const quotationNumber = await this.generateQuotationNumber(organizationId)
		return this.repository.create({
			...data,
			quotationNumber,
			organizationId,
			createdBy: userId,
		})
	}

	async findById(id: string): Promise<any> {
		return this.repository.findById(id)
	}

	async findPaginated(filter: any, page: number, limit: number, sort: any): Promise<any> {
		return this.repository.findPaginated(filter, page, limit, sort)
	}

	async update(id: string, data: any): Promise<any> {
		return this.repository.update(id, { ...data, updatedAt: new Date() })
	}

	async softDelete(id: string, userId: string): Promise<any> {
		return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
	}

	async sendQuotation(
		id: string,
		userId: string,
		userOrganizationId?: string,
	): Promise<{ doc: any; emailSent: boolean }> {
		let doc = await this.repository.findById(id)
		if (!doc || doc.deletedAt) throw new GraphQLValidationError('Quotation not found')
		const org = doc.organizationId?.toString?.() ?? String(doc.organizationId)
		if (userOrganizationId && org && userOrganizationId !== org) {
			throw new GraphQLValidationError('Quotation not found')
		}
		if (doc.status !== 'draft') throw new GraphQLValidationError('Only draft quotations can be sent')

		const populated = await Quotation.populate(doc, { path: 'clientId', select: 'name email' })
		const clientRef = populated.clientId as { email?: string } | null | undefined
		const email = typeof clientRef === 'object' && clientRef?.email ? String(clientRef.email).trim() : ''
		if (!email) throw new GraphQLValidationError('Add an email address to the client before sending')

		let emailSent = false
		try {
			const plain = typeof (populated as { toObject?: () => any }).toObject === 'function'
				? (populated as { toObject: () => any }).toObject()
				: populated
			await sendQuotationEmailToClient(plain)
			emailSent = true
		} catch (e) {
			logger.error('sendQuotation email error', e)
			throw new GraphQLValidationError(e instanceof Error ? e.message : 'Failed to send quotation email via SMTP')
		}

		const updated = await this.repository.update(id, {
			status: 'sent',
			sentAt: new Date(),
			...(userId ? { sentBy: userId } : {}),
		})
		if (!updated) throw new GraphQLValidationError('Quotation not found')
		const out = await Quotation.populate(updated, { path: 'clientId', select: 'id name email' })
		return { doc: out, emailSent }
	}
}
