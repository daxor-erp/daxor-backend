import { escapeHtml, pdfMoney } from './shared'

/**
 * Simple label-sheet renderer for the Product "Print Labels" action. Not a full print
 * shell (pdfShell) since labels are small grid cells rather than a letterhead document —
 * this keeps its own minimal @page/style block sized for a standard label sheet.
 */
export function renderProductLabelHtml({ doc, organization }: { doc: any; organization?: any }): string {
	const name = escapeHtml(doc.name || 'Product')
	const ref = escapeHtml(doc.internalReference || doc.seqNo || '')
	const barcode = escapeHtml(doc.barcode || '')
	const price = doc.salesPrice != null ? pdfMoney(doc.salesPrice) : ''
	const orgName = escapeHtml(organization?.name || 'Daxor')

	// Render a small grid of repeated labels (12 per sheet) so a single Print Labels click
	// yields a usable sheet rather than a single tiny label.
	const label = `
		<div class="label">
			<div class="label-org">${orgName}</div>
			<div class="label-name">${name}</div>
			${ref ? `<div class="label-ref">${ref}</div>` : ''}
			${barcode ? `<div class="label-barcode">*${barcode}*</div>` : ''}
			${price ? `<div class="label-price">${price}</div>` : ''}
		</div>`
	const labels = Array.from({ length: 12 }, () => label).join('')

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Labels — ${name}</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; color: #111827; }
  .sheet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
  .label { border: 1px dashed #cbd5e1; border-radius: 4px; padding: 8px 10px; height: 32mm; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
  .label-org { font-size: 8px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; }
  .label-name { font-size: 12px; font-weight: 700; color: #111827; line-height: 1.2; }
  .label-ref { font-size: 10px; font-family: monospace; color: #374151; }
  .label-barcode { font-family: 'Libre Barcode 39', monospace; font-size: 20px; letter-spacing: 2px; color: #111827; }
  .label-price { font-size: 12px; font-weight: 700; color: #059669; margin-top: 2px; }
</style>
</head>
<body>
<div class="sheet">${labels}</div>
</body>
</html>`
}
