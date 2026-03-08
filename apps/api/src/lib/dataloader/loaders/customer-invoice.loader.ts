/**
 * Customer Invoice DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { CustomerInvoiceRepository } from '../../../modules/customer-invoice/repository';
import type { CustomerInvoice } from '../../../modules/customer-invoice/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadCustomerInvoices(ids: readonly string[]): Promise<(CustomerInvoice | Error)[]> {
  const repository = getRepository(CustomerInvoiceRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, CustomerInvoice>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`CustomerInvoice not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createCustomerInvoiceLoader() {
  return createDataLoader<string, CustomerInvoice>({
    batchLoadFn: batchLoadCustomerInvoices,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
