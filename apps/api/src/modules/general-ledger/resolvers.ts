import { GeneralLedgerService } from './service';

const service = new GeneralLedgerService();

export const generalLedgerResolvers = {
  Query: {
    generalLedger: async (_: any, { id }: { id: string }) => {
      return service.getTransactionById(id);
    },
    generalLedgers: async (_: any, { organizationId, fiscalYear, status }: any) => {
      return service.getTransactions(organizationId, { fiscalYear, status });
    },
    chartOfAccount: async (_: any, { id }: { id: string }) => {
      return service.getChartOfAccounts('', { id });
    },
    chartOfAccounts: async (_: any, { organizationId, accountType }: any) => {
      return service.getChartOfAccounts(organizationId, { accountType });
    },
  },
  Mutation: {
    createGeneralLedger: async (_: any, { input }: any, context: any) => {
      return service.createTransaction(input, context.user?.id || 'system');
    },
    createChartOfAccount: async (_: any, { input }: any) => {
      return service.createChartOfAccount(input);
    },
    updateChartOfAccount: async (_: any, { id, input }: any) => {
      return service.updateChartOfAccount(id, input);
    },
    deleteChartOfAccount: async (_: any, { id }: { id: string }) => {
      await service.deleteChartOfAccount(id);
      return true;
    },
  },
};
