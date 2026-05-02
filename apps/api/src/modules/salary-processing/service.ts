import { SalaryProcessingRepository } from './repository';
import { ISalaryProcessing } from './model';

export class SalaryProcessingService {
  private repository: SalaryProcessingRepository;

  constructor() {
    this.repository = new SalaryProcessingRepository();
  }

  async create(data: Partial<ISalaryProcessing>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    const payload = this.normalizeInput({ ...data, docNumber, createdBy: userId });
    return this.repository.create(payload as ISalaryProcessing);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    const row = await this.repository.findById(id);
    if (row && (row as ISalaryProcessing).isDeleted) return null;
    return row;
  }

  async update(id: string, data: Partial<ISalaryProcessing>) {
    const payload = this.normalizeInput(data);
    return this.repository.update(id, payload);
  }

  async delete(id: string) {
    await this.repository.update(id, { isDeleted: true } as Partial<ISalaryProcessing>);
  }

  private normalizeInput(
    data: Partial<ISalaryProcessing>,
  ): Partial<ISalaryProcessing> {
    const out: Partial<ISalaryProcessing> = { ...data };
    if (out.title !== undefined) out.title = (out.title as string)?.trim() || undefined;
    if (out.remarks !== undefined) out.remarks = (out.remarks as string)?.trim() || undefined;
    for (const key of ['payPeriodStart', 'payPeriodEnd', 'docDate'] as const) {
      const v = out[key];
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' && v === '') continue;
      if (v instanceof Date) continue;
      if (typeof v === 'string') {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) (out as any)[key] = d;
      }
    }
    return out;
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `SALARY_PROCESSING-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
