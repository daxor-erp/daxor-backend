import { OnboardingService } from './service';

const service = new OnboardingService();

export const resolvers = {
  Query: {
    onboarding: (_: any, { id }: any) => service.getById(id),
    onboardings: (_: any, { organizationId }: any) => service.getAll(organizationId),
    onboardingForEmployee: (_: any, { employeeId }: any) => service.getByEmployee(employeeId),
  },
  Mutation: {
    createOnboarding: (_: any, { input }: any, ctx: any) =>
      service.create(input, ctx.user?.id || 'system'),
    updateOnboarding: (_: any, { id, input }: any) => service.update(id, input),
    toggleOnboardingTask: (_: any, { id, index, done }: any) =>
      service.toggleTask(id, index, done),
    deleteOnboarding: async (_: any, { id }: any) => {
      await service.delete(id);
      return true;
    },
  },
};
