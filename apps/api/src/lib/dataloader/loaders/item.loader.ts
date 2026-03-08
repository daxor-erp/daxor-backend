/**
 * Item DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { ItemRepository } from '../../../modules/item/repository';
import type { Item } from '../../../modules/item/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadItems(itemIds: readonly string[]): Promise<(Item | Error)[]> {
  const repository = getRepository(ItemRepository);
  
  try {
    const items = await repository.findByIds(Array.from(itemIds));
    const itemMap = new Map<string, Item>();
    items.forEach(item => itemMap.set(item.id, item));
    
    return itemIds.map(id => {
      const item = itemMap.get(id);
      return item || new Error(`Item not found: ${id}`);
    });
  } catch (error) {
    return itemIds.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createItemLoader() {
  return createDataLoader<string, Item>({
    batchLoadFn: batchLoadItems,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
