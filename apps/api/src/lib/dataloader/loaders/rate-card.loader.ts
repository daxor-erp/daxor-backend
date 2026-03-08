/**
 * Rate Card DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { RateCardRepository } from '../../../modules/rate-card/repository';
import type { RateCard } from '../../../modules/rate-card/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadRateCards(ids: readonly string[]): Promise<(RateCard | Error)[]> {
  const repository = getRepository(RateCardRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, RateCard>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`RateCard not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createRateCardLoader() {
  return createDataLoader<string, RateCard>({
    batchLoadFn: batchLoadRateCards,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
