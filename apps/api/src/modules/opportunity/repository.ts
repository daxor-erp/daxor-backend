import { MongoBaseRepository } from '../base/mongo-repository';
import { Opportunity, IOpportunity } from './model';

export class OpportunityRepository extends MongoBaseRepository<IOpportunity> {
  constructor() {
    super(Opportunity);
  }

  async findByOrganization(organizationId: string, stage?: string) {
    const filter: any = { organizationId, isDeleted: false };
    if (stage) filter.stage = stage;
    return this.findAll(filter);
  }

  async findByAssignee(assignedTo: string) {
    return this.findAll({ assignedTo, isDeleted: false } as any);
  }
}
