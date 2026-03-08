/**
 * Client Purchase Order DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { ClientPurchaseOrderRepository } from '../../../modules/client-purchase-order/repository';
import type { ClientPurchaseOrder } from '../../../modules/client-purchase-order/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadClientPurchaseOrders(ids: readonly string[]): Promise<(ClientPurchaseOrder | Error)[]> {
  const repository = getRepository(ClientPurchaseOrderRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, ClientPurchaseOrder>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`ClientPurchaseOrder not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createClientPurchaseOrderLoader() {
  return createDataLoader<string, ClientPurchaseOrder>({
    batchLoadFn: batchLoadClientPurchaseOrders,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
