import { SalesReturnService } from './service';

const service = new SalesReturnService();

export const salesreturnResolvers = {
  Query: {
    salesreturn: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    salesreturns: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createSalesReturn: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateSalesReturn: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteSalesReturn: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
