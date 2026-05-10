import { MongoBaseRepository } from '../base/mongo-repository';
import { Lead, ILead } from './model';

export class LeadRepository extends MongoBaseRepository<ILead> {
  constructor() {
    super(Lead);
  }

  async findByOrganization(organizationId: string, status?: string) {
    const filter: any = { organizationId, isDeleted: false };
    if (status) filter.status = status;
    return this.findAll(filter);
  }

  async findByAssignee(assignedTo: string) {
    return this.findAll({ assignedTo, isDeleted: false } as any);
  }
}
