import { MongoBaseRepository } from '../base/mongo-repository';
import { SalesReturn, ISalesReturn } from './model';

export class SalesReturnRepository extends MongoBaseRepository<ISalesReturn> {
  constructor() {
    super(SalesReturn);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
