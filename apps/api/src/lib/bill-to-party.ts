import { Client } from '~/modules/client/model'
import { Customer } from '~/modules/customer/model'

/**
 * Resolves a bill-to id to a Customer-shaped object for GraphQL (registered Customer or CRM Client).
 */
export async function loadBillToParty(partyId: string): Promise<any | null> {
	if (!partyId) return null
	const c = await Customer.findById(partyId).lean()
	if (c) return c
	const cl = await Client.findById(partyId).lean()
	if (!cl) return null
	return {
		...cl,
		_id: cl._id,
		docNumber: (cl as any).seqNo || (cl as any).company || '—',
		name: (cl as any).name || (cl as any).company || 'Client',
	}
}
