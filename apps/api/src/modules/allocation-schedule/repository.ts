import { MongoBaseRepository } from '../base/mongo-repository';
import { AllocationSchedule, IAllocationSchedule } from './model';

export class AllocationScheduleRepository extends MongoBaseRepository<IAllocationSchedule> {
  constructor() {
    super(AllocationSchedule);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
