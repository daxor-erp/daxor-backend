import { ProductionPlanningRepository } from './repository';
import { IProductionPlanning } from './model';

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

  async update(id: string, data: Partial<IProductionPlanning>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `PRODUCTION_PLANNING-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
