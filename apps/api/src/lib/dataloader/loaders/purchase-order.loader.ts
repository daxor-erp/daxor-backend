/**
 * Purchase Order DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { PurchaseOrderRepository } from '../../../modules/purchase-order';
import type { PurchaseOrder } from '../../../modules/purchase-order';
import { getRepository } from '../RepositoryManager';

async function batchLoadPurchaseOrders(poIds: readonly string[]): Promise<(PurchaseOrder | Error)[]> {
  const repository = getRepository(PurchaseOrderRepository);
  
  try {
    const pos = await repository.findByIds(Array.from(poIds));
    const poMap = new Map<string, PurchaseOrder>();
    pos.forEach(po => poMap.set(po.id, po));
    
    return poIds.map(id => {
      const po = poMap.get(id);
      return po || new Error(`PurchaseOrder not found: ${id}`);
    });
  } catch (error) {
    return poIds.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createPurchaseOrderLoader() {
  return createDataLoader<string, PurchaseOrder>({
    batchLoadFn: batchLoadPurchaseOrders,
    cacheKeyFn: (po) => po.id,
    maxBatchSize: 100,
    cache: true,
  });
}
