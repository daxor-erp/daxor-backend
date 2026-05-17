/**
 * Fetches a document by type + id, joins related entities, and renders the HTML
 * template. The HTML is then handed to PDFService.generatePDF for Puppeteer.
 *
 * Authorization: caller must already be authenticated. We enforce same-org access
 * (or platform admin) inside fetchDocument.
 */

import {
	renderQuotationHtml,
	renderCustomerInvoiceHtml,
	renderSalesOrderHtml,
	renderPurchaseOrderHtml,
	renderVendorBillHtml,
	renderVendorPaymentHtml,
	renderCustomerPaymentHtml,
	renderJournalEntryHtml,
	type PdfDocumentType,
} from './templates'

import { Quotation } from '../quotation/model'
import { CustomerInvoice } from '../customer-invoice/model'
import { SalesOrder } from '../sales-order/model'
import { PurchaseOrder } from '../purchase-order/model'
import { VendorBill } from '../vendor-bill/model'
import { VendorPayment } from '../vendor-payment/model'
import { CustomerPayment } from '../customer-payment/model'
import { JournalEntry } from '../journal-entry/model'
import { Organization } from '../organization/model'
import { Customer } from '../customer/model'
import { Vendor } from '../vendor/model'
import { Client } from '../client/model'

export interface RenderContext {
	userOrganizationId: string | null
	isPlatformAdmin: boolean
}

async function pickOrg(orgId: unknown): Promise<any> {
	if (!orgId) return null
	try { return await Organization.findById(String(orgId)).lean() } catch { return null }
}

function assertOrgAccess(docOrgId: unknown, ctx: RenderContext): void {
	if (ctx.isPlatformAdmin) return
	if (!docOrgId) throw new Error('Document has no organization')
	if (String(docOrgId) !== String(ctx.userOrganizationId)) {
		throw new Error('Forbidden: document is in a different organization')
	}
}

export async function renderDocumentToHtml(type: PdfDocumentType, id: string, ctx: RenderContext): Promise<{ html: string; filename: string }> {
	switch (type) {
		case 'quotation': {
			const doc: any = await Quotation.findById(id).lean()
			if (!doc) throw new Error('Quotation not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, client] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.clientId ? Client.findById(String(doc.clientId)).lean().catch(() => null) : null,
			])
			return { html: renderQuotationHtml({ doc, organization, client }), filename: `quotation-${doc.quotationNumber || doc.seqNo || id}` }
		}
		case 'customer-invoice': {
			const doc: any = await CustomerInvoice.findById(id).lean()
			if (!doc) throw new Error('Customer invoice not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, customer, salesOrder] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.customerId ? Customer.findById(String(doc.customerId)).lean().catch(() => null) : null,
				doc.salesOrderId ? SalesOrder.findById(String(doc.salesOrderId)).lean().catch(() => null) : null,
			])
			return { html: renderCustomerInvoiceHtml({ doc, organization, customer, salesOrder }), filename: `invoice-${doc.invoiceNumber || doc.seqNo || id}` }
		}
		case 'sales-order': {
			const doc: any = await SalesOrder.findById(id).lean()
			if (!doc) throw new Error('Sales order not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, customer, quotation] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.customerId ? Customer.findById(String(doc.customerId)).lean().catch(() => null) : null,
				doc.quotationId ? Quotation.findById(String(doc.quotationId)).lean().catch(() => null) : null,
			])
			return { html: renderSalesOrderHtml({ doc, organization, customer, quotation }), filename: `sales-order-${doc.seqNo || id}` }
		}
		case 'purchase-order': {
			const doc: any = await PurchaseOrder.findById(id).lean()
			if (!doc) throw new Error('Purchase order not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, vendor] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.vendorId ? Vendor.findById(String(doc.vendorId)).lean().catch(() => null) : null,
			])
			return { html: renderPurchaseOrderHtml({ doc, organization, vendor }), filename: `purchase-order-${doc.seqNo || id}` }
		}
		case 'vendor-bill': {
			const doc: any = await VendorBill.findById(id).lean()
			if (!doc) throw new Error('Vendor bill not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, vendor, purchaseOrder] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.vendorId ? Vendor.findById(String(doc.vendorId)).lean().catch(() => null) : null,
				doc.purchaseOrderId ? PurchaseOrder.findById(String(doc.purchaseOrderId)).lean().catch(() => null) : null,
			])
			return { html: renderVendorBillHtml({ doc, organization, vendor, purchaseOrder }), filename: `vendor-bill-${doc.billNumber || doc.seqNo || id}` }
		}
		case 'vendor-payment': {
			const doc: any = await VendorPayment.findById(id).lean()
			if (!doc) throw new Error('Vendor payment not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, vendor] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.vendorId ? Vendor.findById(String(doc.vendorId)).lean().catch(() => null) : null,
			])
			return { html: renderVendorPaymentHtml({ doc, organization, vendor }), filename: `vendor-payment-${doc.paymentNumber || doc.seqNo || id}` }
		}
		case 'customer-payment': {
			const doc: any = await CustomerPayment.findById(id).lean()
			if (!doc) throw new Error('Customer payment not found')
			assertOrgAccess(doc.organizationId, ctx)
			const [organization, customer] = await Promise.all([
				pickOrg(doc.organizationId),
				doc.customerId ? Customer.findById(String(doc.customerId)).lean().catch(() => null) : null,
			])
			return { html: renderCustomerPaymentHtml({ doc, organization, customer }), filename: `customer-payment-${doc.paymentNumber || doc.seqNo || id}` }
		}
		case 'journal-entry': {
			const doc: any = await JournalEntry.findById(id).lean()
			if (!doc) throw new Error('Journal entry not found')
			assertOrgAccess(doc.organizationId, ctx)
			const organization = await pickOrg(doc.organizationId)
			return { html: renderJournalEntryHtml({ doc, organization }), filename: `journal-entry-${doc.entryNumber || doc.seqNo || id}` }
		}
		default:
			throw new Error(`Unsupported document type: ${type}`)
	}
}
