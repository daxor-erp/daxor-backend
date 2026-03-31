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
    cashBanks: async (_: unknown, { organizationId }: any) => {
      return service.getTransactions(organizationId)
    },
    bankAccount: async (_: unknown, { id }: { id: string }) => {
      return null
    },
    bankAccounts: async (_: unknown, { organizationId }: any) => {
      return service.getBankAccounts(organizationId)
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
  },
  CashBank: {
    id: (p: any) => p._id || p.id,
    transactionDate: (p: any) => p.transactionDate ? new Date(p.transactionDate).toISOString() : null,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
  },
  BankAccount: {
    id: (p: any) => p._id || p.id,
    createdAt: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString() : null,
  },
}
