import { MongoBaseRepository } from '../base/mongo-repository';
import { InventoryControl, StockMovement, IInventoryControl, IStockMovement } from './model';

export class InventoryControlRepository extends MongoBaseRepository<IInventoryControl> {
  constructor() {
    super(InventoryControl);
  }

  async findByItem(organizationId: string, itemId: string) {
    return this.findAll({ organizationId, itemId, isDeleted: false } as any);
  }

  async findLowStock(organizationId: string) {
    return this.model.find({
      organizationId,
      isDeleted: false,
      $expr: { $lte: ['$quantity', '$reorderPoint'] }
    });
  }

  async findByWarehouse(organizationId: string, warehouseId: string) {
    return this.findAll({ organizationId, warehouseId, isDeleted: false } as any);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}

export class StockMovementRepository extends MongoBaseRepository<IStockMovement> {
  constructor() {
    super(StockMovement);
  }

  async findByItem(organizationId: string, itemId: string) {
    return this.model.find({ organizationId, itemId, isDeleted: false }).sort({ movementDate: -1 });
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
