/**
 * Audit Log DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { AuditLogRepository } from '../../../modules/audit-log/repository';
import type { AuditLog } from '../../../modules/audit-log/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadAuditLogs(ids: readonly string[]): Promise<(AuditLog | Error)[]> {
  const repository = getRepository(AuditLogRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, AuditLog>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`AuditLog not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createAuditLogLoader() {
  return createDataLoader<string, AuditLog>({
    batchLoadFn: batchLoadAuditLogs,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
