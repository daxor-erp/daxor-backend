import { ExciseInvoiceService } from './service';

const service = new ExciseInvoiceService();

export const resolvers = {
  Query: {
    exciseinvoice: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    exciseinvoices: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createExciseInvoice: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateExciseInvoice: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteExciseInvoice: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};

export const exciseinvoiceResolvers = resolvers
