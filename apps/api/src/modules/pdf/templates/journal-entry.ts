import { escapeHtml, metaRow, pdfDate, pdfMoney, pdfShell } from './shared'

export function renderJournalEntryHtml({ doc, organization }: { doc: any; organization?: any }): string {
	const lines: any[] = Array.isArray(doc.lines) ? doc.lines : []
	const totalDebit = Number(doc.totalDebit ?? lines.reduce((s, l) => s + Number(l.debit ?? 0), 0))
	const totalCredit = Number(doc.totalCredit ?? lines.reduce((s, l) => s + Number(l.credit ?? 0), 0))
	const balanced = Math.abs(totalDebit - totalCredit) < 0.01

	const body = `
		<div class="pdf-meta">
			${metaRow('Entry date', pdfDate(doc.entryDate))}
			${metaRow('Reference', String(doc.referenceNumber || '—'))}
			${metaRow('Status', String(doc.status || '—'))}
			${metaRow('Balanced', balanced ? 'Yes' : 'No')}
		</div>

		<div style="margin-bottom: 14px; font-size: 12px;"><strong>Description:</strong> ${escapeHtml(doc.description || '—')}</div>

		<table>
			<thead>
				<tr>
					<th style="width:36px">#</th>
					<th>Account</th>
					<th>Description</th>
					<th class="num" style="width:120px">Debit</th>
					<th class="num" style="width:120px">Credit</th>
				</tr>
			</thead>
			<tbody>
				${lines.map((l, i) => `<tr>
					<td>${i + 1}</td>
					<td><strong>${escapeHtml(l.accountCode || '')}</strong> ${escapeHtml(l.accountName || '')}</td>
					<td>${escapeHtml(l.description || '')}</td>
					<td class="num">${Number(l.debit ?? 0) ? pdfMoney(l.debit) : ''}</td>
					<td class="num">${Number(l.credit ?? 0) ? pdfMoney(l.credit) : ''}</td>
				</tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:24px;">No lines.</td></tr>'}
			</tbody>
			<tfoot>
				<tr style="border-top: 2px solid #059669; font-weight: 700;">
					<td colspan="3" style="text-align:right; padding-top: 10px;">Totals</td>
					<td class="num" style="padding-top: 10px;">${pdfMoney(totalDebit)}</td>
					<td class="num" style="padding-top: 10px;">${pdfMoney(totalCredit)}</td>
				</tr>
			</tfoot>
		</table>

		${doc.notes ? `<div class="pdf-notes"><strong>Notes:</strong><br/>${escapeHtml(doc.notes).replace(/\n/g, '<br/>')}</div>` : ''}
	`

	return pdfShell({
		title: 'Journal Entry',
		subtitle: doc.description || '',
		orgName: organization?.name,
		docNumber: doc.entryNumber || doc.seqNo,
		body,
		accent: '#6366f1',
	})
}
