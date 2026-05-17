import { InternalOrderService } from './service';

const service = new InternalOrderService();

export const resolvers = {
  Query: {
    internalorder: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    internalorders: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createInternalOrder: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateInternalOrder: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteInternalOrder: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};

export const internalorderResolvers = resolvers
