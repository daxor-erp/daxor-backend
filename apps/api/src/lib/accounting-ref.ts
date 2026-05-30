/** Strip document-type prefix already implied by the accounting journal prefix (AR-INV, AR-PAY, …). */
const DOC_PREFIX_STRIP: Record<string, RegExp> = {
	'AR-INV': /^INV-/i,
	'AR-PAY': /^CPAY-/i,
	'AR-CM': /^CM-/i,
	'AR-RET': /^SALES_RETURN-/i,
	'AP-BILL': /^BILL-/i,
	'AP-PAY': /^PAY-/i,
	'AP-VC': /^VC-/i,
	'AP-VDN': /^VDN-/i,
	'INV-GRN': /^GRN-/i,
	'INV-MRN': /^MRN-/i,
	'INV-SA': /^SA-/i,
	'INV-ST': /^ST-/i,
	'PR-PAY': /^PAYROLL_MANAGEMENT-/i,
	'FA-DEP': /^FA-/i,
	'BNK-TF': /^tf-/i,
	'PRD-COMP': /^PRODUCTION_PLANNING-/i,
}

export function stripDocNumberForAccountingRef(accountingPrefix: string, docNo: string): string {
	const s = String(docNo ?? '').trim()
	if (!s) return s
	const re = DOC_PREFIX_STRIP[accountingPrefix]
	return re ? s.replace(re, '') : s
}

/** Journal entry / reference number, e.g. AR-INV-541C22-0016 (not AR-INV-INV-541C22-0016). */
export function formatAccountingRef(accountingPrefix: string, docNo: string): string {
	const suffix = stripDocNumberForAccountingRef(accountingPrefix, docNo)
	return `${accountingPrefix}-${suffix}`
}

/** Older formats still in DB — used for idempotent posting checks. */
export function legacyAccountingRefCandidates(
	accountingPrefix: string,
	docNo: string,
	mongoId?: string,
): string[] {
	const safe = String(docNo ?? '').trim()
	const out = new Set<string>()
	if (safe) {
		out.add(formatAccountingRef(accountingPrefix, safe))
		out.add(`${accountingPrefix}-${safe}`)
	}
	if (mongoId) out.add(`${accountingPrefix}-${mongoId}`)
	return [...out]
}
