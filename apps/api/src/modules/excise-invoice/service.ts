import { ExciseInvoiceRepository } from './repository';
import { IExciseInvoice } from './model';

export class ExciseInvoiceService {
  private repository: ExciseInvoiceRepository;

  constructor() {
    this.repository = new ExciseInvoiceRepository();
  }

  async create(data: Partial<IExciseInvoice>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IExciseInvoice);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IExciseInvoice>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `EXCISE_INVOICE-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
