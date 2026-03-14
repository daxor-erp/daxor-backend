import { GoodsReceiptService } from './service';

const service = new GoodsReceiptService();

export const goodsreceiptResolvers = {
  Query: {
    goodsreceipt: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    goodsreceipts: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createGoodsReceipt: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateGoodsReceipt: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteGoodsReceipt: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
