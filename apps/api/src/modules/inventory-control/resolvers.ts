import { InventoryControlService } from './service';

const service = new InventoryControlService();

export const inventoryControlResolvers = {
  Query: {
    inventoryControl: async (_: any, { id }: { id: string }) => {
      return service.getInventoryControls('', {});
    },
    inventoryControls: async (_: any, { organizationId, warehouseId, stockStatus }: any) => {
      return service.getInventoryControls(organizationId, { warehouseId, stockStatus });
    },
    stockMovement: async (_: any, { id }: { id: string }) => {
      return service.getStockMovements('', id);
    },
    stockMovements: async (_: any, { organizationId, itemId }: any) => {
      return service.getStockMovements(organizationId, itemId);
    },
    lowStockItems: async (_: any, { organizationId }: any) => {
      return service.getLowStockItems(organizationId);
    },
  },
  Mutation: {
    createInventoryControl: async (_: any, { input }: any) => {
      return service.createInventoryControl(input);
    },
    updateInventoryControl: async (_: any, { id, input }: any) => {
      return service.updateInventoryControl(id, input);
    },
    createStockMovement: async (_: any, { input }: any, context: any) => {
      return service.createStockMovement(input, context.user?.id || 'system');
    },
    adjustStock: async (_: any, { itemId, binLocation, quantity, reason }: any, context: any) => {
      return service.adjustStock(itemId, binLocation, quantity, reason, context.user?.id || 'system');
    },
  },
};
