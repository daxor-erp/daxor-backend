import { WorkOrderRepository } from './repository';
import { IWorkOrder } from './model';

export class WorkOrderService {
  private repository: WorkOrderRepository;

  constructor() {
    this.repository = new WorkOrderRepository();
  }

  async create(data: Partial<IWorkOrder>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IWorkOrder);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IWorkOrder>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `WO-${String(count + 1).padStart(4, '0')}`;
  }
}
