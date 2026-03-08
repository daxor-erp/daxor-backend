/**
 * Vendor Payment DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { VendorPaymentRepository } from '../../../modules/vendor-payment/repository';
import type { VendorPayment } from '../../../modules/vendor-payment/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadVendorPayments(ids: readonly string[]): Promise<(VendorPayment | Error)[]> {
  const repository = getRepository(VendorPaymentRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, VendorPayment>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`VendorPayment not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createVendorPaymentLoader() {
  return createDataLoader<string, VendorPayment>({
    batchLoadFn: batchLoadVendorPayments,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
