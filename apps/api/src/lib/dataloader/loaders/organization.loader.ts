/**
 * Organization DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { OrganizationRepository } from '../../../modules/organization/repository';
import type { Organization } from '../../../modules/organization/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadOrganizations(orgIds: readonly string[]): Promise<(Organization | Error)[]> {
  const repository = getRepository(OrganizationRepository);
  
  try {
    const orgs = await repository.findByIds(Array.from(orgIds));
    const orgMap = new Map<string, Organization>();
    orgs.forEach(org => orgMap.set(org.id, org));
    
    return orgIds.map(id => {
      const org = orgMap.get(id);
      return org || new Error(`Organization not found: ${id}`);
    });
  } catch (error) {
    return orgIds.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createOrganizationLoader() {
  return createDataLoader<string, Organization>({
    batchLoadFn: batchLoadOrganizations,
    cacheKeyFn: (org) => org.id,
    maxBatchSize: 100,
    cache: true,
  });
}
