/**
 * Sales Order DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { SalesOrderRepository } from '../../../modules/sales-order/repository';
import type { SalesOrder } from '../../../modules/sales-order/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadSalesOrders(ids: readonly string[]): Promise<(SalesOrder | Error)[]> {
  const repository = getRepository(SalesOrderRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, SalesOrder>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`SalesOrder not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createSalesOrderLoader() {
  return createDataLoader<string, SalesOrder>({
    batchLoadFn: batchLoadSalesOrders,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
