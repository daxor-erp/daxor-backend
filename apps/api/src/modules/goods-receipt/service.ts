import { GoodsReceiptRepository } from './repository';
import { IGoodsReceipt } from './model';

export class GoodsReceiptService {
  private repository: GoodsReceiptRepository;

  constructor() {
    this.repository = new GoodsReceiptRepository();
  }

  async create(data: Partial<IGoodsReceipt>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IGoodsReceipt);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IGoodsReceipt>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `GOODS_RECEIPT-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
