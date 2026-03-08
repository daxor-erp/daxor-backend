/**
 * Notification DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { NotificationRepository } from '../../../modules/notification/repository';
import type { Notification } from '../../../modules/notification/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadNotifications(ids: readonly string[]): Promise<(Notification | Error)[]> {
  const repository = getRepository(NotificationRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Notification>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`Notification not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createNotificationLoader() {
  return createDataLoader<string, Notification>({
    batchLoadFn: batchLoadNotifications,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
