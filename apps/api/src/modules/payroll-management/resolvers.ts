import { PayrollManagementService } from './service';

const service = new PayrollManagementService();

export const payrollmanagementResolvers = {
  Query: {
    payrollmanagement: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    payrollmanagements: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createPayrollManagement: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updatePayrollManagement: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deletePayrollManagement: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
