import { escapeHtml, formatVendorAddress, metaRow, partyBlock, pdfDate, pdfMoney, pdfShell } from './shared'

export function renderPurchaseOrderHtml({ doc, organization, vendor }: { doc: any; organization?: any; vendor?: any }): string {
	const lines: any[] = Array.isArray(doc.items) ? doc.items : Array.isArray(doc.lineItems) ? doc.lineItems : []
	const subtotal = Number(doc.subtotal ?? lines.reduce((s, l) => s + Number(l.lineTotal ?? Number(l.quantity ?? 0) * Number(l.unitPrice ?? 0)), 0))
	const tax = Number(doc.taxAmount ?? 0)
	const total = Number(doc.totalAmount ?? subtotal + tax)

	const body = `
		<div class="pdf-meta">
			${metaRow('Order date', pdfDate(doc.orderDate))}
			${metaRow('Delivery date', pdfDate(doc.deliveryDate))}
			${metaRow('Status', String(doc.status || '—'))}
			${doc.projectId ? metaRow('Project ID', String(doc.projectId)) : ''}
			${doc.agreement ? metaRow('Agreement', String(doc.agreement)) : ''}
			${doc.sourceDocument ? metaRow('Source document', String(doc.sourceDocument)) : ''}
			${doc.incoterms ? metaRow('Incoterms', String(doc.incoterms)) : ''}
		</div>

		<div class="pdf-parties">
			${partyBlock('Buyer', organization?.name || 'Daxor', [
				organization?.address,
				organization?.email,
				organization?.phone,
				organization?.code ? `Code: ${organization.code}` : '',
			])}
			${partyBlock('Vendor', vendor?.name || 'Vendor', [
				vendor?.contactPerson,
				vendor?.email,
				vendor?.phone,
				formatVendorAddress(vendor?.address),
				(vendor?.gstin || vendor?.taxNumber) ? `GSTIN: ${vendor.gstin || vendor.taxNumber}` : '',
			])}
		</div>

		<table>
			<thead>
				<tr>
					<th style="width:36px">#</th>
					<th>Item / description</th>
					<th class="num" style="width:60px">Qty</th>
					<th class="num" style="width:90px">Unit price</th>
					<th class="num" style="width:110px">Line total</th>
				</tr>
			</thead>
			<tbody>
				${lines.map((l, i) => {
					const lineType = l.lineType ?? 'product'
					if (lineType === 'section') {
						return `<tr><td colspan="5" style="font-weight:700;background:#f3f4f6;">${escapeHtml(l.note || '')}</td></tr>`
					}
					if (lineType === 'note') {
						return `<tr><td colspan="5" style="font-style:italic;color:#6b7280;">${escapeHtml(l.note || '')}</td></tr>`
					}
					const qty = Number(l.quantity ?? 0)
					const price = Number(l.unitPrice ?? 0)
					const lt = Number(l.lineTotal ?? qty * price)
					return `<tr>
						<td>${i + 1}</td>
						<td>${escapeHtml(l.productName || l.itemDescription || l.description || l.itemName || '')}</td>
						<td class="num">${escapeHtml(qty)}</td>
						<td class="num">${pdfMoney(price)}</td>
						<td class="num">${pdfMoney(lt)}</td>
					</tr>`
				}).join('') || '<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:24px;">No line items.</td></tr>'}
			</tbody>
		</table>

		<div class="pdf-totals">
			<table>
				<tr><td>Subtotal</td><td class="num">${pdfMoney(subtotal)}</td></tr>
				${tax ? `<tr><td>Tax</td><td class="num">${pdfMoney(tax)}</td></tr>` : ''}
				<tr class="pdf-total-row"><td>Total</td><td class="num">${pdfMoney(total)}</td></tr>
			</table>
		</div>

		${doc.notes ? `<div class="pdf-notes"><strong>Notes:</strong><br/>${escapeHtml(doc.notes).replace(/\n/g, '<br/>')}</div>` : ''}
	`

	return pdfShell({
		title: doc.status === 'rfq' || doc.status === 'rfq_sent' ? 'Request for Quotation' : 'Purchase Order',
		subtitle: vendor?.name || '',
		orgName: organization?.name,
		docNumber: doc.seqNo || doc.purchaseOrderNumber,
		body,
		accent: '#7c3aed',
	})
}
