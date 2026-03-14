import { StockAdjustmentService } from './service';

const service = new StockAdjustmentService();

export const stockadjustmentResolvers = {
  Query: {
    stockadjustment: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    stockadjustments: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createStockAdjustment: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateStockAdjustment: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteStockAdjustment: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
