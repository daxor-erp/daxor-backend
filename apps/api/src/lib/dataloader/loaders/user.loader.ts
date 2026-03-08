/**
 * User DataLoader
 * 
 * Batches user queries to prevent N+1 problems
 */

import { createDataLoader } from '../DataLoader';
import { UserRepository } from '../../../modules/user/repository';
import type { User } from '../../../modules/user/model';
import { getRepository } from '../RepositoryManager';

/**
 * Batch load users by IDs
 */
async function batchLoadUsers(userIds: readonly string[]): Promise<(User | Error)[]> {
  const repository = getRepository(UserRepository);
  
  try {
    const users = await repository.findByIds(Array.from(userIds));
    
    // Create a map for quick lookup
    const userMap = new Map<string, User>();
    users.forEach(user => {
      userMap.set(user.id, user);
    });
    
    // Return users in the same order as requested keys
    return userIds.map(id => {
      const user = userMap.get(id);
      if (!user) {
        return new Error(`User not found: ${id}`);
      }
      return user;
    });
  } catch (error) {
    // Return errors for all keys if batch fails
    return userIds.map(() => error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Create user DataLoader instance
 * 
 * Usage:
 * const userLoader = createUserLoader();
 * const user = await userLoader.load(userId);
 * const users = await userLoader.loadMany([userId1, userId2]);
 */
export function createUserLoader() {
  return createDataLoader<string, User>({
    batchLoadFn: batchLoadUsers,
    cacheKeyFn: (user) => user.id,
    maxBatchSize: 100,
    cache: true,
  });
}
