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
import { QuotationRepository } from './repository'
import { ClientService } from '../client/service'
import nodemailer from 'nodemailer'
import { config } from '~/config'

export class QuotationService {
  private repository: QuotationRepository
  private clientService: ClientService

  constructor() {
    this.repository = new QuotationRepository()
    this.clientService = new ClientService()
  }

  async createQuotation(data: any, userId: string) {
    // Generate quotation number if not provided
    if (!data.quotationNumber) {
      const count = await this.repository.count({ organizationId: data.organizationId })
      data.quotationNumber = `QT-${String(count + 1).padStart(5, '0')}`
    }

    return this.repository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async getQuotationById(id: string) {
    const quotation = await this.repository.findById(id)
    if (quotation) {
      await this.repository.model.populate(quotation, [
        { path: 'clientId' },
        { path: 'sentBy' }
      ])
    }
    return quotation
  }

  async getQuotationsByOrganization(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getQuotationsByClient(clientId: string) {
    return this.repository.findByClient(clientId)
  }

  async getQuotationsByStatus(status: string, organizationId: string) {
    return this.repository.findByStatus(status, organizationId)
  }

  async getAllQuotations() {
    return this.repository.findAll({ deletedAt: null })
  }

  async updateQuotation(id: string, data: any, userId: string) {
    return this.repository.update(id, {
      ...data,
      updatedBy: userId,
      updatedAt: new Date(),
    })
  }

  async deleteQuotation(id: string) {
    return this.repository.softDelete(id)
  }

  async sendQuotation(id: string, userId: string) {
    const quotation = await this.getQuotationById(id)
    if (!quotation) {
      throw new Error('Quotation not found')
    }

    const client = await this.clientService.getClientById(quotation.clientId._id || quotation.clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    // Update quotation status
    await this.repository.update(id, {
      status: 'sent',
      sentAt: new Date(),
      sentBy: userId,
      updatedAt: new Date(),
    })

    // Send email
    await this.sendQuotationEmail(quotation, client)

    return this.getQuotationById(id)
  }

  private async sendQuotationEmail(quotation: any, client: any) {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    })

    const lineItemsHtml = quotation.lineItems.map((item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.discount}%</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.total.toFixed(2)}</td>
      </tr>
    `).join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
          th { background: #4F46E5; color: white; padding: 12px; text-align: left; }
          .summary { text-align: right; margin-top: 20px; }
          .total { font-size: 1.2em; font-weight: bold; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quotation ${quotation.quotationNumber}</h1>
          </div>
          <div class="content">
            <p>Dear ${client.name},</p>
            <p>Thank you for your interest. Please find below the quotation details:</p>
            
            <h3>${quotation.subject}</h3>
            <p><strong>Quotation Date:</strong> ${new Date(quotation.quotationDate).toLocaleDateString()}</p>
            <p><strong>Valid Until:</strong> ${new Date(quotation.validUntil).toLocaleDateString()}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Discount</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${lineItemsHtml}
              </tbody>
            </table>
            
            <div class="summary">
              <p><strong>Subtotal:</strong> $${quotation.subtotal.toFixed(2)}</p>
              <p><strong>Discount:</strong> -$${quotation.discountAmount.toFixed(2)}</p>
              <p><strong>Tax:</strong> $${quotation.taxAmount.toFixed(2)}</p>
              <p class="total"><strong>Total Amount:</strong> $${quotation.totalAmount.toFixed(2)}</p>
            </div>
            
            ${quotation.terms ? `<p><strong>Terms & Conditions:</strong><br>${quotation.terms}</p>` : ''}
            ${quotation.notes ? `<p><strong>Notes:</strong><br>${quotation.notes}</p>` : ''}
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>DAXOR Team</p>
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: config.email.from,
      to: client.email,
      subject: `Quotation ${quotation.quotationNumber} - ${quotation.subject}`,
      html: emailHtml,
    })
  }
}
