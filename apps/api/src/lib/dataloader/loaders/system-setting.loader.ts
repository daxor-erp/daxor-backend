/**
 * System Setting DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { SystemSettingRepository } from '../../../modules/system-setting/repository';
import type { SystemSetting } from '../../../modules/system-setting/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadSystemSettings(ids: readonly string[]): Promise<(SystemSetting | Error)[]> {
  const repository = getRepository(SystemSettingRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, SystemSetting>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`SystemSetting not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createSystemSettingLoader() {
  return createDataLoader<string, SystemSetting>({
    batchLoadFn: batchLoadSystemSettings,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
