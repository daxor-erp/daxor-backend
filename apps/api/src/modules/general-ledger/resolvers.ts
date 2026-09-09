import { GeneralLedgerService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new GeneralLedgerService()

export const resolvers = {
  Query: {
    generalLedger: async (_: unknown, { id }: { id: string }) => {
      return service.getTransactionById(id)
    },
    generalLedgers: async (_: unknown, { organizationId, fiscalYear, status }: any) => {
      return service.getTransactions(organizationId, { fiscalYear, status })
    },
    chartOfAccount: async (_: unknown, { id }: { id: string }) => {
      return null
    },
    chartOfAccounts: async (_: unknown, { organizationId, accountType }: any) => {
      return service.getChartOfAccounts(organizationId, { accountType })
    },
    trialBalance: async (
      _: unknown,
      {
        organizationId,
        dateFrom,
        dateTo,
      }: { organizationId: string; dateFrom?: string | null; dateTo?: string | null },
    ) => {
      const rows = await service.getTrialBalance(organizationId, { dateFrom, dateTo })
      return rows.map((r) => ({
        ...r,
        net: Math.round((r.debit - r.credit) * 100) / 100,
      }))
    },
    incomeStatement: async (
      _: unknown,
      {
        organizationId,
        dateFrom,
        dateTo,
      }: { organizationId: string; dateFrom?: string | null; dateTo?: string | null },
    ) => service.getIncomeStatement(organizationId, { dateFrom, dateTo }),
    balanceSheet: async (
      _: unknown,
      {
        organizationId,
        dateFrom,
        dateTo,
      }: { organizationId: string; dateFrom?: string | null; dateTo?: string | null },
    ) => service.getBalanceSheet(organizationId, { dateFrom, dateTo }),
    agedPayable: async (_: unknown, { organizationId }: { organizationId: string }) =>
      service.getAgedPayable(organizationId),
    agedReceivable: async (_: unknown, { organizationId }: { organizationId: string }) =>
      service.getAgedReceivable(organizationId),
  },
  TrialBalanceLine: {
    net: (p: any) => p.net ?? Math.round((Number(p.debit) - Number(p.credit)) * 100) / 100,
  },
  Mutation: {
    createGeneralLedger: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      return service.createTransaction(input, ctx.user?.id ?? 'system')
    },
    createChartOfAccount: async (_: unknown, { input }: any) => {
      return service.createChartOfAccount(input)
    },
    updateChartOfAccount: async (_: unknown, { id, input }: any) => {
      return service.updateChartOfAccount(id, input)
    },
    deleteChartOfAccount: async (_: unknown, { id }: { id: string }) => {
      await service.deleteChartOfAccount(id)
      return true
    },
  },
  GeneralLedger: {
    id: (p: any) => p._id || p.id,
    transactionDate: (p: any) => p.transactionDate ? new Date(p.transactionDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    updatedAt: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
  },
  ChartOfAccounts: {
    id: (p: any) => p._id || p.id,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    updatedAt: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
  },
}
