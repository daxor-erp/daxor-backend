/**
 * Delivery Order DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { DeliveryOrderRepository } from '../../../modules/delivery-order';
import type { DeliveryOrder } from '../../../modules/delivery-order';
import { getRepository } from '../RepositoryManager';

async function batchLoadDeliveryOrders(ids: readonly string[]): Promise<(DeliveryOrder | Error)[]> {
  const repository = getRepository(DeliveryOrderRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, DeliveryOrder>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`DeliveryOrder not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createDeliveryOrderLoader() {
  return createDataLoader<string, DeliveryOrder>({
    batchLoadFn: batchLoadDeliveryOrders,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
