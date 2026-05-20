import { PayslipService } from './service';

const service = new PayslipService();

export const resolvers = {
  Query: {
    payslip: (_: any, { id }: { id: string }) => service.getById(id),
    payslipsByRun: (_: any, { payrollRunId }: any) => service.getByRun(payrollRunId),
    payslipsByEmployee: (_: any, { employeeId }: any) => service.getByEmployee(employeeId),
  },
  Mutation: {
    computePayrollRun: (_: any, { payrollRunId }: any, context: any) =>
      service.compute(payrollRunId, context.user?.id || 'system'),
    deletePayslip: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
    exportPayrollRunNeft: (_: any, { payrollRunId }: any) => service.exportNeft(payrollRunId),
    // disburseViaRazorpayX: (_, { payrollRunId }) => disburseRunViaRazorpayX(payrollRunId),  // commented: not used
  },
};
