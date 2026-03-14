import { WarehouseRepository, WarehouseBinRepository } from './repository';
import { IWarehouse, IWarehouseBin } from './model';

export class WarehouseService {
  private whRepository: WarehouseRepository;
  private wbRepository: WarehouseBinRepository;

  constructor() {
    this.whRepository = new WarehouseRepository();
    this.wbRepository = new WarehouseBinRepository();
  }

  async createWarehouse(data: Partial<IWarehouse>) {
    return this.whRepository.create(data as IWarehouse);
  }

  async getWarehouses(organizationId: string) {
    return this.whRepository.findByOrganization(organizationId);
  }

  async updateWarehouse(id: string, data: Partial<IWarehouse>) {
    return this.whRepository.update(id, data);
  }

  async createWarehouseBin(data: Partial<IWarehouseBin>) {
    return this.wbRepository.create(data as IWarehouseBin);
  }

  async getWarehouseBins(organizationId: string, warehouseId?: string) {
    if (warehouseId) {
      return this.wbRepository.findByWarehouse(warehouseId);
    }
    return this.wbRepository.findByOrganization(organizationId);
  }

  async updateWarehouseBin(id: string, data: Partial<IWarehouseBin>) {
    return this.wbRepository.update(id, data);
  }
}
