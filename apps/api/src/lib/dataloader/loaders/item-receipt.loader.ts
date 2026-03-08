/**
 * Item Receipt DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { ItemReceiptRepository } from '../../../modules/item-receipt/repository';
import type { ItemReceipt } from '../../../modules/item-receipt/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadItemReceipts(ids: readonly string[]): Promise<(ItemReceipt | Error)[]> {
  const repository = getRepository(ItemReceiptRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, ItemReceipt>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`ItemReceipt not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createItemReceiptLoader() {
  return createDataLoader<string, ItemReceipt>({
    batchLoadFn: batchLoadItemReceipts,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
