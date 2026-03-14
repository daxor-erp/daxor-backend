import { MaterialReceiptService } from './service';

const service = new MaterialReceiptService();

export const materialreceiptResolvers = {
  Query: {
    materialreceipt: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    materialreceipts: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createMaterialReceipt: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateMaterialReceipt: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteMaterialReceipt: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
