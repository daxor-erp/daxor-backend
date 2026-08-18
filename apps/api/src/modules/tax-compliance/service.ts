import { GraphQLValidationError } from '@repo/errors'
import { resolveGstinProvider, type GstinCheckResult } from './providers/gstin-provider'
import { resolvePanProvider, type PanLookupResult } from './providers/pan-provider'

export class TaxComplianceService {
	private gstinProvider = resolveGstinProvider()
	private panProvider = resolvePanProvider()

	async checkGstinStatus(gstin: string): Promise<GstinCheckResult> {
		const trimmed = String(gstin ?? '').trim()
		if (!trimmed) throw new GraphQLValidationError('GSTIN is required')
		return this.gstinProvider.checkStatus(trimmed)
	}

	async lookupPan(pan: string): Promise<PanLookupResult> {
		const trimmed = String(pan ?? '').trim()
		if (!trimmed) throw new GraphQLValidationError('PAN is required')
		return this.panProvider.lookup(trimmed)
	}

	async suggestPan(partial: string): Promise<string[]> {
		return this.panProvider.suggest(partial ?? '')
	}
}
