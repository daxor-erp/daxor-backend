import { BudgetService } from './service';

const service = new BudgetService();

export const resolvers = {
  Query: {
    budget: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    budgets: async (_: any, { organizationId, fiscalYear }: any) => {
      return service.getAll(organizationId, fiscalYear);
    },
  },
  Mutation: {
    createBudget: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateBudget: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    activateBudget: async (_: any, { id }: { id: string }) => {
      return service.activate(id);
    },
    deleteBudget: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  Budget: {
    id: (b: any) => b._id || b.id,
  },
};
