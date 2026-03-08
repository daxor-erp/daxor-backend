/**
 * Project Schedule DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { ProjectScheduleRepository } from '../../../modules/project-schedule/repository';
import type { ProjectSchedule } from '../../../modules/project-schedule/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadProjectSchedules(ids: readonly string[]): Promise<(ProjectSchedule | Error)[]> {
  const repository = getRepository(ProjectScheduleRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, ProjectSchedule>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`ProjectSchedule not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createProjectScheduleLoader() {
  return createDataLoader<string, ProjectSchedule>({
    batchLoadFn: batchLoadProjectSchedules,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
