/**
 * Voucher DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { VoucherRepository } from '../../../modules/voucher/repository';
import type { Voucher } from '../../../modules/voucher/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadVouchers(ids: readonly string[]): Promise<(Voucher | Error)[]> {
  const repository = getRepository(VoucherRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Voucher>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`Voucher not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createVoucherLoader() {
  return createDataLoader<string, Voucher>({
    batchLoadFn: batchLoadVouchers,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
