import { AppraisalService } from './service';

const service = new AppraisalService();

export const resolvers = {
  Query: {
    appraisal: (_: any, { id }: any) => service.getById(id),
    appraisals: (_: any, { organizationId }: any) => service.getAll(organizationId),
  },
  Mutation: {
    createAppraisal: (_: any, { input }: any, ctx: any) =>
      service.create(input, ctx.user?.id || 'system'),
    updateAppraisal: (_: any, { id, input }: any) => service.update(id, input),
    transitionAppraisal: (_: any, { id, status }: any) => service.transition(id, status),
    deleteAppraisal: async (_: any, { id }: any) => {
      await service.delete(id);
      return true;
    },
  },
};
