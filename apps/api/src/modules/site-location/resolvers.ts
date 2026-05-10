import { SiteLocationService } from './service';

const service = new SiteLocationService();

export const resolvers = {
  Query: {
    siteLocation: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    siteLocations: async (_: any, { organizationId }: any) => {
      return service.getAll(organizationId);
    },
  },
  Mutation: {
    createSiteLocation: async (_: any, { input }: any, context: any) => {
      return service.create(input, context.user?.id || 'system');
    },
    updateSiteLocation: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteSiteLocation: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
  },
  SiteLocation: {
    id: (s: any) => s._id || s.id,
  },
};
