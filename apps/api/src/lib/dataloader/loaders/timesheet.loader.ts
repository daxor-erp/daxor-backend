/**
 * Timesheet DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { TimesheetRepository } from '../../../modules/timesheet/repository';
import type { Timesheet } from '../../../modules/timesheet/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadTimesheets(ids: readonly string[]): Promise<(Timesheet | Error)[]> {
  const repository = getRepository(TimesheetRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Timesheet>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`Timesheet not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createTimesheetLoader() {
  return createDataLoader<string, Timesheet>({
    batchLoadFn: batchLoadTimesheets,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
