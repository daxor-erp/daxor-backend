import { IpInspectionService } from './service';

const service = new IpInspectionService();

export const resolvers = {
  Query: {
    ipinspection: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    ipinspections: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createIPInspection: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateIPInspection: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteIPInspection: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};

export const ipinspectionResolvers = resolvers
