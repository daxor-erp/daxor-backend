import { PayslipRepository } from './repository';
import { computePayrollRun } from './calculation-engine';
import { exportPayrollRunAsNeftCsv } from './neft-export';

export class PayslipService {
  private repository = new PayslipRepository();

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async getByRun(payrollRunId: string) {
    return this.repository.findByPayrollRun(payrollRunId);
  }

  async getByEmployee(employeeId: string) {
    return this.repository.findByEmployee(employeeId);
  }

  async compute(payrollRunId: string, userId: string) {
    return computePayrollRun(payrollRunId, userId);
  }

  async exportNeft(payrollRunId: string) {
    return exportPayrollRunAsNeftCsv(payrollRunId);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
