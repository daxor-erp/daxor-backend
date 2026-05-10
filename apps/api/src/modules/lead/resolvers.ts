import { LeadService } from './service';
import { OpportunityService } from '../opportunity/service';

const service = new LeadService();
const opportunityService = new OpportunityService();

export const resolvers = {
  Query: {
    lead: async (_: any, { id }: { id: string }) => {
      return service.getById(id);
    },
    leads: async (_: any, { organizationId, status }: any) => {
      return service.getAll(organizationId, status);
    },
  },
  Mutation: {
    createLead: async (_: any, { input }: any, context: any) => {
      try {
        const lead = await service.create(input, context.user?.id || 'system');
        if (!lead) {
          throw new Error('Failed to create lead - no result returned');
        }
        return lead;
      } catch (error) {
        console.error('Error in createLead resolver:', error);
        throw error;
      }
    },
    updateLead: async (_: any, { id, input }: any) => {
      return service.update(id, input);
    },
    deleteLead: async (_: any, { id }: { id: string }) => {
      await service.delete(id);
      return true;
    },
    convertLeadToOpportunity: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const lead = await service.convertToOpportunity(id);
        console.log('Lead converted:', lead);
        
        const opportunityData = {
          name: `${lead.firstName} ${lead.lastName} - ${lead.company || 'Opportunity'}`,
          accountName: lead.company || '',
          contactName: `${lead.firstName} ${lead.lastName}`,
          email: lead.email || '',
          phone: lead.phone || '',
          amount: lead.estimatedValue,
          closeDate: lead.expectedCloseDate,
          stage: 'prospecting',
          probability: 10,
          leadSource: lead.source || '',
          organizationId: lead.organizationId,
        };
        
        console.log('Creating opportunity with data:', opportunityData);
        const opportunity = await opportunityService.create(opportunityData, context.user?.id || 'system');
        console.log('Opportunity created:', opportunity);
        
        return opportunity._id || opportunity.id;
      } catch (error) {
        console.error('Error converting lead to opportunity:', error);
        throw error;
      }
    },
  },
  Lead: {
    id: (l: any) => l._id || l.id,
  },
};
