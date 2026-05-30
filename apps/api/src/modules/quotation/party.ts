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

export function mapPartyRef(parent: any): { id: string; name: string; email?: string; docNumber?: string } {
  const c = parent?.customerId
  if (c && typeof c === 'object') {
    return {
      id: String(c._id ?? c.id),
      name: String(c.name ?? ''),
      email: c.email ?? undefined,
      docNumber: c.docNumber ?? undefined,
    }
  }
  const cl = parent?.clientId
  if (cl && typeof cl === 'object') {
    return {
      id: String(cl._id ?? cl.id),
      name: String(cl.name ?? ''),
      email: cl.email ?? undefined,
    }
  }
  const id = parent?.customerId?.toString?.() ?? parent?.clientId?.toString?.() ?? ''
  return { id, name: '', email: undefined }
}
