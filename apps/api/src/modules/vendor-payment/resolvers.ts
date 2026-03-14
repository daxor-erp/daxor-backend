import { VendorPaymentService } from './service';

const service = new VendorPaymentService();

export const vendorpaymentResolvers = {
  Query: {
    vendorpayment: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    vendorpayments: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createVendorPayment: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateVendorPayment: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteVendorPayment: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
};
