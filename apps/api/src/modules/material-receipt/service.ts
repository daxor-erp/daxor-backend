import { MaterialReceiptRepository } from './repository';
import { IMaterialReceipt } from './model';

export class MaterialReceiptService {
  private repository: MaterialReceiptRepository;

  constructor() {
    this.repository = new MaterialReceiptRepository();
  }

  async create(data: Partial<IMaterialReceipt>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IMaterialReceipt);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IMaterialReceipt>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `MATERIAL_RECEIPT-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
