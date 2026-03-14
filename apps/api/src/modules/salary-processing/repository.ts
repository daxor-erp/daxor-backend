import { MongoBaseRepository } from '../base/mongo-repository';
import { SalaryProcessing, ISalaryProcessing } from './model';

export class SalaryProcessingRepository extends MongoBaseRepository<ISalaryProcessing> {
  constructor() {
    super(SalaryProcessing);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
