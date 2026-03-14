import { MongoBaseRepository } from '../base/mongo-repository';
import { DeliveryChallan, IDeliveryChallan } from './model';

export class DeliveryChallanRepository extends MongoBaseRepository<IDeliveryChallan> {
  constructor() {
    super(DeliveryChallan);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
