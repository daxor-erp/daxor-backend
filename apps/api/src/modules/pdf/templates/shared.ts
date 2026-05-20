/**
 * Shared PDF rendering helpers. Each document template imports these to keep a
 * consistent print shell, currency formatting, and date formatting.
 *
 * The active currency is module-scoped — `renderDocumentToHtml` sets it before
 * invoking a template so all `pdfMoney()` calls in that render use the right
 * symbol & locale. Defaults to INR when nothing is set.
 */

import { formatMoney, getCurrencyMeta, type CurrencyCode } from '../../../lib/format-money'

let activeCurrency: CurrencyCode = 'INR'

export function setActiveCurrency(code?: string | null): void {
	const valid: CurrencyCode[] = ['INR', 'USD', 'SGD', 'MYR']
	activeCurrency = (valid.includes(code as CurrencyCode) ? (code as CurrencyCode) : 'INR')
}

export function getActiveCurrency(): CurrencyCode {
	return activeCurrency
}

export function escapeHtml(s: unknown): string {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

export function pdfMoney(n: unknown): string {
	const num = Number.isFinite(Number(n)) ? Number(n) : 0
	return formatMoney(num, activeCurrency)
}

export function pdfCurrencySymbol(): string {
	return getCurrencyMeta(activeCurrency).symbol
}

export function pdfDate(value: unknown, fallback = '—'): string {
	if (value == null || value === '') return fallback
	const raw =
		typeof value === 'number'
			? new Date(value)
			: typeof value === 'string' && /^-?\d+$/.test(value.trim())
				? new Date(Number(value))
				: new Date(value as string)
	if (Number.isNaN(raw.getTime())) return fallback
	return raw.toLocaleDateString(getCurrencyMeta(activeCurrency).locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export interface PdfShellOptions {
	title: string
	subtitle?: string
	orgName?: string
	body: string
	accent?: string
	docNumber?: string
}

/**
 * Wrap inner HTML in a branded A4 print shell. Body is inserted verbatim — callers
 * are responsible for escaping user content via `escapeHtml`.
 */
export function pdfShell({ title, subtitle, orgName, body, accent = '#059669', docNumber }: PdfShellOptions): string {
	const today = pdfDate(new Date())
	const safeTitle = escapeHtml(title)
	const safeSubtitle = subtitle ? escapeHtml(subtitle) : ''
	const safeOrg = escapeHtml(orgName || 'Daxor')
	const safeDoc = docNumber ? escapeHtml(docNumber) : ''
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${safeTitle}${safeDoc ? ' — ' + safeDoc : ''}</title>
<style>
  @page { size: A4; margin: 18mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; color: #1f2937; font-size: 12px; line-height: 1.45; }
  .pdf-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; border-bottom: 2px solid ${accent}; padding-bottom: 14px; margin-bottom: 20px; }
  .pdf-brand { display: flex; align-items: center; gap: 10px; }
  .pdf-logo { width: 36px; height: 36px; border-radius: 9px; background: ${accent}; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
  .pdf-brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: #111827; }
  .pdf-brand-sub { font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #6b7280; margin-top: 2px; }
  .pdf-title { text-align: right; }
  .pdf-title h1 { margin: 0; font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.01em; }
  .pdf-title .pdf-subtitle { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .pdf-title .pdf-docnum { display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 999px; background: ${accent}; color: white; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; }
  .pdf-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 18px; font-size: 11px; color: #4b5563; }
  .pdf-meta .pdf-meta-label { color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; font-size: 9.5px; }
  .pdf-meta .pdf-meta-value { color: #111827; font-weight: 600; }
  .pdf-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .pdf-party { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; background: #fafafa; }
  .pdf-party h3 { margin: 0 0 4px 0; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; }
  .pdf-party p { margin: 0; }
  .pdf-party .pdf-party-name { font-size: 13px; font-weight: 700; color: #111827; }
  .pdf-party .pdf-party-info { font-size: 11px; color: #4b5563; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  th, td { padding: 8px 10px; text-align: left; }
  thead th { background: #f3f4f6; color: #374151; text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em; border-bottom: 1px solid #e5e7eb; font-weight: 600; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  tbody tr:nth-child(even) { background: #fafafa; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .pdf-totals { display: flex; justify-content: flex-end; margin-top: 14px; }
  .pdf-totals table { width: auto; min-width: 280px; }
  .pdf-totals td { padding: 4px 8px; border-bottom: none; }
  .pdf-totals tr.pdf-total-row td { border-top: 2px solid ${accent}; font-weight: 700; color: #111827; padding-top: 8px; }
  .pdf-notes { margin-top: 22px; padding: 12px 14px; border-left: 3px solid ${accent}; background: #f9fafb; border-radius: 4px; font-size: 11px; color: #4b5563; }
  .pdf-notes strong { color: #111827; }
  .pdf-footer { margin-top: 30px; padding-top: 12px; border-top: 1px dashed #e5e7eb; font-size: 10px; color: #6b7280; display: flex; justify-content: space-between; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .badge-success { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  .badge-warning { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
  .badge-danger { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
  .badge-info { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .badge-muted { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
</style>
</head>
<body>
<div class="pdf-header">
  <div class="pdf-brand">
    <div class="pdf-logo">${safeOrg.slice(0, 1).toUpperCase()}</div>
    <div>
      <div class="pdf-brand-name">${safeOrg}</div>
      <div class="pdf-brand-sub">Daxor ERP · Generated ${escapeHtml(today)}</div>
    </div>
  </div>
  <div class="pdf-title">
    <h1>${safeTitle}</h1>
    ${safeSubtitle ? `<div class="pdf-subtitle">${safeSubtitle}</div>` : ''}
    ${safeDoc ? `<div class="pdf-docnum">${safeDoc}</div>` : ''}
  </div>
</div>
${body}
<div class="pdf-footer">
  <span>Generated by Daxor ERP</span>
  <span>${escapeHtml(today)}</span>
</div>
</body>
</html>`
}

export function statusBadge(status: unknown): string {
	const s = String(status || '').toLowerCase()
	let cls = 'badge-muted'
	if (['approved', 'paid', 'accepted', 'completed', 'confirmed', 'sent', 'active'].includes(s)) cls = 'badge-success'
	else if (['draft', 'pending', 'submitted', 'pending_approval'].includes(s)) cls = 'badge-warning'
	else if (['rejected', 'cancelled', 'overdue', 'expired'].includes(s)) cls = 'badge-danger'
	else if (['partial'].includes(s)) cls = 'badge-info'
	return `<span class="badge ${cls}">${escapeHtml(s.replace(/_/g, ' '))}</span>`
}

export function partyBlock(title: string, name: string, info: string[]): string {
	return `<div class="pdf-party">
		<h3>${escapeHtml(title)}</h3>
		<p class="pdf-party-name">${escapeHtml(name)}</p>
		${info.filter(Boolean).map((l) => `<p class="pdf-party-info">${escapeHtml(l)}</p>`).join('')}
	</div>`
}

export function metaRow(label: string, value: string): string {
	return `<div><div class="pdf-meta-label">${escapeHtml(label)}</div><div class="pdf-meta-value">${escapeHtml(value)}</div></div>`
}
