/**
 * Customer Payment DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { CustomerPaymentRepository } from '../../../modules/customer-payment/repository';
import type { CustomerPayment } from '../../../modules/customer-payment/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadCustomerPayments(ids: readonly string[]): Promise<(CustomerPayment | Error)[]> {
  const repository = getRepository(CustomerPaymentRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, CustomerPayment>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`CustomerPayment not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createCustomerPaymentLoader() {
  return createDataLoader<string, CustomerPayment>({
    batchLoadFn: batchLoadCustomerPayments,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
