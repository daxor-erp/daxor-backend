import { escapeHtml, metaRow, partyBlock, pdfDate, pdfMoney, pdfShell } from './shared'

export function renderSalesOrderHtml({ doc, organization, customer, quotation }: { doc: any; organization?: any; customer?: any; quotation?: any }): string {
	const lines: any[] = Array.isArray(doc.lineItems) ? doc.lineItems : Array.isArray(doc.items) ? doc.items : []
	const subtotal = Number(doc.subtotal ?? lines.reduce((s, l) => s + Number(l.lineTotal ?? Number(l.quantity ?? 0) * Number(l.unitPrice ?? 0)), 0))
	const tax = Number(doc.taxAmount ?? 0)
	const total = Number(doc.totalAmount ?? subtotal + tax)

	const body = `
		<div class="pdf-meta">
			${metaRow('Order date', pdfDate(doc.orderDate))}
			${metaRow('Status', String(doc.status || '—'))}
			${quotation ? metaRow('From quotation', String(quotation.quotationNumber || quotation.seqNo || '—')) : ''}
			${doc.cashSale ? metaRow('Type', 'Cash sale') : ''}
		</div>

		<div class="pdf-parties">
			${partyBlock('Seller', organization?.name || 'Daxor', [
				organization?.address,
				organization?.email,
				organization?.phone,
			])}
			${partyBlock('Customer', customer?.name || 'Customer', [
				customer?.contactPerson,
				customer?.email,
				customer?.phone,
				customer?.address,
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
		</table>` : ''}

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
		title: 'Sales Order',
		subtitle: customer?.name || '',
		orgName: organization?.name,
		docNumber: doc.seqNo,
		body,
		accent: '#0ea5e9',
	})
}
