/**
 * Project Task DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { ProjectTaskRepository } from '../../../modules/project-task/repository';
import type { ProjectTask } from '../../../modules/project-task/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadProjectTasks(ids: readonly string[]): Promise<(ProjectTask | Error)[]> {
  const repository = getRepository(ProjectTaskRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, ProjectTask>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`ProjectTask not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createProjectTaskLoader() {
  return createDataLoader<string, ProjectTask>({
    batchLoadFn: batchLoadProjectTasks,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
