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

  async createQuotation(data: any, userId: string): Promise<any> {
    const quotationNumber = data.quotationNumber || await this.generateQuotationNumber(data.organizationId)
    return this.repository.create({ ...data, quotationNumber, createdBy: userId, updatedBy: userId })
  }

  async getQuotationById(id: string): Promise<any> {
    return this.repository.findById(id)
  }

  async getAllQuotations(filter: any = {}, page = 1, limit = 100): Promise<any[]> {
    const result = await this.repository.findPaginated({ ...filter, deletedAt: null }, page, limit, { createdAt: -1 })
    return result.data
  }

  async getQuotationsByOrganization(organizationId: string): Promise<any[]> {
    return this.repository.findByOrganization(organizationId)
  }

  async getQuotationsByClient(clientId: string): Promise<any[]> {
    return this.repository.findByClient(clientId)
  }

  async getQuotationsByStatus(status: string, organizationId: string): Promise<any[]> {
    return this.repository.findByStatus(status, organizationId)
  }

  async updateQuotation(id: string, data: any, userId: string): Promise<any> {
    return this.repository.update(id, { ...data, updatedBy: userId, updatedAt: new Date() })
  }

  async deleteQuotation(id: string): Promise<any> {
    return this.repository.softDelete(id)
  }

  async sendQuotation(id: string, userId: string, userOrganizationId?: string): Promise<{ quotation: any; emailSent: boolean }> {
    const doc = await this.repository.findById(id)
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
      const plain = typeof (populated as any).toObject === 'function' ? (populated as any).toObject() : populated
      await sendQuotationEmailToClient(plain)
      emailSent = true
    } catch (e) {
      logger.error('sendQuotation email error', e)
      throw new GraphQLValidationError(e instanceof Error ? e.message : 'Failed to send quotation email')
    }

    const updated = await this.repository.update(id, {
      status: 'sent',
      sentAt: new Date(),
      ...(userId ? { sentBy: userId } : {}),
    })
    if (!updated) throw new GraphQLValidationError('Quotation not found')

    const out = await Quotation.populate(updated, { path: 'clientId', select: 'id name email' })
    return { quotation: out, emailSent }
  }
}
