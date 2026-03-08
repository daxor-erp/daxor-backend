/**
 * Vendor DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { VendorRepository } from '../../../modules/vendor/repository';
import type { Vendor } from '../../../modules/vendor/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadVendors(vendorIds: readonly string[]): Promise<(Vendor | Error)[]> {
  const repository = getRepository(VendorRepository);
  
  try {
    const vendors = await repository.findByIds(Array.from(vendorIds));
    const vendorMap = new Map<string, Vendor>();
    vendors.forEach(vendor => vendorMap.set(vendor.id, vendor));
    
    return vendorIds.map(id => {
      const vendor = vendorMap.get(id);
      return vendor || new Error(`Vendor not found: ${id}`);
    });
  } catch (error) {
    return vendorIds.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createVendorLoader() {
  return createDataLoader<string, Vendor>({
    batchLoadFn: batchLoadVendors,
    cacheKeyFn: (vendor) => vendor.id,
    maxBatchSize: 100,
    cache: true,
  });
}
