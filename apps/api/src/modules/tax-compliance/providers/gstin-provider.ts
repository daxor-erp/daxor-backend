/**
 * Pluggable GSTIN verification provider interface.
 *
 * Real integration (GSTN / a KYC aggregator like Karza, Signzy, Cashfree Verification) requires
 * paid API credentials that are not available in this environment. This module defines the
 * provider contract plus a deterministic mock so the "Check Status" UX and backend flow are
 * fully wired now; swapping in a live provider later is a one-file change (see `resolveGstinProvider`).
 */

export type GstinStatus = 'ACTIVE' | 'CANCELLED' | 'SUSPENDED' | 'INVALID'

export interface GstinCheckResult {
	gstin: string
	valid: boolean
	status: GstinStatus
	legalName?: string
	tradeName?: string
	gstTreatment?: string
	stateCode?: string
	registrationDate?: string
	message: string
	source: 'MOCK' | 'LIVE'
}

export interface GstinProvider {
	checkStatus(gstin: string): Promise<GstinCheckResult>
}

/** 2-char state code + 10-char PAN + 1 entity code + 1 checksum char ('Z' fixed) + 1 checksum digit. */
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/

const GST_STATE_CODES: Record<string, string> = {
	'01': 'Jammu and Kashmir',
	'02': 'Himachal Pradesh',
	'03': 'Punjab',
	'04': 'Chandigarh',
	'05': 'Uttarakhand',
	'06': 'Haryana',
	'07': 'Delhi',
	'08': 'Rajasthan',
	'09': 'Uttar Pradesh',
	'10': 'Bihar',
	'11': 'Sikkim',
	'19': 'West Bengal',
	'21': 'Odisha',
	'23': 'Madhya Pradesh',
	'24': 'Gujarat',
	'27': 'Maharashtra',
	'29': 'Karnataka',
	'32': 'Kerala',
	'33': 'Tamil Nadu',
	'36': 'Telangana',
	'37': 'Andhra Pradesh',
}

export function isValidGstinFormat(gstin: string): boolean {
	return GSTIN_PATTERN.test(String(gstin ?? '').trim().toUpperCase())
}

/**
 * Deterministic mock: format-valid GSTINs resolve as ACTIVE (using the embedded PAN as a stand-in
 * legal name derivation) so demos/tests are stable without a live upstream dependency.
 */
class MockGstinProvider implements GstinProvider {
	async checkStatus(gstinRaw: string): Promise<GstinCheckResult> {
		const gstin = String(gstinRaw ?? '').trim().toUpperCase()
		if (!isValidGstinFormat(gstin)) {
			return {
				gstin,
				valid: false,
				status: 'INVALID',
				message: 'GSTIN format is invalid. Expected 15 characters: 2-digit state code + 10-char PAN + entity + Z + checksum.',
				source: 'MOCK',
			}
		}
		const stateCode = gstin.slice(0, 2)
		const pan = gstin.slice(2, 12)
		const stateName = GST_STATE_CODES[stateCode]
		return {
			gstin,
			valid: true,
			status: 'ACTIVE',
			legalName: `Registered Entity (${pan})`,
			tradeName: `Registered Entity (${pan})`,
			gstTreatment: 'Registered Business - Regular',
			stateCode,
			registrationDate: undefined,
			message: stateName
				? `GSTIN is active and registered in ${stateName}.`
				: 'GSTIN is active.',
			source: 'MOCK',
		}
	}
}

/**
 * Swap this to a live provider once credentials are available, e.g.:
 *   if (config.gstinProvider === 'LIVE') return new LiveGstinProvider(config.gstinApiKey)
 */
export function resolveGstinProvider(): GstinProvider {
	return new MockGstinProvider()
}
