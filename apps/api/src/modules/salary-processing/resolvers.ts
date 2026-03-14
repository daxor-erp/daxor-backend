import { SalaryProcessingService } from './service';

const service = new SalaryProcessingService();

export const salaryprocessingResolvers = {
  Query: {
    salaryprocessing: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    salaryprocessings: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createSalaryProcessing: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateSalaryProcessing: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteSalaryProcessing: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
