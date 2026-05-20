import { MongoBaseRepository } from '../base/mongo-repository';
import { Appraisal, IAppraisal } from './model';

export class AppraisalRepository extends MongoBaseRepository<IAppraisal> {
  constructor() { super(Appraisal); }
  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
  async findByEmployeeAndCycle(employeeId: string, cycle: string) {
    return this.findOne({ employeeId, cycle, isDeleted: false } as any);
  }
}
