import { InternalOrderRepository } from './repository';
import { IInternalOrder } from './model';

export class InternalOrderService {
  private repository: InternalOrderRepository;

  constructor() {
    this.repository = new InternalOrderRepository();
  }

  async create(data: Partial<IInternalOrder>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IInternalOrder);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IInternalOrder>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `INTERNAL_ORDER-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
