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
    const stockStatus = this.determineStockStatus(data.quantity!, data.reorderPoint!);
    return this.icRepository.create({ ...data, stockStatus } as IInventoryControl);
  }

  async updateInventoryControl(id: string, data: Partial<IInventoryControl>) {
    if (data.quantity !== undefined && data.reorderPoint !== undefined) {
      data.stockStatus = this.determineStockStatus(data.quantity, data.reorderPoint);
    }
    return this.icRepository.update(id, data);
  }

  async getInventoryControls(organizationId: string, filters: any) {
    if (filters.warehouseId) {
      return this.icRepository.findByWarehouse(organizationId, filters.warehouseId);
    }
    return this.icRepository.findByOrganization(organizationId);
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
    if (itemId) {
      return this.smRepository.findByItem(organizationId, itemId);
    }
    return this.smRepository.findByOrganization(organizationId);
  }

  async adjustStock(itemId: string, binLocation: string, quantity: number, reason: string, userId: string) {
    const inventory = await this.icRepository.findOne({ itemId, binLocation } as any);
    if (!inventory) throw new Error('Inventory not found');

    const newQuantity = inventory.quantity + quantity;
    await this.icRepository.update(inventory.id, { quantity: newQuantity } as Partial<IInventoryControl>);

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
    if (quantity === 0) return 'OUT_OF_STOCK';
    if (quantity <= reorderPoint) return 'LOW_STOCK';
    return 'IN_STOCK';
  }
}
