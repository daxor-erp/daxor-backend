import { DeliveryChallanService } from './service';

const service = new DeliveryChallanService();

export const deliverychallanResolvers = {
  Query: {
    deliverychallan: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    deliverychallans: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createDeliveryChallan: async (_: any, { input }: any, context: any) => {
      const created = await service.create(input, context.user?.id || 'system');
      if (!created) {
        throw new Error('Failed to create delivery challan');
      }
      return created;
    },
    updateDeliveryChallan: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteDeliveryChallan: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};

// Ensure GraphQL resolver merging picks this module consistently.
export const resolvers = deliverychallanResolvers;
