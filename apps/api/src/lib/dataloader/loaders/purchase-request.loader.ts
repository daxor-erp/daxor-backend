/**
 * Purchase Request DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { PurchaseRequestRepository } from '../../../modules/purchase-request';
import type { PurchaseRequest } from '../../../modules/purchase-request';
import { getRepository } from '../RepositoryManager';

async function batchLoadPurchaseRequests(ids: readonly string[]): Promise<(PurchaseRequest | Error)[]> {
  const repository = getRepository(PurchaseRequestRepository);
  
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, PurchaseRequest>();
    items.forEach(item => itemMap.set(item.id, item));
    
    return ids.map(id => {
      const item = itemMap.get(id);
      return item || new Error(`PurchaseRequest not found: ${id}`);
    });
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createPurchaseRequestLoader() {
  return createDataLoader<string, PurchaseRequest>({
    batchLoadFn: batchLoadPurchaseRequests,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
