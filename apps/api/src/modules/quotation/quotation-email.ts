import { isSmtpConfigured, sendHtmlEmail } from '~/lib/mail'

function escapeHtml(s: string): string {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

export function buildQuotationEmailContent(quotation: {
	quotationNumber: string
	subject: string
	clientId?: { name?: string; email?: string }
	lineItems?: Array<{ description?: string; quantity?: number; unitPrice?: number; discount?: number; tax?: number; total?: number }>
	subtotal?: number
	discountAmount?: number
	taxAmount?: number
	totalAmount?: number
	terms?: string
	notes?: string
	quotationDate?: Date | string
	validUntil?: Date | string
}): { subject: string; html: string; text: string } {
	const num = quotation.quotationNumber
	const subject = `Quotation ${num}: ${quotation.subject || 'Your quotation'}`
	const name = quotation.clientId?.name || 'there'
	const rows =
		quotation.lineItems?.map((li) => {
			const desc = escapeHtml(li.description || '')
			const qty = Number(li.quantity ?? 0)
			const up = Number(li.unitPrice ?? 0)
			const tot = Number(li.total ?? 0)
			return `<tr><td style="padding:8px;border:1px solid #ddd">${desc}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${qty}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">$${up.toFixed(2)}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">$${tot.toFixed(2)}</td></tr>`
		}).join('') || ''

	const qd = quotation.quotationDate ? new Date(quotation.quotationDate as string).toLocaleDateString() : ''
	const vu = quotation.validUntil ? new Date(quotation.validUntil as string).toLocaleDateString() : ''

	const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:640px">
<p>Hello ${escapeHtml(name)},</p>
<p>Please review the quotation below.</p>
<p style="margin:12px 0;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
<strong style="font-size:16px">${escapeHtml(quotation.subject || '')}</strong><br/>
<span style="color:#64748b;font-size:13px">Quotation ${escapeHtml(num)}${qd ? ` · Date ${escapeHtml(qd)}` : ''}${vu ? ` · Valid until ${escapeHtml(vu)}` : ''}</span>
</p>
<table style="border-collapse:collapse;width:100%;margin:16px 0"><thead><tr style="background:#f3f4f6">
<th style="padding:8px;border:1px solid #ddd;text-align:left">Description</th>
<th style="padding:8px;border:1px solid #ddd;text-align:right">Qty</th>
<th style="padding:8px;border:1px solid #ddd;text-align:right">Unit</th>
<th style="padding:8px;border:1px solid #ddd;text-align:right">Line total</th>
</tr></thead><tbody>${rows}</tbody></table>
<p><strong>Subtotal:</strong> $${Number(quotation.subtotal ?? 0).toFixed(2)}<br/>
<strong>Discount:</strong> -$${Number(quotation.discountAmount ?? 0).toFixed(2)}<br/>
<strong>Tax:</strong> $${Number(quotation.taxAmount ?? 0).toFixed(2)}<br/>
<strong>Total:</strong> $${Number(quotation.totalAmount ?? 0).toFixed(2)}</p>
${quotation.terms ? `<p><strong>Terms</strong><br/>${escapeHtml(quotation.terms).replace(/\n/g, '<br/>')}</p>` : ''}
${quotation.notes ? `<p><strong>Notes</strong><br/>${escapeHtml(quotation.notes).replace(/\n/g, '<br/>')}</p>` : ''}
<p style="color:#6b7280;font-size:12px">This message was sent from your ERP system.</p>
</body></html>`

	const textLines = [
		`Hello ${name},`,
		'',
		`Quotation ${num}${qd ? ` · ${qd}` : ''}${vu ? ` · Valid until ${vu}` : ''}`,
		quotation.subject || '',
		'',
		...(quotation.lineItems || []).map(
			(li) =>
				`${li.description || ''} | qty ${li.quantity} @ $${Number(li.unitPrice ?? 0).toFixed(2)} = $${Number(li.total ?? 0).toFixed(2)}`,
		),
		'',
		`Total: $${Number(quotation.totalAmount ?? 0).toFixed(2)}`,
	]
	const text = textLines.join('\n')

	return { subject, html, text }
}

/**
 * Sends full quotation details to the client over SMTP (Nodemailer).
 * Throws if SMTP credentials are missing or send fails.
 */
export async function sendQuotationEmailToClient(
	quotation: Parameters<typeof buildQuotationEmailContent>[0],
): Promise<void> {
	if (!isSmtpConfigured()) {
		throw new Error(
			'SMTP is not configured. Set EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST (e.g. smtp.gmail.com), EMAIL_PORT (587 or 465), and EMAIL_FROM on the API server.',
		)
	}
	const to = quotation.clientId?.email?.trim()
	if (!to) throw new Error('Client has no email address')
	const { subject, html, text } = buildQuotationEmailContent(quotation)
	await sendHtmlEmail({ to, subject, html, text })
}
