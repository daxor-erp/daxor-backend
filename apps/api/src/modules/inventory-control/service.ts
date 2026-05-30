import { InventoryControlRepository, StockMovementRepository } from './repository';
import { IInventoryControl, IStockMovement } from './model';
import { Item } from '../item/model';

export class InventoryControlService {
  private icRepository: InventoryControlRepository;
  private smRepository: StockMovementRepository;

  constructor() {
    this.icRepository = new InventoryControlRepository();
    this.smRepository = new StockMovementRepository();
  }

  async createInventoryControl(data: Partial<IInventoryControl>) {
    const qty = Number(data.quantity ?? 0);
    const reorder = Number(data.reorderPoint ?? 0);
    const stockStatus = this.determineStockStatus(qty, reorder);
    return this.icRepository.create({ ...data, stockStatus } as IInventoryControl);
  }

  async updateInventoryControl(id: string, data: Partial<IInventoryControl>) {
    const existing = await this.icRepository.findById(id);
    if (!existing) throw new Error('Inventory record not found');

    const qty =
      data.quantity !== undefined ? Number(data.quantity) : existing.quantity;
    const reorder =
      data.reorderPoint !== undefined
        ? Number(data.reorderPoint)
        : existing.reorderPoint;

    const patch = { ...data } as Partial<IInventoryControl>;
    if (data.quantity !== undefined || data.reorderPoint !== undefined) {
      patch.stockStatus = this.determineStockStatus(qty, reorder);
    }
    return this.icRepository.update(id, patch);
  }

  async getInventoryControls(organizationId: string, filters: any) {
    let rows: IInventoryControl[];
    if (filters.warehouseId) {
      rows = await this.icRepository.findByWarehouse(
        organizationId,
        filters.warehouseId,
      );
    } else {
      rows = await this.icRepository.findByOrganization(organizationId);
    }
    if (filters.stockStatus) {
      return rows.filter((r) => r.stockStatus === filters.stockStatus);
    }
    return rows;
  }

  async getLowStockItems(organizationId: string) {
    return this.icRepository.findLowStock(organizationId);
  }

  async createStockMovement(data: Partial<IStockMovement>, userId: string) {
    const movement = await this.smRepository.create({ ...data, createdBy: userId } as IStockMovement);
    await this.updateStockQuantity(data.itemId!, data.toLocation!, data.quantity!, data.movementType!);
    return movement;
  }

  async getStockMovements(organizationId: string, itemId?: string) {
    let rows: IStockMovement[]
    if (itemId) {
      rows = await this.smRepository.findByItem(organizationId, itemId)
    } else {
      rows = await this.smRepository.findByOrganization(organizationId)
    }
    const time = (r: IStockMovement) => {
      const d = r.movementDate ?? (r as unknown as { createdAt?: Date }).createdAt
      const t = d != null ? new Date(d as unknown as string | Date).getTime() : 0
      return Number.isFinite(t) ? t : 0
    }
    return [...rows].sort((a, b) => time(b) - time(a))
  }

  async adjustStock(
    itemId: string,
    binLocation: string,
    quantity: number,
    reason: string,
    userId: string,
    organizationId?: string,
  ) {
    const filter: Record<string, unknown> = {
      itemId,
      binLocation,
      isDeleted: false,
    };
    if (organizationId != null && String(organizationId).trim() !== '') {
      filter.organizationId = String(organizationId);
    }
    const inventory = await this.icRepository.findOne(filter as any);
    if (!inventory) throw new Error('Inventory not found');

    const newQuantity = inventory.quantity + quantity;
    const reorder = Number(inventory.reorderPoint ?? 0);
    const stockStatus = this.determineStockStatus(newQuantity, reorder);
    await this.icRepository.update(inventory.id, {
      quantity: newQuantity,
      stockStatus,
      lastStockDate: new Date(),
    } as Partial<IInventoryControl>);

    await this.smRepository.create({
      itemId,
      movementType: 'ADJUSTMENT',
      fromLocation: binLocation,
      toLocation: binLocation,
      quantity,
      unit: inventory.unit,
      referenceModule: 'INVENTORY_CONTROL',
      referenceId: inventory.id,
      notes: reason,
      organizationId: inventory.organizationId,
      createdBy: userId,
    } as IStockMovement);

    return this.icRepository.findById(inventory.id);
  }

