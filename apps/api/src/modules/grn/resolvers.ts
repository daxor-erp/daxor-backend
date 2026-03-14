import { GRNService } from './service';

const service = new GRNService();

export const grnResolvers = {
  Query: {
    grn: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    grns: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createGRN: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateGRN: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteGRN: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
