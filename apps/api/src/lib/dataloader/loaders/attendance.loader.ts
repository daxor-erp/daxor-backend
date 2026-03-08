/**
 * Attendance DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { AttendanceRepository } from '../../../modules/attendance/repository';
import type { Attendance } from '../../../modules/attendance/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadAttendances(ids: readonly string[]): Promise<(Attendance | Error)[]> {
  const repository = getRepository(AttendanceRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Attendance>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`Attendance not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createAttendanceLoader() {
  return createDataLoader<string, Attendance>({
    batchLoadFn: batchLoadAttendances,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
