import { MongoBaseRepository } from '../base/mongo-repository';
import { InternalOrder, IInternalOrder } from './model';

export class InternalOrderRepository extends MongoBaseRepository<IInternalOrder> {
  constructor() {
    super(InternalOrder);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
