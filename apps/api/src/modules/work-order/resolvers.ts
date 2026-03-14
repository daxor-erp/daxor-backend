import { WorkOrderService } from './service';

const service = new WorkOrderService();

export const workorderResolvers = {
  Query: {
    workorder: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    workorders: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createWorkOrder: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateWorkOrder: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteWorkOrder: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
