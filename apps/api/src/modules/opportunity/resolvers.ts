import { OpportunityService } from './service';

const service = new OpportunityService();

export const resolvers = {
  Query: {
    opportunity: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    opportunities: async (_: any, { organizationId, stage }: any) => {
      return service.getAll(organizationId, stage);
    },
  },
  Mutation: {
    createOpportunity: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateOpportunity: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteOpportunity: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  Opportunity: {
    id: (o: any) => o._id || o.id,
  },
};
