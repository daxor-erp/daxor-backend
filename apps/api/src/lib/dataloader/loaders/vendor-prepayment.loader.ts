/**
 * Vendor Prepayment DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { VendorPrepaymentRepository } from '../../../modules/vendor-prepayment/repository';
import type { VendorPrepayment } from '../../../modules/vendor-prepayment/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadVendorPrepayments(ids: readonly string[]): Promise<(VendorPrepayment | Error)[]> {
  const repository = getRepository(VendorPrepaymentRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, VendorPrepayment>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`VendorPrepayment not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createVendorPrepaymentLoader() {
  return createDataLoader<string, VendorPrepayment>({
    batchLoadFn: batchLoadVendorPrepayments,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
