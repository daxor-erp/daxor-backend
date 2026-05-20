import { MongoBaseRepository } from '../base/mongo-repository';
import { Payslip, IPayslip } from './model';

export class PayslipRepository extends MongoBaseRepository<IPayslip> {
  constructor() {
    super(Payslip);
  }

  async findByPayrollRun(payrollRunId: string) {
    return this.findAll({ payrollRunId, isDeleted: false } as any);
  }

  async findByEmployee(employeeId: string) {
    return this.findAll({ employeeId, isDeleted: false } as any);
  }

  async deleteByPayrollRun(payrollRunId: string) {
    return this.model.deleteMany({ payrollRunId }).exec();
  }
}
