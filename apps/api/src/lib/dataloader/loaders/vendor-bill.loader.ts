/**
 * Vendor Bill DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { VendorBillRepository } from '../../../modules/vendor-bill/repository';
import type { VendorBill } from '../../../modules/vendor-bill/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadVendorBills(ids: readonly string[]): Promise<(VendorBill | Error)[]> {
  const repository = getRepository(VendorBillRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, VendorBill>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`VendorBill not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createVendorBillLoader() {
  return createDataLoader<string, VendorBill>({
    batchLoadFn: batchLoadVendorBills,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
