import { escapeHtml, metaRow, partyBlock, pdfDate, pdfMoney, pdfShell, statusBadge } from './shared'

interface QuotationLine {
	itemId?: unknown
	itemName?: string | null
	description?: string | null
	quantity?: number | null
	unitPrice?: number | null
	discount?: number | null
	tax?: number | null
	lineTotal?: number | null
}

export function renderQuotationHtml({ doc, organization, client }: { doc: any; organization?: any; client?: any }): string {
	const lines: QuotationLine[] = Array.isArray(doc.lineItems) ? doc.lineItems : Array.isArray(doc.items) ? doc.items : []
	const subtotal = Number(doc.subtotal ?? 0)
	const discount = Number(doc.discountAmount ?? doc.totalDiscount ?? 0)
	const tax = Number(doc.taxAmount ?? doc.totalTax ?? 0)
	const total = Number(doc.totalAmount ?? subtotal - discount + tax)

	const body = `
		<div class="pdf-meta">
			${metaRow('Quotation date', pdfDate(doc.quotationDate))}
			${metaRow('Valid until', pdfDate(doc.validUntil))}
			${metaRow('Status', String(doc.status || '—'))}
			${metaRow('Subject', String(doc.subject || '—'))}
		</div>

		<div class="pdf-parties">
			${partyBlock('From', organization?.name || 'Daxor', [
				organization?.address,
				organization?.email,
				organization?.phone,
				organization?.code ? `Code: ${organization.code}` : '',
			])}
			${partyBlock('To', client?.name || 'Client', [
				client?.contactPerson,
				client?.email,
				client?.phone,
				client?.address,
			])}
		</div>

		<table>
			<thead>
				<tr>
					<th style="width:36px">#</th>
					<th>Description</th>
					<th class="num" style="width:60px">Qty</th>
					<th class="num" style="width:90px">Unit price</th>
					<th class="num" style="width:60px">Disc%</th>
					<th class="num" style="width:60px">Tax%</th>
					<th class="num" style="width:110px">Line total</th>
				</tr>
			</thead>
			<tbody>
				${lines
					.map((l, i) => {
						const qty = Number(l.quantity ?? 0)
						const price = Number(l.unitPrice ?? 0)
						const lineTotal = Number(l.lineTotal ?? qty * price)
						return `<tr>
							<td>${i + 1}</td>
							<td>${escapeHtml(l.description || l.itemName || '')}</td>
							<td class="num">${escapeHtml(qty)}</td>
							<td class="num">${pdfMoney(price)}</td>
							<td class="num">${escapeHtml((l.discount ?? 0) + '%')}</td>
							<td class="num">${escapeHtml((l.tax ?? 0) + '%')}</td>
							<td class="num">${pdfMoney(lineTotal)}</td>
						</tr>`
					})
					.join('') || '<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:24px;">No line items.</td></tr>'}
			</tbody>
		</table>

		<div class="pdf-totals">
			<table>
				<tr><td>Subtotal</td><td class="num">${pdfMoney(subtotal)}</td></tr>
				${discount ? `<tr><td>Discount</td><td class="num">-${pdfMoney(discount)}</td></tr>` : ''}
				${tax ? `<tr><td>Tax</td><td class="num">${pdfMoney(tax)}</td></tr>` : ''}
				<tr class="pdf-total-row"><td>Total</td><td class="num">${pdfMoney(total)}</td></tr>
			</table>
		</div>

		${doc.terms ? `<div class="pdf-notes"><strong>Terms &amp; Conditions:</strong><br/>${escapeHtml(doc.terms).replace(/\n/g, '<br/>')}</div>` : ''}
		${doc.notes ? `<div class="pdf-notes"><strong>Notes:</strong><br/>${escapeHtml(doc.notes).replace(/\n/g, '<br/>')}</div>` : ''}
	`

	return pdfShell({
		title: 'Quotation',
		subtitle: String(doc.subject || ''),
		orgName: organization?.name,
		docNumber: doc.quotationNumber || doc.seqNo,
		body,
	})
}
