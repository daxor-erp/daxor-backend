import { IPInspectionRepository } from './repository';
import { IIPInspection } from './model';

export class IpInspectionService {
  private repository: IPInspectionRepository;

  constructor() {
    this.repository = new IPInspectionRepository();
  }

  async create(data: Partial<IIPInspection>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IIPInspection);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IIPInspection>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `IP_INSPECTION-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
