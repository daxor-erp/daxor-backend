/**
 * Pluggable PAN lookup/verification provider interface.
 *
 * Real integration (NSDL/Protean e-Gov, Income Tax dept. API, or a KYC aggregator) requires paid
 * credentials not available here. This mock keeps the "PAN autocomplete/lookup" UX fully wired;
 * swap `resolvePanProvider` for a live implementation when credentials are provisioned.
 */

export interface PanLookupResult {
	pan: string
	valid: boolean
	holderType?: 'Individual' | 'Company' | 'HUF' | 'Firm' | 'Trust' | 'Other'
	nameOnRecord?: string
	message: string
	source: 'MOCK' | 'LIVE'
}

/** 5 letters + 4 digits + 1 letter. 4th char denotes holder type (P=Individual, C=Company, ...). */
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/

const PAN_HOLDER_TYPE_BY_4TH_CHAR: Record<string, PanLookupResult['holderType']> = {
	P: 'Individual',
	C: 'Company',
	H: 'HUF',
	F: 'Firm',
	T: 'Trust',
	A: 'Other', // Association of Persons
	B: 'Other', // Body of Individuals
	G: 'Other', // Government
	J: 'Other', // Artificial Juridical Person
	L: 'Other', // Local Authority
}

export function isValidPanFormat(pan: string): boolean {
	return PAN_PATTERN.test(String(pan ?? '').trim().toUpperCase())
}

export interface PanProvider {
	lookup(pan: string): Promise<PanLookupResult>
	/** Autocomplete-style suggestions as the user types (format-check only in mock mode). */
	suggest(partial: string): Promise<string[]>
}

class MockPanProvider implements PanProvider {
	async lookup(panRaw: string): Promise<PanLookupResult> {
		const pan = String(panRaw ?? '').trim().toUpperCase()
		if (!isValidPanFormat(pan)) {
			return {
				pan,
				valid: false,
				message: 'PAN format is invalid. Expected 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F).',
				source: 'MOCK',
			}
		}
		const holderType = PAN_HOLDER_TYPE_BY_4TH_CHAR[pan.charAt(3)] ?? 'Other'
		return {
			pan,
			valid: true,
			holderType,
			nameOnRecord: undefined,
			message: 'PAN format is valid.',
			source: 'MOCK',
		}
	}

	async suggest(partial: string): Promise<string[]> {
		const p = String(partial ?? '').trim().toUpperCase()
		if (p.length < 3) return []
		// Mock mode can't fetch real candidates — return the input if it's already a valid PAN.
		return isValidPanFormat(p) ? [p] : []
	}
}

export function resolvePanProvider(): PanProvider {
	return new MockPanProvider()
}
