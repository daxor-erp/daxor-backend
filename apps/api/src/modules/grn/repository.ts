import { MongoBaseRepository } from '../base/mongo-repository';
import { GRN, IGRN } from './model';

export class GRNRepository extends MongoBaseRepository<IGRN> {
  constructor() {
    super(GRN);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
