import { JournalEntryService } from './service';

const service = new JournalEntryService();

export const resolvers = {
  Query: {
    journalEntry: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    journalEntries: async (_: any, { organizationId, status }: any) => {
      return service.getAll(organizationId, status);
    },
  },
  Mutation: {
    createJournalEntry: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateJournalEntry: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    postJournalEntry: async (_: any, { id }: { id: string }, context: any) => {
      return service.post(id, context.user?.id || 'system');
    },
    deleteJournalEntry: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  JournalEntry: {
    id: (j: any) => j._id || j.id,
  },
};
