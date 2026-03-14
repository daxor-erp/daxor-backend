import { GRNRepository } from './repository';
import { IGRN } from './model';

export class GRNService {
  private repository: GRNRepository;

  constructor() {
    this.repository = new GRNRepository();
  }

  async create(data: Partial<IGRN>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IGRN);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IGRN>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `GRN-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
