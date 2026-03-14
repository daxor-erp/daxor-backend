import { StockAdjustmentRepository } from './repository';
import { IStockAdjustment } from './model';

export class StockAdjustmentService {
  private repository: StockAdjustmentRepository;

  constructor() {
    this.repository = new StockAdjustmentRepository();
  }

  async create(data: Partial<IStockAdjustment>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IStockAdjustment);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IStockAdjustment>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `STOCK_ADJUSTMENT-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
