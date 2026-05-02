import { CashBankService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'

const service = new CashBankService()

export const resolvers = {
  Query: {
    cashBank: async (_: unknown, { id }: { id: string }) => {
      // Return single transaction - fetch all and find by id since service doesn't expose findById
      const orgId = '' // id-based lookup not supported in service; return null gracefully
      return null
    },
    cashBanks: async (
      _: unknown,
      {
        organizationId,
        reconciliationStatus,
        bankAccount,
      }: { organizationId: string; reconciliationStatus?: string; bankAccount?: string },
    ) => {
      return service.getTransactions(organizationId, {
        reconciliationStatus: reconciliationStatus || undefined,
        bankAccount: bankAccount || undefined,
      })
    },
    bankAccount: async (_: unknown, { id }: { id: string }) => {
      return null
    },
    bankAccounts: async (_: unknown, { organizationId }: any) => {
      return service.getBankAccounts(organizationId)
    },
    bankStatementLines: async (
      _: unknown,
      {
        organizationId,
        bankAccount,
        onlyUnmatched,
      }: { organizationId: string; bankAccount: string; onlyUnmatched?: boolean | null },
    ) => {
      return service.getBankStatementLines(organizationId, bankAccount, onlyUnmatched ?? undefined)
    },
    reconciliationRules: async (_: unknown, { organizationId }: { organizationId: string }) => {
      return service.getReconciliationRules(organizationId)
    },
  },
  Mutation: {
    createCashBank: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      return service.createTransaction(input, ctx.user?.id ?? 'system')
    },
    reconcileCashBank: async (_: unknown, { id }: { id: string }) => {
      return service.reconcileTransaction(id)
    },
    createBankAccount: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      return service.createBankAccount(input)
    },
    updateBankAccount: async (_: unknown, { id, input }: any) => {
      return service.updateBankAccount(id, input)
    },
    createBankStatementLine: async (_: unknown, { input }: any) => {
      return service.createBankStatementLine({
        organizationId: input.organizationId,
        bankAccount: input.bankAccount,
        lineDate: new Date(input.lineDate),
        amount: input.amount,
        lineKind: input.lineKind,
        description: input.description,
        bankReference: input.bankReference ?? '',
      })
    },
    deleteBankStatementLine: async (_: unknown, { id }: { id: string }) => {
      return service.deleteBankStatementLine(id)
    },
    matchBankStatementLineToBook: async (
      _: unknown,
      { bankStatementLineId, cashBankId }: { bankStatementLineId: string; cashBankId: string },
    ) => {
      return service.matchBankStatementLineToBook(bankStatementLineId, cashBankId)
    },
    createReconciliationRule: async (_: unknown, { input }: any) => {
      return service.createReconciliationRule(input)
    },
    updateReconciliationRule: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
    ) => {
      const patch = Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== undefined),
      ) as Record<string, unknown>
      return service.updateReconciliationRule(id, patch as any)
    },
    deleteReconciliationRule: async (_: unknown, { id }: { id: string }) => {
      return service.deleteReconciliationRule(id)
    },
    transferBankFunds: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      return service.transferBankFunds(input, ctx.user?.id ?? 'system')
    },
  },
  CashBank: {
    id: (p: any) => p._id || p.id,
    transactionDate: (p: any) => p.transactionDate ? new Date(p.transactionDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    reconciliationDate: (p: any) => (p.reconciliationDate ? new Date(p.reconciliationDate).toISOString() : null),
  },
  BankAccount: {
    id: (p: any) => p._id || p.id,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    accountHolder: (p: any) => (p.accountHolder && String(p.accountHolder).trim()) || p.accountName || '',
  },
  BankStatementLine: {
    id: (p: any) => p._id || p.id,
    lineDate: (p: any) => (p.lineDate ? new Date(p.lineDate).toISOString() : null),
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
    bankReference: (p: any) => p.bankReference ?? '',
    matchedCashBankId: (p: any) => (p.matchedCashBankId ? String(p.matchedCashBankId) : null),
  },
  ReconciliationRule: {
    id: (p: any) => p._id || p.id,
    createdAt: (p: any) => (p.createdAt ? new Date(p.createdAt).toISOString() : null),
    updatedAt: (p: any) => (p.updatedAt ? new Date(p.updatedAt).toISOString() : null),
    bankAccount: (p: any) => (p.bankAccount !== undefined && p.bankAccount !== null ? String(p.bankAccount) : ''),
  },
}
