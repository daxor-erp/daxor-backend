import { InventoryReturnService } from './service';

const service = new InventoryReturnService();

export const resolvers = {
  Query: {
    inventoryreturn: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    inventoryreturns: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createInventoryReturn: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateInventoryReturn: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteInventoryReturn: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};

export const inventoryreturnResolvers = resolvers