  private async updateStockQuantity(itemId: string, location: string, quantity: number, movementType: string) {
    const inventory = await this.icRepository.findOne({ itemId, binLocation: location } as any);
    if (inventory) {
      const adjustment = movementType === 'IN' ? quantity : -quantity;
      await this.icRepository.update(inventory.id, {
        quantity: inventory.quantity + adjustment,
        lastStockDate: new Date(),
      } as Partial<IInventoryControl>);
    }
  }

  private determineStockStatus(quantity: number, reorderPoint: number): string {
    if (quantity < 0) return 'NEGATIVE';
    if (quantity === 0) return 'OUT_OF_STOCK';
    if (quantity <= reorderPoint) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  async getInventoryControlById(id: string) {
    const row = await this.icRepository.findById(id);
    if (!row || (row as any).isDeleted) return null;
    return row;
  }

  async getStockMovementById(id: string) {
    const row = await this.smRepository.findById(id);
    if (!row || (row as any).isDeleted) return null;
    return row;
  }

  /** Find or create bin stock for an item at a location. */
  async ensureInventoryRecord(params: {
    organizationId: string;
    itemId: string;
    itemName: string;
    binLocation: string;
    warehouseId: string;
    unit?: string;
  }): Promise<IInventoryControl> {
    const filter = {
      organizationId: params.organizationId,
      itemId: params.itemId,
      binLocation: params.binLocation,
      isDeleted: false,
    };
    const existing = await this.icRepository.findOne(filter as any);
    if (existing) return existing;

    return this.createInventoryControl({
      organizationId: params.organizationId,
      itemId: params.itemId,
      itemName: params.itemName,
      binLocation: params.binLocation,
      warehouseId: params.warehouseId,
      quantity: 0,
      unit: params.unit || 'EA',
      minStockLevel: 0,
      maxStockLevel: 0,
      reorderPoint: 0,
    } as Partial<IInventoryControl>);
  }

  private async resolveItemId(
    organizationId: string,
    itemId: string | undefined,
    itemDescription: string,
    unit?: string,
  ): Promise<{ itemId: string; itemName: string; unit: string }> {
    if (itemId && String(itemId).trim()) {
      const row = await Item.findById(itemId).exec();
      if (row) {
        return {
          itemId: String(row._id),
          itemName: String(row.name),
          unit: String(row.unit || unit || 'EA'),
        };
      }
    }
    const name = String(itemDescription || 'Item').trim() || 'Item';
    let row = await Item.findOne({ organizationId, name, deletedAt: null }).exec();
    if (!row) {
      row = await Item.create({
        name,
        organizationId,
        unit: unit || 'EA',
        status: 'active',
      });
    }
    return {
      itemId: String(row._id),
      itemName: String(row.name),
      unit: String(row.unit || unit || 'EA'),
    };
  }

  /**
   * Apply receipt/issue lines to inventory (GRN, MRN, stock adjustment).
   */
  async applyReceiptLines(params: {
    organizationId: string;
    userId: string;
    referenceModule: string;
    referenceId: string;
    warehouseId?: string;
    warehouseName?: string;
    lines: Array<{
      itemId?: string;
      itemDescription: string;
      quantity: number;
      unit?: string;
    }>;
    direction: 'in' | 'out';
  }): Promise<void> {
    const binLocation = String(params.warehouseName || params.warehouseId || 'MAIN').trim() || 'MAIN';
    const warehouseId = String(params.warehouseId || 'default');

    for (const line of params.lines) {
      const qty = Math.abs(Number(line.quantity) || 0);
      if (qty < 0.0001) continue;

      const resolved = await this.resolveItemId(
        params.organizationId,
        line.itemId,
        line.itemDescription,
        line.unit,
      );
      await this.ensureInventoryRecord({
        organizationId: params.organizationId,
        itemId: resolved.itemId,
        itemName: resolved.itemName,
        binLocation,
        warehouseId,
        unit: resolved.unit,
      });

      const signed = params.direction === 'in' ? qty : -qty;
      await this.adjustStock(
        resolved.itemId,
        binLocation,
        signed,
        `${params.referenceModule} ${params.referenceId}`,
        params.userId,
        params.organizationId,
      );
    }
  }

  /** Apply confirmed stock adjustment line qty changes. */
  async applyStockAdjustmentLines(adjustment: any, userId: string): Promise<void> {
    const orgId = String(adjustment.organizationId ?? '');
    if (!orgId) return;

    const whId = adjustment.warehouseId ? String(adjustment.warehouseId) : 'default';
    const whName = adjustment.warehouseName ? String(adjustment.warehouseName) : 'MAIN';
    const refId = String(adjustment._id ?? adjustment.id ?? '');
    const adjType = String(adjustment.adjustmentType ?? 'recount');

    for (const line of adjustment.lineItems ?? []) {
      let diff = Number(line.difference ?? 0);
      if (Math.abs(diff) < 0.0001) {
        diff = Number(line.adjustedQty ?? 0) - Number(line.currentQty ?? 0);
      }
      if (Math.abs(diff) < 0.0001) continue;

      let direction: 'in' | 'out' = diff > 0 ? 'in' : 'out';
      if (adjType === 'decrease' || adjType === 'write-off') direction = 'out';
      if (adjType === 'increase') direction = 'in';

      await this.applyReceiptLines({
        organizationId: orgId,
        userId,
        referenceModule: 'stock_adjustment',
        referenceId: refId,
        warehouseId: whId,
        warehouseName: whName,
        lines: [
          {
            itemId: line.itemId ? String(line.itemId) : undefined,
            itemDescription: String(line.itemDescription ?? 'Item'),
            quantity: Math.abs(diff),
            unit: line.unit,
          },
        ],
        direction,
      });
    }
  }

  /** Move qty between warehouse bins on stock transfer confirm. */
  async applyStockTransfer(transfer: any, userId: string): Promise<{ transferValue: number }> {
    const orgId = String(transfer.organizationId ?? '');
    const refId = String(transfer._id ?? transfer.id ?? '');
    const fromBin = String(transfer.fromWarehouseName || transfer.fromWarehouseId || 'MAIN').trim() || 'MAIN';
    const toBin = String(transfer.toWarehouseName || transfer.toWarehouseId || 'MAIN').trim() || 'MAIN';
    const fromWhId = String(transfer.fromWarehouseId || 'default');
    const toWhId = String(transfer.toWarehouseId || 'default');

    let transferValue = 0;

    for (const line of transfer.lineItems ?? []) {
      const qty = Math.abs(Number(line.qty) || 0);
      if (qty < 0.0001) continue;

      const resolved = await this.resolveItemId(
        orgId,
        line.itemId ? String(line.itemId) : undefined,
        String(line.itemDescription ?? 'Item'),
        line.unit,
      );

      let unitCost = 1;
      if (line.itemId) {
        const item = await Item.findById(line.itemId).exec();
        if (item && Number((item as any).rate) > 0) unitCost = Number((item as any).rate);
      }

      transferValue += qty * unitCost;

      await this.ensureInventoryRecord({
        organizationId: orgId,
        itemId: resolved.itemId,
        itemName: resolved.itemName,
        binLocation: fromBin,
        warehouseId: fromWhId,
        unit: resolved.unit,
      });
      await this.ensureInventoryRecord({
        organizationId: orgId,
        itemId: resolved.itemId,
        itemName: resolved.itemName,
        binLocation: toBin,
        warehouseId: toWhId,
        unit: resolved.unit,
      });

      await this.adjustStock(
        resolved.itemId,
        fromBin,
        -qty,
        `Transfer out ${transfer.transferNumber || refId}`,
        userId,
        orgId,
      );
      await this.adjustStock(
        resolved.itemId,
        toBin,
        qty,
        `Transfer in ${transfer.transferNumber || refId}`,
        userId,
        orgId,
      );
    }

    return { transferValue: Math.round(transferValue * 100) / 100 };
  }
}
