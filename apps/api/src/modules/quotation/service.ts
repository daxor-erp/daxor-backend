import { GraphQLValidationError } from '@repo/errors'
import { logger } from '~/lib/logger'
import { Quotation } from './model'
import { QuotationRepository } from './repository'
import { sendQuotationEmailToClient } from './quotation-email'
import { normalizeQuotationCustomerId, QUOTATION_PARTY_POPULATE } from './party'
import { SalesOrderService } from '../sales-order/service'

const salesOrderService = new SalesOrderService()

export class QuotationService {
  private repository: QuotationRepository

  constructor() {
    this.repository = new QuotationRepository()
  }

  private async generateQuotationNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId, deletedAt: null })
    const seq = (count + 1).toString().padStart(4, '0')
    return `QT-${`${organizationId}`.slice(-6).toUpperCase()}-${seq}`
  }

  async createQuotation(data: any, userId: string): Promise<any> {
    const quotationNumber = data.quotationNumber || await this.generateQuotationNumber(data.organizationId)
    const customerId = normalizeQuotationCustomerId(data)
    const { clientId: _legacy, customerId: _in, ...rest } = data
    return this.repository.create({
      ...rest,
      customerId,
      quotationNumber,
      createdBy: userId,
      updatedBy: userId,
    })
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
    const patch: any = { ...data, updatedBy: userId, updatedAt: new Date() }
    if (data.customerId != null || data.clientId != null) {
      patch.customerId = normalizeQuotationCustomerId(data)
      delete patch.clientId
    }
    return this.repository.update(id, patch)
  }

  async deleteQuotation(id: string): Promise<any> {
    return this.repository.softDelete(id)
  }

  async submitForApproval(id: string, userId: string): Promise<any> {
    const doc = await this.repository.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Quotation not found')
    const st = String(doc.status)
    if (st !== 'draft' && st !== 'approval_declined') {
      throw new GraphQLValidationError('Only draft or declined quotations can be submitted for approval')
    }
    return this.repository.update(id, { status: 'submitted', updatedBy: userId, updatedAt: new Date() })
  }

  async approveApproval(id: string, userId: string): Promise<any> {
    const doc = await this.repository.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Quotation not found')
    if (String(doc.status) !== 'submitted') {
      throw new GraphQLValidationError('Only quotations pending approval can be approved')
    }
    return this.repository.update(id, { status: 'approved', updatedBy: userId, updatedAt: new Date() })
  }

  async declineApproval(id: string, userId: string): Promise<any> {
    const doc = await this.repository.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Quotation not found')
    if (String(doc.status) !== 'submitted') {
      throw new GraphQLValidationError('Only quotations pending approval can be declined')
    }
    return this.repository.update(id, { status: 'approval_declined', updatedBy: userId, updatedAt: new Date() })
  }

  async sendQuotation(id: string, userId: string, userOrganizationId?: string): Promise<{ quotation: any; emailSent: boolean }> {
    const doc = await this.repository.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Quotation not found')

    const org = doc.organizationId?.toString?.() ?? String(doc.organizationId)
    if (userOrganizationId && org && userOrganizationId !== org) {
      throw new GraphQLValidationError('Quotation not found')
    }
    const st = String(doc.status ?? '')
    if (st !== 'approved') {
      throw new GraphQLValidationError(
        st === 'draft' || st === 'submitted' || st === 'approval_declined'
          ? 'Submit for internal approval first; once approved you can send to the client.'
          : 'Only internally approved quotations can be emailed to the client.',
      )
    }

    const populated = await Quotation.populate(doc, [
      { path: 'customerId', select: 'name email docNumber' },
      { path: 'clientId', select: 'name email' },
    ])
    const party =
      (populated as any).customerId && typeof (populated as any).customerId === 'object'
        ? (populated as any).customerId
        : (populated as any).clientId
    const email = typeof party === 'object' && party?.email ? String(party.email).trim() : ''
    if (!email) throw new GraphQLValidationError('Add an email address to the customer before sending')

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

    const out = await Quotation.populate(updated, [...QUOTATION_PARTY_POPULATE])
    return { quotation: out, emailSent }
  }

  /**
   * Convert an accepted/approved quotation into a Sales Order — matching Odoo 19's
   * "Confirm" button on the quotation form.
   *
   * Allowed source statuses: draft, approved, sent, accepted
   * (mirrors Odoo which lets you confirm from any pre-sale state).
   */
  async createSOFromQuotation(id: string, userId: string): Promise<any> {
    const doc = await this.repository.findById(id)
    if (!doc || doc.deletedAt) throw new GraphQLValidationError('Quotation not found')

    const st = String(doc.status ?? '')
    const ALLOWED = ['draft', 'approved', 'sent', 'accepted']
    if (!ALLOWED.includes(st)) {
      throw new GraphQLValidationError(
        `Cannot convert a quotation with status "${st}" to a sales order. ` +
        'The quotation must be in draft, approved, sent, or accepted state.',
      )
    }

    // Map quotation line items → SO items format
    const lineItems: any[] = (doc as any).lineItems ?? []
    const soItems = lineItems.map((li: any) => ({
      itemId: li.itemId ?? undefined,
      itemDescription: String(li.description ?? li.itemDescription ?? 'Item'),
      quantity: Number(li.quantity ?? 1),
      unitPrice: Number(li.unitPrice ?? 0),
      lineTotal: Number(li.total ?? li.lineTotal ?? (Number(li.quantity ?? 1) * Number(li.unitPrice ?? 0))),
    }))

    const so = await salesOrderService.create({
      organizationId: String((doc as any).organizationId ?? ''),
      customerId: (doc as any).customerId ?? (doc as any).clientId,
      quotationId: String((doc as any)._id ?? id),
      orderDate: new Date(),
      subtotal: Number((doc as any).subtotal ?? 0),
      taxAmount: Number((doc as any).taxAmount ?? 0),
      totalAmount: Number((doc as any).totalAmount ?? 0),
      items: soItems,
      status: 'draft',
      createdBy: userId,
    })

    // Mark quotation as accepted now that it produced an SO
    await this.repository.update(id, {
      status: 'accepted',
      updatedBy: userId,
      updatedAt: new Date(),
    })

    return so
  }
}
