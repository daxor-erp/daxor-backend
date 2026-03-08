/**
 * Document DataLoader
 */

import { createDataLoader } from '../DataLoader';
import { DocumentRepository } from '../../../modules/document/repository';
import type { Document } from '../../../modules/document/model';
import { getRepository } from '../RepositoryManager';

async function batchLoadDocuments(ids: readonly string[]): Promise<(Document | Error)[]> {
  const repository = getRepository(DocumentRepository);
  try {
    const items = await repository.findByIds(Array.from(ids));
    const itemMap = new Map<string, Document>();
    items.forEach(item => itemMap.set(item.id, item));
    return ids.map(id => itemMap.get(id) || new Error(`Document not found: ${id}`));
  } catch (error) {
    return ids.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

export function createDocumentLoader() {
  return createDataLoader<string, Document>({
    batchLoadFn: batchLoadDocuments,
    cacheKeyFn: (item) => item.id,
    maxBatchSize: 100,
    cache: true,
  });
}
