import { GraphQLValidationError } from '@repo/errors';
import { InventoryControlService } from '../inventory-control/service';
import { GoodsReceiptRepository } from './repository';
import { IGoodsReceipt, IGoodsReceiptLineItem } from './model';

const inventoryService = new InventoryControlService();

function normalizeStatus(value: unknown): string {
  const s = value != null && String(value).trim() !== '' ? String(value).trim().toUpperCase() : 'DRAFT';
  return s;
}

function mapLineItems(raw: unknown): IGoodsReceiptLineItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((l) => l && String((l as any).itemDescription ?? '').trim() !== '')
    .map((l) => ({
      itemId: (l as any).itemId ? String((l as any).itemId) : undefined,
      itemDescription: String((l as any).itemDescription).trim(),
      orderedQty: Number((l as any).orderedQty) || 0,
      receivedQty: Number((l as any).receivedQty) || 0,
      unit: (l as any).unit ? String((l as any).unit) : undefined,
      unitPrice: Number((l as any).unitPrice) || 0,
    }));
}

export class GoodsReceiptService {
  private repository: GoodsReceiptRepository;

  constructor() {
    this.repository = new GoodsReceiptRepository();
  }

  async create(data: Partial<IGoodsReceipt>, userId: string) {
    const organizationId = data.organizationId != null ? String(data.organizationId).trim() : '';
    if (!organizationId) {
      throw new GraphQLValidationError('organizationId is required');
    }

    const lineItems = mapLineItems(data.lineItems);
    if (lineItems.length === 0) {
      throw new GraphQLValidationError('At least one line item is required');
    }
    if (!lineItems.some((l) => l.receivedQty > 0)) {
      throw new GraphQLValidationError('At least one line must have received quantity greater than zero');
    }

    const rawDate = data.docDate;
    const docDate =
      rawDate != null && String(rawDate).trim() !== ''
        ? new Date(rawDate as string | Date)
        : new Date();
    if (Number.isNaN(docDate.getTime())) {
      throw new GraphQLValidationError('Invalid document date');
    }

    const docNumber = await this.generateDocNumber(organizationId);
    const status = normalizeStatus(data.status);

    const created = await this.repository.create({
      organizationId,
      docDate,
      status: status === 'POSTED' ? 'DRAFT' : status,
      docNumber,
      createdBy: userId,
      purchaseOrderId: data.purchaseOrderId ? String(data.purchaseOrderId) : undefined,
      purchaseOrderNumber: data.purchaseOrderNumber ? String(data.purchaseOrderNumber) : undefined,
      vendorId: data.vendorId ? String(data.vendorId) : undefined,
      vendorName: data.vendorName ? String(data.vendorName).trim() : undefined,
      warehouseId: data.warehouseId ? String(data.warehouseId) : undefined,
      warehouseName: data.warehouseName ? String(data.warehouseName).trim() : undefined,
      lineItems,
      notes: data.notes ? String(data.notes).trim() : undefined,
    } as IGoodsReceipt);

    if (!created) {
      throw new GraphQLValidationError('Failed to create goods receipt');
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
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new GraphQLValidationError('Goods receipt not found');
    }
    const currentStatus = normalizeStatus((existing as any).status);
    if (currentStatus !== 'DRAFT') {
      throw new GraphQLValidationError('Only draft goods receipts can be edited');
    }

    const payload: Partial<IGoodsReceipt> = {};

    if (data.organizationId != null) {
      payload.organizationId = String(data.organizationId).trim();
    }
    if (data.status != null && String(data.status).trim() !== '') {
      const next = normalizeStatus(data.status);
      if (next !== 'DRAFT' && next !== 'CANCELLED') {
        throw new GraphQLValidationError('Use postGoodsReceipt to post a receipt');
      }
      payload.status = next;
    }
    if (data.docDate != null && String(data.docDate).trim() !== '') {
      const d = new Date(data.docDate as string | Date);
      if (Number.isNaN(d.getTime())) {
        throw new GraphQLValidationError('Invalid document date');
      }
      payload.docDate = d;
    }
    if (data.purchaseOrderId !== undefined) {
      payload.purchaseOrderId = data.purchaseOrderId ? String(data.purchaseOrderId) : undefined;
    }
    if (data.purchaseOrderNumber !== undefined) {
      payload.purchaseOrderNumber = data.purchaseOrderNumber ? String(data.purchaseOrderNumber) : undefined;
    }
    if (data.vendorId !== undefined) {
      payload.vendorId = data.vendorId ? String(data.vendorId) : undefined;
    }
    if (data.vendorName !== undefined) {
      payload.vendorName = data.vendorName ? String(data.vendorName).trim() : undefined;
    }
    if (data.warehouseId !== undefined) {
      payload.warehouseId = data.warehouseId ? String(data.warehouseId) : undefined;
    }
    if (data.warehouseName !== undefined) {
      payload.warehouseName = data.warehouseName ? String(data.warehouseName).trim() : undefined;
    }
    if (data.notes !== undefined) {
      payload.notes = data.notes ? String(data.notes).trim() : undefined;
    }
    if (data.lineItems !== undefined) {
      const lineItems = mapLineItems(data.lineItems);
      if (lineItems.length === 0) {
        throw new GraphQLValidationError('At least one line item is required');
      }
      if (!lineItems.some((l) => l.receivedQty > 0)) {
        throw new GraphQLValidationError('At least one line must have received quantity greater than zero');
      }
      payload.lineItems = lineItems;
    }

    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new GraphQLValidationError('Goods receipt not found');
    }
    return updated;
  }

  async post(id: string, userId: string) {
    const row = await this.repository.findById(id);
    if (!row) {
      throw new GraphQLValidationError('Goods receipt not found');
    }
    const plain = (row as any).toObject?.() ?? row;
    const status = normalizeStatus(plain.status);
    if (status === 'POSTED') {
      throw new GraphQLValidationError('Goods receipt is already posted');
    }
    if (status === 'CANCELLED') {
      throw new GraphQLValidationError('Cancelled goods receipts cannot be posted');
    }

    const lineItems: IGoodsReceiptLineItem[] = plain.lineItems ?? [];
    if (!lineItems.some((l) => Number(l.receivedQty) > 0)) {
      throw new GraphQLValidationError('No received quantities to post');
    }

    const updated = await this.repository.update(id, { status: 'POSTED' } as Partial<IGoodsReceipt>);
    if (!updated) {
      throw new GraphQLValidationError('Goods receipt not found');
    }

    const orgId = String(plain.organizationId ?? '');
    await inventoryService.applyReceiptLines({
      organizationId: orgId,
      userId,
      referenceModule: 'goods_receipt',
      referenceId: String(plain._id ?? plain.id ?? id),
      warehouseId: plain.warehouseId ? String(plain.warehouseId) : undefined,
      warehouseName: plain.warehouseName,
      lines: lineItems.map((l) => ({
        itemId: l.itemId ? String(l.itemId) : undefined,
        itemDescription: l.itemDescription,
        quantity: Number(l.receivedQty) || 0,
        unit: l.unit,
      })),
      direction: 'in',
    });

    return updated;
  }

  async delete(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new GraphQLValidationError('Goods receipt not found');
    }
    const status = normalizeStatus((existing as any).status);
    if (status === 'POSTED') {
      throw new GraphQLValidationError('Posted goods receipts cannot be deleted');
    }
    const updated = await this.repository.update(id, { isDeleted: true } as Partial<IGoodsReceipt>);
    if (!updated) {
      throw new GraphQLValidationError('Goods receipt not found');
    }
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `GR-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
