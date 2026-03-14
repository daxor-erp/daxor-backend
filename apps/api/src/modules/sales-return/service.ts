import { SalesReturnRepository } from './repository';
import { ISalesReturn } from './model';

export class SalesReturnService {
  private repository: SalesReturnRepository;

  constructor() {
    this.repository = new SalesReturnRepository();
  }

  async create(data: Partial<ISalesReturn>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as ISalesReturn);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<ISalesReturn>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `SALES_RETURN-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
