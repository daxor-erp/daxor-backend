import { escapeHtml, metaRow, partyBlock, pdfDate, pdfMoney, pdfShell, statusBadge } from './shared'

export function renderCustomerInvoiceHtml({ doc, organization, customer, salesOrder }: { doc: any; organization?: any; customer?: any; salesOrder?: any }): string {
	const lines: any[] = Array.isArray(doc.lineItems) ? doc.lineItems : Array.isArray(doc.items) ? doc.items : []
	const subtotal = Number(doc.subtotal ?? lines.reduce((s, l) => s + Number(l.lineTotal ?? Number(l.quantity ?? 0) * Number(l.unitPrice ?? 0)), 0))
	const tax = Number(doc.taxAmount ?? 0)
	const total = Number(doc.totalAmount ?? subtotal + tax)
	const outstanding = Number(doc.outstandingAmount ?? 0)

	const body = `
		<div class="pdf-meta">
			${metaRow('Invoice date', pdfDate(doc.invoiceDate))}
			${metaRow('Due date', pdfDate(doc.dueDate))}
			${metaRow('Status', String(doc.status || '—'))}
			${salesOrder ? metaRow('Sales order', String(salesOrder.seqNo || salesOrder.id || '—')) : ''}
		</div>

		<div class="pdf-parties">
			${partyBlock('Billed by', organization?.name || 'Daxor', [
				organization?.address,
				organization?.email,
				organization?.phone,
			])}
			${partyBlock('Billed to', customer?.name || 'Customer', [
				customer?.contactPerson,
				customer?.email,
				customer?.phone,
				customer?.address,
				customer?.taxNumber ? `GSTIN: ${customer.taxNumber}` : '',
			])}
		</div>

		${lines.length ? `
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
					const qty = Number(l.quantity ?? 0)
					const price = Number(l.unitPrice ?? 0)
					const lt = Number(l.lineTotal ?? qty * price)
					return `<tr>
						<td>${i + 1}</td>
						<td>${escapeHtml(l.description || l.itemName || '')}</td>
						<td class="num">${escapeHtml(qty)}</td>
						<td class="num">${pdfMoney(price)}</td>
						<td class="num">${pdfMoney(lt)}</td>
					</tr>`
				}).join('')}
			</tbody>
		</table>` : '<p style="color:#9ca3af;text-align:center;padding:16px 0;">Summary invoice — no line items.</p>'}

		<div class="pdf-totals">
			<table>
				<tr><td>Subtotal</td><td class="num">${pdfMoney(subtotal)}</td></tr>
				${tax ? `<tr><td>Tax</td><td class="num">${pdfMoney(tax)}</td></tr>` : ''}
				<tr class="pdf-total-row"><td>Total</td><td class="num">${pdfMoney(total)}</td></tr>
				${outstanding ? `<tr><td>Outstanding</td><td class="num">${pdfMoney(outstanding)}</td></tr>` : ''}
			</table>
		</div>

		${doc.notes ? `<div class="pdf-notes"><strong>Notes:</strong><br/>${escapeHtml(doc.notes).replace(/\n/g, '<br/>')}</div>` : ''}
	`

	return pdfShell({
		title: 'Tax Invoice',
		subtitle: customer?.name || '',
		orgName: organization?.name,
		docNumber: doc.invoiceNumber || doc.seqNo,
		body,
	})
}
