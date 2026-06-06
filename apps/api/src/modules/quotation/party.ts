import { GraphQLValidationError } from '@repo/errors'

export const QUOTATION_PARTY_POPULATE = [
  { path: 'customerId', select: 'name email docNumber' },
  { path: 'clientId', select: 'name email' },
] as const

export function normalizeQuotationCustomerId(data: {
  customerId?: string
  clientId?: string
}): string {
  const id = data.customerId || data.clientId
  if (!id) throw new GraphQLValidationError('customerId is required')
  return String(id)
}

function partyFromDoc(
  doc: { _id?: unknown; id?: unknown; name?: string; email?: string; docNumber?: string },
  includeDocNumber = false,
): { id: string; name: string; email?: string; docNumber?: string } {
  const id = String(doc._id ?? doc.id ?? '')
  const name = String(doc.name ?? '').trim() || 'Unknown customer'
  const out: { id: string; name: string; email?: string; docNumber?: string } = {
    id: id || 'unknown',
    name,
    email: doc.email ?? undefined,
  }
  if (includeDocNumber && doc.docNumber) out.docNumber = doc.docNumber
  return out
}

export function mapPartyRef(parent: any): { id: string; name: string; email?: string; docNumber?: string } {
  const c = parent?.customerId
  if (c && typeof c === 'object') {
    return partyFromDoc(c, true)
  }
  const cl = parent?.clientId
  if (cl && typeof cl === 'object') {
    return partyFromDoc(cl, false)
  }
  const rawId = parent?.customerId ?? parent?.clientId
  const id =
    rawId != null && typeof rawId === 'object'
      ? String((rawId as { _id?: unknown; id?: unknown })._id ?? (rawId as { id?: unknown }).id ?? '')
      : rawId != null
        ? String(rawId)
        : ''
  return {
    id: id || 'unknown',
    name: 'Unknown customer',
    email: undefined,
  }
}
