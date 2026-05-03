import { GoodsReceiptRepository } from './repository';
import { IGoodsReceipt } from './model';

export class GoodsReceiptService {
  private repository: GoodsReceiptRepository;

  constructor() {
    this.repository = new GoodsReceiptRepository();
  }

  async create(data: Partial<IGoodsReceipt>, userId: string) {
    const organizationId = data.organizationId != null ? String(data.organizationId).trim() : '';
    if (!organizationId) {
      throw new Error('organizationId is required');
    }
    const docNumber = await this.generateDocNumber(organizationId);
    const rawDate = data.docDate;
    const docDate =
      rawDate != null && String(rawDate).trim() !== ''
        ? new Date(rawDate as string | Date)
        : new Date();
    if (Number.isNaN(docDate.getTime())) {
      throw new Error('Invalid document date');
    }
    const status =
      data.status != null && String(data.status).trim() !== '' ? String(data.status).trim() : 'DRAFT';
    const created = await this.repository.create({
      organizationId,
      docDate,
      status,
      docNumber,
      createdBy: userId,
    } as IGoodsReceipt);
    if (!created) {
      throw new Error('Failed to create goods receipt');
    }
    return created;
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IGoodsReceipt>) {
    const payload: Partial<IGoodsReceipt> = {};
    if (data.organizationId != null) {
      payload.organizationId = String(data.organizationId).trim();
    }
    if (data.status != null && String(data.status).trim() !== '') {
      payload.status = String(data.status).trim();
    }
    if (data.docDate != null && String(data.docDate).trim() !== '') {
      const d = new Date(data.docDate as string | Date);
      if (Number.isNaN(d.getTime())) {
        throw new Error('Invalid document date');
      }
      payload.docDate = d;
    }
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new Error('Goods receipt not found');
    }
    return updated;
  }

  async delete(id: string) {
    const updated = await this.repository.update(id, { isDeleted: true } as Partial<IGoodsReceipt>);
    if (!updated) {
      throw new Error('Goods receipt not found');
    }
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `GOODS_RECEIPT-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
