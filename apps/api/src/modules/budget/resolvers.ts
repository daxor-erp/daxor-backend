import { BudgetService } from './service';

const service = new BudgetService();

function iso(d: unknown): string | null {
  if (d == null || d === '') return null;
  const t = new Date(d as string | number | Date).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

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
      const payload = {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      };
      return service.create(payload, context.user?.id || 'system');
    },
    updateBudget: async (_: any, { id, input }: any) => {
      const payload = {
        ...input,
        ...(input.startDate != null ? { startDate: new Date(input.startDate) } : {}),
        ...(input.endDate != null ? { endDate: new Date(input.endDate) } : {}),
      };
      return service.update(id, payload);
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
    id: (b: any) => String(b._id ?? b.id ?? ''),
    startDate: (b: any) => iso(b.startDate) ?? '',
    endDate: (b: any) => iso(b.endDate) ?? '',
    createdAt: (b: any) => iso(b.createdAt) ?? '',
  },
};
