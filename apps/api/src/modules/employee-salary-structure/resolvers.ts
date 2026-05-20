import { EmployeeSalaryStructureService } from './service';

const service = new EmployeeSalaryStructureService();

export const resolvers = {
  Query: {
    employeeSalaryStructure: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    employeeSalaryStructures: async (_: any, { organizationId }: any) => {
      const rows = await service.getAll(organizationId);
      return rows ?? [];
    },
    activeSalaryStructureForEmployee: async (_: any, { employeeId }: any) => {
      return service.getActiveForEmployee(employeeId);
    },
  },
  Mutation: {
    createEmployeeSalaryStructure: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateEmployeeSalaryStructure: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteEmployeeSalaryStructure: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
