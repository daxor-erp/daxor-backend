/**
 * Sales Quotation DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { SalesQuotationRepository } from '../../../modules/sales-quotation/repository';
import type { SalesQuotation } from '../../../modules/sales-quotation/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadSalesQuotations(ids: readonly string[]): Promise<(SalesQuotation | Error)[]> {
  const repository = getRepository(SalesQuotationRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, SalesQuotation>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`SalesQuotation not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createSalesQuotationLoader() {
  return createDataLoader<string, SalesQuotation>({
    batchLoadFn: batchLoadSalesQuotations,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
