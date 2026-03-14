import { DeliveryChallanRepository } from './repository';
import { IDeliveryChallan } from './model';

export class DeliveryChallanService {
  private repository: DeliveryChallanRepository;

  constructor() {
    this.repository = new DeliveryChallanRepository();
  }

  async create(data: Partial<IDeliveryChallan>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IDeliveryChallan);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IDeliveryChallan>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `DELIVERY_CHALLAN-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
