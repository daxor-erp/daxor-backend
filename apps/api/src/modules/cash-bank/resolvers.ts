import { CashBankService } from './service';

const service = new CashBankService();

export const cashBankResolvers = {
  Query: {
    cashBank: async (_: any, { id }: { id: string }) => {
      return service.getTransactions('');
    },
    cashBanks: async (_: any, { organizationId }: any) => {
      return service.getTransactions(organizationId);
    },
    bankAccount: async (_: any, { id }: { id: string }) => {
      return service.getBankAccounts('');
    },
    bankAccounts: async (_: any, { organizationId }: any) => {
      return service.getBankAccounts(organizationId);
    },
  },
  Mutation: {
    createCashBank: async (_: any, { input }: any, context: any) => {
      return service.createTransaction(input, context.user?.id || 'system');
    },
    reconcileCashBank: async (_: any, { id }: { id: string }) => {
      return service.reconcileTransaction(id);
    },
    createBankAccount: async (_: any, { input }: any) => {
      return service.createBankAccount(input);
    },
    updateBankAccount: async (_: any, { id, input }: any) => {
      return service.updateBankAccount(id, input);
    },
  },
};
