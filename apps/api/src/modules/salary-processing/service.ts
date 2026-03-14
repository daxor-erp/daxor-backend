import { SalaryProcessingRepository } from './repository';
import { ISalaryProcessing } from './model';

export class SalaryProcessingService {
  private repository: SalaryProcessingRepository;

  constructor() {
    this.repository = new SalaryProcessingRepository();
  }

  async create(data: Partial<ISalaryProcessing>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as ISalaryProcessing);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<ISalaryProcessing>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `SALARY_PROCESSING-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
