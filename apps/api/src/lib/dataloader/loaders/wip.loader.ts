/**
 * WIP DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { WipRepository } from '../../../modules/wip/repository';
import type { Wip } from '../../../modules/wip/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadWips(ids: readonly string[]): Promise<(Wip | Error)[]> {
  const repository = getRepository(WipRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Wip>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`WIP not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createWipLoader() {
  return createDataLoader<string, Wip>({
    batchLoadFn: batchLoadWips,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
