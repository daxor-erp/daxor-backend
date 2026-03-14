import { VendorPaymentRepository } from './repository';
import { IVendorPayment } from './model';

export class VendorPaymentService {
  private repository: VendorPaymentRepository;

  constructor() {
    this.repository = new VendorPaymentRepository();
  }

  async create(data: Partial<IVendorPayment>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    return this.repository.create({ ...data, docNumber, createdBy: userId } as IVendorPayment);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IVendorPayment>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `VENDOR_PAYMENT-${organizationId.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
