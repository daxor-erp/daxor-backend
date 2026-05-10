import { ProductionPlanningService } from './service';

const service = new ProductionPlanningService();

export const productionplanningResolvers = {
  Query: {
    productionplanning: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    productionplannings: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createProductionPlanning: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateProductionPlanning: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteProductionPlanning: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  ProductionPlanning: {
    id: (p: any) => p._id || p.id,
  },
};
