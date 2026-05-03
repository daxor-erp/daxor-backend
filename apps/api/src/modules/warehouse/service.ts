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
    const orgId = data.organizationId;
    if (!orgId) throw new Error('organizationId is required');

    const trimmed =
      typeof data.warehouseCode === 'string' ? data.warehouseCode.trim() : '';
    let warehouseCode =
      trimmed.length > 0 ? trimmed : await this.generateNextWarehouseCode(orgId);

    const payload = {
      ...data,
      warehouseCode,
      isActive: data.isActive !== undefined ? data.isActive : true,
      currentUtilization:
        data.currentUtilization !== undefined ? data.currentUtilization : 0,
    };
    return this.whRepository.create(payload as IWarehouse);
  }

  /** Next WH#### code per organization (skips numbers already in use). */
  private async generateNextWarehouseCode(organizationId: string): Promise<string> {
    const existing = await this.whRepository.findByOrganization(organizationId);
    const codes = new Set(
      existing
        .map((w) => String(w.warehouseCode ?? '').trim().toUpperCase())
        .filter(Boolean),
    );
    const prefix = 'WH';
    const re = /^WH(\d+)$/i;
    let max = 0;
    for (const w of existing) {
      const m = re.exec(String(w.warehouseCode ?? '').trim());
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
    let n = max + 1;
    let candidate = `${prefix}${String(n).padStart(4, '0')}`;
    while (codes.has(candidate.toUpperCase())) {
      n += 1;
      candidate = `${prefix}${String(n).padStart(4, '0')}`;
    }
    return candidate;
  }

  async getWarehouseById(id: string) {
    return this.whRepository.findById(id);
  }

  async getWarehouses(organizationId: string, isActive?: boolean) {
    return this.whRepository.findByOrganization(organizationId, isActive);
  }

  async updateWarehouse(id: string, data: Partial<IWarehouse>) {
    const existing = await this.whRepository.findById(id);
    if (!existing) throw new Error('Warehouse not found');
    const { warehouseCode: _ignored, ...rest } = data as Partial<IWarehouse>;
    return this.whRepository.update(id, {
      ...rest,
      warehouseCode: existing.warehouseCode,
    } as Partial<IWarehouse>);
  }

  async getWarehouseBinById(id: string) {
    return this.wbRepository.findById(id);
  }

  async createWarehouseBin(data: Partial<IWarehouseBin>) {
    const payload = {
      ...data,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      currentStock:
        data.currentStock !== undefined ? data.currentStock : 0,
    };
    return this.wbRepository.create(payload as IWarehouseBin);
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
