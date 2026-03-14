import { StockTransferService } from './service';

const service = new StockTransferService();

export const stocktransferResolvers = {
  Query: {
    stocktransfer: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    stocktransfers: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createStockTransfer: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateStockTransfer: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteStockTransfer: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
