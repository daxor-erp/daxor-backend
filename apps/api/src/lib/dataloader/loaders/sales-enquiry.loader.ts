/**
 * Sales Enquiry DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { SalesEnquiryRepository } from '../../../modules/sales-enquiry/repository';
import type { SalesEnquiry } from '../../../modules/sales-enquiry/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadSalesEnquiries(ids: readonly string[]): Promise<(SalesEnquiry | Error)[]> {
  const repository = getRepository(SalesEnquiryRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, SalesEnquiry>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`SalesEnquiry not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createSalesEnquiryLoader() {
  return createDataLoader<string, SalesEnquiry>({
    batchLoadFn: batchLoadSalesEnquiries,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
