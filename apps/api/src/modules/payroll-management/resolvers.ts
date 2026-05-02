import { PayrollManagementService } from './service';

const service = new PayrollManagementService();

function iso(d: unknown): string | null {
  if (d == null) return null;
  const t = new Date(d as string | number | Date).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

const payrollmanagementResolvers = {
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
  PayrollManagement: {
    id: (p: { _id?: unknown; id?: string }) => (p?._id ?? p?.id) as string,
    docDate: (p: { docDate?: unknown }) => iso(p?.docDate) ?? '',
    createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
    payPeriodStart: (p: { payPeriodStart?: unknown }) => iso(p?.payPeriodStart),
    payPeriodEnd: (p: { payPeriodEnd?: unknown }) => iso(p?.payPeriodEnd),
  },
}

/** @graphql-tools/load-files picks this name so Query/Mutation merge into the root schema. */
export const resolvers = payrollmanagementResolvers
