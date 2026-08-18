import { TaxRateRepository } from '../tax-rate/repository'

export interface PoLineInput {
	/** product (default) | section | note — section/note lines carry no pricing. */
	lineType?: string | null
	productId?: string | null
	variantId?: string | null
	productName?: string | null
	hsnSac?: string | null
	quantity: number
	uomId?: string | null
	packagingId?: string | null
	packagingQty?: number | null
	unitPrice: number
	taxIds?: string[] | null
	discountPercent?: number | null
	note?: string | null
	itemId?: string | null
	itemDescription?: string | null
}

export interface PoLineComputed extends PoLineInput {
	lineUntaxed: number
	lineTax: number
	lineTotal: number
	qtyReceived: number
	qtyBilled: number
}

export interface PoTotals {
	untaxedAmount: number
	taxAmount: number
	taxBreakdown: { cgst: number; sgst: number; igst: number }
	totalAmount: number
}

const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100

/**
 * Computes per-line untaxed/tax/total amounts and aggregates a header tax breakdown.
 * Split heuristic: if `fiscalPosition` mentions "within"/contains the org's home state context
 * we treat it as intra-state (CGST+SGST split evenly); otherwise treated as inter-state (IGST).
 * This is a pragmatic heuristic (no full GST place-of-supply engine) — see fiscalPosition on PO header.
 */
export class PoLineCalculator {
	private taxRateRepository = new TaxRateRepository()

	async computeLines(lines: PoLineInput[]): Promise<{ lines: PoLineComputed[]; totals: Omit<PoTotals, 'taxBreakdown'> }> {
		const allTaxIds = Array.from(new Set(lines.flatMap((l) => l.taxIds ?? []).filter(Boolean))) as string[]
		const taxRates = allTaxIds.length
			? await Promise.all(allTaxIds.map((id) => this.taxRateRepository.findById(id)))
			: []
		const rateById = new Map(taxRates.filter(Boolean).map((t: any) => [String(t._id), Number(t.ratePercent) || 0]))

		let untaxedAmount = 0
		let taxAmount = 0

		const computed: PoLineComputed[] = lines.map((line) => {
			const lineType = line.lineType ?? 'product'
			// Section/note pseudo-lines carry no pricing — they exist purely for grouping/annotation.
			if (lineType !== 'product') {
				return {
					...line,
					lineType,
					quantity: 0,
					unitPrice: 0,
					discountPercent: 0,
					lineUntaxed: 0,
					lineTax: 0,
					lineTotal: 0,
					qtyReceived: 0,
					qtyBilled: 0,
				}
			}

			const qty = Number(line.quantity) || 0
			const price = Number(line.unitPrice) || 0
			const discount = Math.min(100, Math.max(0, Number(line.discountPercent) || 0))
			const lineUntaxed = round2(qty * price * (1 - discount / 100))
			const rateSum = (line.taxIds ?? []).reduce((s, id) => s + (rateById.get(String(id)) ?? 0), 0)
			const lineTax = round2(lineUntaxed * (rateSum / 100))
			const lineTotal = round2(lineUntaxed + lineTax)

			untaxedAmount = round2(untaxedAmount + lineUntaxed)
			taxAmount = round2(taxAmount + lineTax)

			return {
				...line,
				lineType,
				discountPercent: discount,
				lineUntaxed,
				lineTax,
				lineTotal,
				qtyReceived: 0,
				qtyBilled: 0,
			}
		})

		return {
			lines: computed,
			totals: { untaxedAmount, taxAmount, totalAmount: round2(untaxedAmount + taxAmount) },
		}
	}

	/** Splits the aggregate tax amount into CGST/SGST (intra-state) or IGST (inter-state) based on fiscalPosition text. */
	splitTaxBreakdown(taxAmount: number, fiscalPosition?: string | null): { cgst: number; sgst: number; igst: number } {
		const fp = String(fiscalPosition ?? '').toLowerCase()
		const isIntraState = fp.includes('within') || fp.includes('intra')
		if (isIntraState) {
			const half = round2(taxAmount / 2)
			return { cgst: half, sgst: round2(taxAmount - half), igst: 0 }
		}
		return { cgst: 0, sgst: 0, igst: round2(taxAmount) }
	}
}
