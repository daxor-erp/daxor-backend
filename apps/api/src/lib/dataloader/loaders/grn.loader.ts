/**
 * GRN DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { GRNRepository } from '../../../modules/grn';
import type { GRN } from '../../../modules/grn';
import { getRepository } from '../RepositoryManager';

async function batchLoadGrns(ids: readonly string[]): Promise<(GRN | Error)[]> {
  const repository = getRepository(GRNRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, GRN>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`GRN not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createGrnLoader() {
  return createDataLoader<string, GRN>({
    batchLoadFn: batchLoadGrns,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
