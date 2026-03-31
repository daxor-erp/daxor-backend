import { InventoryReturnRepository } from './repository';
import { IInventoryReturn } from './model';

export class InventoryReturnService {
  private repository: InventoryReturnRepository;

  constructor() {
    this.repository = new InventoryReturnRepository();
  }

  async create(data: Partial<IInventoryReturn>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IInventoryReturn);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IInventoryReturn>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `INVENTORY_RETURN-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
