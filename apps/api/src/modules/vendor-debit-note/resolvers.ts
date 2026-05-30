import { VendorDebitNoteService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new VendorDebitNoteService()

export const resolvers = {
  Query: {
    vendorDebitNote: (_: unknown, { id }: { id: string }) => service.getDebitNoteById(id),
    vendorDebitNotes: (_: unknown, args: any) => {
      const { organizationId, vendorId } = args
      const filter: Record<string, unknown> = {}
      if (vendorId) filter.vendorId = vendorId
      return service.getDebitNotes(organizationId, filter)
    },
  },
  Mutation: {
    createVendorDebitNote: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.createDebitNote(input, ctx.user?.id ?? ''),
    applyVendorDebitNoteToBill: (
      _: unknown,
      { debitNoteId, billId, amount }: { debitNoteId: string; billId: string; amount: number },
      ctx: GraphQLContext,
    ) => service.applyToBill(debitNoteId, billId, amount, ctx.user?.id ?? ''),
    updateVendorDebitNote: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.updateDebitNote(id, input, ctx.user?.id ?? ''),
    deleteVendorDebitNote: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.deleteDebitNote(id, ctx.user?.id ?? '')
      return true
    },
  },
  VendorDebitNote: {
    id: (p: any) => p._id || p.id,
    debitDate: (p: any) => (p.debitDate ? new Date(p.debitDate).toISOString() : null),
    createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : null),
    updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : null),
    vendorId: (p: any) =>
      typeof p.vendorId === 'object'
        ? (p.vendorId._id?.toString() ?? p.vendorId.id)
        : p.vendorId?.toString(),
    vendor: (p: any) => (typeof p.vendorId === 'object' ? p.vendorId : null),
    purchaseOrderId: (p: any) => (p.purchaseOrderId != null ? String(p.purchaseOrderId) : null),
    vendorBillId: (p: any) => (p.vendorBillId != null ? String(p.vendorBillId) : null),
    appliedAmount: (p: any) => Number(p.appliedAmount ?? 0),
    remainingAmount: (p: any) =>
      Number(p.remainingAmount ?? Math.max(0, Number(p.totalAmount ?? 0) - Number(p.appliedAmount ?? 0))),
    billAllocations: (p: any) =>
      (p.billAllocations ?? []).map((a: any) => ({
        billId: String(a.billId?._id ?? a.billId ?? ''),
        amount: Number(a.amount ?? 0),
        appliedAt: a.appliedAt ? new Date(a.appliedAt).toISOString() : null,
      })),
  },
}
