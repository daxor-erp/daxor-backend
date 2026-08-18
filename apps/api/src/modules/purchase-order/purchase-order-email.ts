import { isSmtpConfigured, sendHtmlEmail } from '~/lib/mail'
import { PDFService } from '../pdf/service'
import { renderPurchaseOrderHtml } from '../pdf/templates/purchase-order'

const pdfService = new PDFService()

function escapeHtml(s: string): string {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

/**
 * Sends the confirmed Purchase Order to the vendor by email with the PDF attached.
 * Throws if SMTP credentials are missing, the vendor has no email, or PDF generation fails.
 */
export async function sendPurchaseOrderEmailToVendor(
	doc: Record<string, unknown>,
	organization: Record<string, unknown> | null,
	vendor: Record<string, unknown> | null,
): Promise<void> {
	if (!isSmtpConfigured()) {
		throw new Error(
			'SMTP is not configured. Set EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT, and EMAIL_FROM on the API server.',
		)
	}
	const to = String(vendor?.email ?? '').trim()
	if (!to) throw new Error('Vendor has no email address')

	const seqNo = String(doc.seqNo ?? '')
	const vendorName = String(vendor?.name ?? 'Vendor')
	const orgName = String(organization?.name ?? 'Daxor')
	const subject = `Purchase Order ${seqNo} from ${orgName}`

	const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:640px">
<p>Hello ${escapeHtml(vendorName)},</p>
<p>Please find attached Purchase Order <strong>${escapeHtml(seqNo)}</strong> from ${escapeHtml(orgName)}.</p>
<p>Total amount: <strong>${Number(doc.totalAmount ?? 0).toFixed(2)}</strong></p>
<p style="color:#6b7280;font-size:12px">This message was sent from your ERP system.</p>
</body></html>`
	const text = `Purchase Order ${seqNo} from ${orgName}. Total amount: ${Number(doc.totalAmount ?? 0).toFixed(2)}.`

	const pdfHtml = renderPurchaseOrderHtml({ doc, organization: organization ?? undefined, vendor: vendor ?? undefined })
	const pdfBuffer = await pdfService.generatePDF(pdfHtml)

	await sendHtmlEmail({ to, subject, html, text, attachments: [{ filename: `${seqNo || 'purchase-order'}.pdf`, content: pdfBuffer }] })
}
