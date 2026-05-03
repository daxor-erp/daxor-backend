import { MongoBaseRepository } from '../base/mongo-repository';
import { Warehouse, WarehouseBin, IWarehouse, IWarehouseBin } from './model';

export class WarehouseRepository extends MongoBaseRepository<IWarehouse> {
  constructor() {
    super(Warehouse);
  }

  async findByOrganization(organizationId: string, isActive?: boolean) {
    const q: Record<string, unknown> = { organizationId, isDeleted: false };
    if (isActive !== undefined && isActive !== null) {
      q.isActive = isActive;
    }
    return this.findAll(q as any);
  }
}

export class WarehouseBinRepository extends MongoBaseRepository<IWarehouseBin> {
  constructor() {
    super(WarehouseBin);
  }

  async findByWarehouse(warehouseId: string) {
    return this.findAll({ warehouseId, isDeleted: false } as any);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
