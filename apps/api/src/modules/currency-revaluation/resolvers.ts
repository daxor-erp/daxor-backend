import { CurrencyRevaluationService } from './service';

const service = new CurrencyRevaluationService();

export const resolvers = {
  Query: {
    currencyRevaluation: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    currencyRevaluations: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createCurrencyRevaluation: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    postCurrencyRevaluation: async (_: any, { id }: { id: string }) => {
      return service.post(id);
    },
    deleteCurrencyRevaluation: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  CurrencyRevaluation: {
    id: (c: any) => c._id || c.id,
  },
};
