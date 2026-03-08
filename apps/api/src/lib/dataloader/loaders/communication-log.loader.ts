/**
 * Communication Log DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { CommunicationLogRepository } from '../../../modules/communication-log/repository';
import type { CommunicationLog } from '../../../modules/communication-log/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadCommunicationLogs(ids: readonly string[]): Promise<(CommunicationLog | Error)[]> {
  const repository = getRepository(CommunicationLogRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, CommunicationLog>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`CommunicationLog not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createCommunicationLogLoader() {
  return createDataLoader<string, CommunicationLog>({
    batchLoadFn: batchLoadCommunicationLogs,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
