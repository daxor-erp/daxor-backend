import { SalaryProcessingService } from './service';

const service = new SalaryProcessingService();

function iso(d: unknown): string | null {
  if (d == null) return null;
  const t = new Date(d as string | number | Date).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString();
}

const salaryprocessingResolvers = {
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
  SalaryProcessing: {
    id: (p: { _id?: unknown; id?: string }) => (p?._id ?? p?.id) as string,
    docDate: (p: { docDate?: unknown }) => iso(p?.docDate) ?? '',
    createdAt: (p: { createdAt?: unknown }) => iso(p?.createdAt) ?? '',
    payPeriodStart: (p: { payPeriodStart?: unknown }) => iso(p?.payPeriodStart),
    payPeriodEnd: (p: { payPeriodEnd?: unknown }) => iso(p?.payPeriodEnd),
  },
}

export const resolvers = salaryprocessingResolvers