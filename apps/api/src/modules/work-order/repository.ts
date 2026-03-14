import { MongoBaseRepository } from '../base/mongo-repository';
import { WorkOrder, IWorkOrder } from './model';

export class WorkOrderRepository extends MongoBaseRepository<IWorkOrder> {
  constructor() {
    super(WorkOrder);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
