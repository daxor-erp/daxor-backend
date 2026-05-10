import { MongoBaseRepository } from '../base/mongo-repository';
import { Contractor, IContractor } from './model';

export class ContractorRepository extends MongoBaseRepository<IContractor> {
  constructor() {
    super(Contractor);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
