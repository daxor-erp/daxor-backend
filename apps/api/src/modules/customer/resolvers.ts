import { CustomerService } from './service';

const service = new CustomerService();

export const customerResolvers = {
  Query: {
    customer: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    customers: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createCustomer: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateCustomer: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteCustomer: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
