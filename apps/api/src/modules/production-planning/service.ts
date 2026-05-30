import { ProductionPlanningRepository } from './repository';
import { IProductionPlanning } from './model';
import { accountingPosting } from '../../lib/accounting-posting';

export class ProductionPlanningService {
  private repository: ProductionPlanningRepository;

  constructor() {
    this.repository = new ProductionPlanningRepository();
  }

  async create(data: Partial<IProductionPlanning>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IProductionPlanning);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IProductionPlanning>, userId = 'system') {
    const before = await this.repository.findById(id);
    const updated = await this.repository.update(id, data);
    const nextStatus = String(data.status ?? (updated as any)?.status ?? '');
    const prevStatus = before ? String((before as any).status ?? '') : '';
    if (nextStatus === 'completed' && prevStatus !== 'completed') {
      const fresh = await this.repository.findById(id);
      await accountingPosting.postProductionCompletion(fresh, userId);
    }
    return updated;
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `PRODUCTION_PLANNING-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
