/**
 * Transmittal DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { TransmittalRepository } from '../../../modules/transmittal/repository';
import type { Transmittal } from '../../../modules/transmittal/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadTransmittals(ids: readonly string[]): Promise<(Transmittal | Error)[]> {
  const repository = getRepository(TransmittalRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Transmittal>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`Transmittal not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createTransmittalLoader() {
  return createDataLoader<string, Transmittal>({
    batchLoadFn: batchLoadTransmittals,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
