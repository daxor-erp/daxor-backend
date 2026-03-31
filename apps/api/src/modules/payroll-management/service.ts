import { PayrollManagementRepository } from './repository';
import { IPayrollManagement } from './model';

export class PayrollManagementService {
  private repository: PayrollManagementRepository;

  constructor() {
    this.repository = new PayrollManagementRepository();
  }

  async create(data: Partial<IPayrollManagement>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IPayrollManagement);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IPayrollManagement>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `PAYROLL_MANAGEMENT-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
