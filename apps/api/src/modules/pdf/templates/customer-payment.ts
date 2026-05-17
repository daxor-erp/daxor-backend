import { escapeHtml, metaRow, partyBlock, pdfDate, pdfMoney, pdfShell } from './shared'

export function renderCustomerPaymentHtml({ doc, organization, customer }: { doc: any; organization?: any; customer?: any }): string {
	const allocs: any[] = Array.isArray(doc.allocations) ? doc.allocations : []
	const total = Number(doc.totalAmount ?? allocs.reduce((s, a) => s + Number(a.amount ?? 0), 0))

	const body = `
		<div class="pdf-meta">
			${metaRow('Payment date', pdfDate(doc.paymentDate))}
			${metaRow('Method', String(doc.paymentMethod || '—'))}
			${metaRow('Reference', String(doc.referenceNumber || '—'))}
			${metaRow('Status', String(doc.status || '—'))}
		</div>

		<div class="pdf-parties">
			${partyBlock('Received by', organization?.name || 'Daxor', [organization?.address, organization?.email, organization?.phone])}
			${partyBlock('From customer', customer?.name || 'Customer', [customer?.email, customer?.phone, customer?.address])}
		</div>

		<table>
			<thead>
				<tr><th>Applied to invoice</th><th class="num" style="width:140px">Amount</th></tr>
			</thead>
			<tbody>
				${allocs.map((a) => `<tr><td>${escapeHtml(a.invoiceNumber || a.invoiceId || '—')}</td><td class="num">${pdfMoney(a.amount)}</td></tr>`).join('') || '<tr><td colspan="2" style="text-align:center;color:#9ca3af;padding:24px;">No allocations.</td></tr>'}
			</tbody>
		</table>

		<div class="pdf-totals">
			<table>
				<tr class="pdf-total-row"><td>Total received</td><td class="num">${pdfMoney(total)}</td></tr>
			</table>
		</div>

		${doc.notes ? `<div class="pdf-notes"><strong>Notes:</strong><br/>${escapeHtml(doc.notes).replace(/\n/g, '<br/>')}</div>` : ''}
	`

	return pdfShell({
		title: 'Customer Payment Receipt',
		subtitle: customer?.name || '',
		orgName: organization?.name,
		docNumber: doc.paymentNumber || doc.seqNo,
		body,
		accent: '#10b981',
	})
}
