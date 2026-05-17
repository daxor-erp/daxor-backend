export { renderQuotationHtml } from './quotation'
export { renderCustomerInvoiceHtml } from './customer-invoice'
export { renderSalesOrderHtml } from './sales-order'
export { renderPurchaseOrderHtml } from './purchase-order'
export { renderVendorBillHtml } from './vendor-bill'
export { renderVendorPaymentHtml } from './vendor-payment'
export { renderCustomerPaymentHtml } from './customer-payment'
export { renderJournalEntryHtml } from './journal-entry'
export { pdfShell, escapeHtml, pdfMoney, pdfDate } from './shared'

/** All document types supported by /api/pdf/document. */
export const PDF_DOCUMENT_TYPES = [
	'quotation',
	'sales-order',
	'customer-invoice',
	'customer-payment',
	'purchase-order',
	'vendor-bill',
	'vendor-payment',
	'journal-entry',
] as const

export type PdfDocumentType = (typeof PDF_DOCUMENT_TYPES)[number]

export function isPdfDocumentType(t: unknown): t is PdfDocumentType {
	return typeof t === 'string' && (PDF_DOCUMENT_TYPES as readonly string[]).includes(t)
}
