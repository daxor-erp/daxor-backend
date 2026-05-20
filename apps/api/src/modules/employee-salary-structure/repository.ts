import { MongoBaseRepository } from '../base/mongo-repository';
import { EmployeeSalaryStructure, IEmployeeSalaryStructure } from './model';

export class EmployeeSalaryStructureRepository extends MongoBaseRepository<IEmployeeSalaryStructure> {
  constructor() {
    super(EmployeeSalaryStructure);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }

  async findActiveForEmployee(employeeId: string, asOf: Date = new Date()) {
    return this.model.findOne({
      employeeId,
      isDeleted: false,
      status: 'ACTIVE',
      effectiveFrom: { $lte: asOf },
      $or: [{ effectiveTo: null }, { effectiveTo: { $gte: asOf } }],
    }).sort({ effectiveFrom: -1 }).exec();
  }
}
