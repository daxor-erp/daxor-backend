import { MongoBaseRepository } from '../base/mongo-repository';
import { PayrollManagement, IPayrollManagement } from './model';

export class PayrollManagementRepository extends MongoBaseRepository<IPayrollManagement> {
  constructor() {
    super(PayrollManagement);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
