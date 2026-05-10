import { AllocationScheduleService } from './service';

const service = new AllocationScheduleService();

export const resolvers = {
  Query: {
    allocationSchedule: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    allocationSchedules: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createAllocationSchedule: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateAllocationSchedule: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteAllocationSchedule: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  AllocationSchedule: {
    id: (a: any) => a._id || a.id,
  },
};
