import { InventoryControlRepository, StockMovementRepository } from './repository';
import { IInventoryControl, IStockMovement } from './model';

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
}
