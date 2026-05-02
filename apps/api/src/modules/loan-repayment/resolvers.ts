import { LoanRepaymentService } from './service'

const service = new LoanRepaymentService()

function iso(d: unknown): string | null {
  if (d == null) return null
  const t = new Date(d as string | number | Date).getTime()
  if (Number.isNaN(t)) return null
  return new Date(t).toISOString()
}

const loanrepaymentResolvers = {
  Query: {
    loanrepayment: async (_: any, { id }: { id: string }) => {
      return service.getById(id)
    },
    loanrepayments: async (_: any, { organizationId }: { organizationId: string }) => {
      return service.getAll(organizationId)
    },
  },
  Mutation: {
    createLoanRepayment: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system')
    },
    updateLoanRepayment: async (_: any, { id, input }: any) => {
      return service.update(id, input)
    },
    deleteLoanRepayment: async (_: any, { id }: { id: string }) => {
      await service.delete(id)
      return true
    },
  },
  LoanRepayment: {
    id: (p: { _id?: unknown; id?: string }) => (p?._id ?? p?.id) as string,
    docDate: (p: { docDate?: unknown }) => iso(p?.docDate) ?? '',
    createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
    payPeriodStart: (p: { payPeriodStart?: unknown }) => iso(p?.payPeriodStart),
    payPeriodEnd: (p: { payPeriodEnd?: unknown }) => iso(p?.payPeriodEnd),
    repaymentAmount: (p: { repaymentAmount?: unknown }) => {
      const n = p?.repaymentAmount
      if (n == null) return 0
      if (typeof n === 'number') return n
      const x = parseFloat(String(n))
      return Number.isNaN(x) ? 0 : x
    },
  },
}

export const resolvers = loanrepaymentResolvers
