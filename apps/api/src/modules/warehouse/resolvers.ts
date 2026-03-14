import { WarehouseService } from './service';

const service = new WarehouseService();

export const warehouseResolvers = {
  Query: {
    warehouse: async (_: any, { id }: { id: string }) => {
      return service.getWarehouses('');
    },
    warehouses: async (_: any, { organizationId }: any) => {
      return service.getWarehouses(organizationId);
    },
    warehouseBin: async (_: any, { id }: { id: string }) => {
      return service.getWarehouseBins('', id);
    },
    warehouseBins: async (_: any, { organizationId, warehouseId }: any) => {
      return service.getWarehouseBins(organizationId, warehouseId);
    },
  },
  Mutation: {
    createWarehouse: async (_: any, { input }: any) => {
      return service.createWarehouse(input);
    },
    updateWarehouse: async (_: any, { id, input }: any) => {
      return service.updateWarehouse(id, input);
    },
    createWarehouseBin: async (_: any, { input }: any) => {
      return service.createWarehouseBin(input);
    },
    updateWarehouseBin: async (_: any, { id, input }: any) => {
      return service.updateWarehouseBin(id, input);
    },
  },
};
