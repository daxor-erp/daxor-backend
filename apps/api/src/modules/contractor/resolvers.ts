import { ContractorService } from './service';

const service = new ContractorService();

export const resolvers = {
  Query: {
    contractor: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    contractors: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createContractor: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateContractor: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteContractor: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  Contractor: {
    id: (c: any) => c._id || c.id,
  },
};
