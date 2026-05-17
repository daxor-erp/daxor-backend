import { escapeHtml, metaRow, partyBlock, pdfDate, pdfMoney, pdfShell } from './shared'

export function renderVendorBillHtml({ doc, organization, vendor, purchaseOrder }: { doc: any; organization?: any; vendor?: any; purchaseOrder?: any }): string {
	const lines: any[] = Array.isArray(doc.lineItems) ? doc.lineItems : Array.isArray(doc.items) ? doc.items : []
	const subtotal = Number(doc.subtotal ?? lines.reduce((s, l) => s + Number(l.total ?? l.lineTotal ?? Number(l.quantity ?? 0) * Number(l.unitPrice ?? 0)), 0))
	const tax = Number(doc.taxAmount ?? 0)
	const total = Number(doc.totalAmount ?? subtotal + tax)
	const outstanding = Number(doc.outstandingAmount ?? 0)

	const body = `
		<div class="pdf-meta">
			${metaRow('Bill date', pdfDate(doc.billDate))}
			${metaRow('Due date', pdfDate(doc.dueDate))}
			${metaRow('Status', String(doc.status || '—'))}
			${purchaseOrder ? metaRow('Linked PO', String(purchaseOrder.seqNo || purchaseOrder.id || '—')) : ''}
		</div>

		<div class="pdf-parties">
			${partyBlock('Received by', organization?.name || 'Daxor', [
				organization?.address,
				organization?.email,
				organization?.phone,
			])}
			${partyBlock('From vendor', vendor?.name || 'Vendor', [
				vendor?.contactPerson,
				vendor?.email,
				vendor?.phone,
				vendor?.address,
				vendor?.taxNumber ? `GSTIN: ${vendor.taxNumber}` : '',
			])}
		</div>

		<table>
			<thead>
				<tr>
					<th style="width:36px">#</th>
					<th>Description</th>
					<th class="num" style="width:60px">Qty</th>
					<th class="num" style="width:90px">Unit price</th>
					<th class="num" style="width:110px">Total</th>
				</tr>
			</thead>
			<tbody>
				${lines.map((l, i) => {
					const qty = Number(l.quantity ?? 0)
					const price = Number(l.unitPrice ?? 0)
					const lt = Number(l.total ?? l.lineTotal ?? qty * price)
					return `<tr>
						<td>${i + 1}</td>
						<td>${escapeHtml(l.description || l.itemName || '')}</td>
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
				${outstanding ? `<tr><td>Outstanding</td><td class="num">${pdfMoney(outstanding)}</td></tr>` : ''}
			</table>
		</div>

		${doc.notes ? `<div class="pdf-notes"><strong>Notes:</strong><br/>${escapeHtml(doc.notes).replace(/\n/g, '<br/>')}</div>` : ''}
	`

	return pdfShell({
		title: 'Vendor Bill',
		subtitle: vendor?.name || '',
		orgName: organization?.name,
		docNumber: doc.billNumber || doc.seqNo,
		body,
		accent: '#d97706',
	})
}
