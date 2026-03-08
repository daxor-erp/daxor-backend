/**
 * Repository Manager
 * 
 * Singleton manager for repository instances
 * Ensures one instance per repository type for efficient memory usage
 * and consistent state across the application
 */

import db from '../../config/database';

// Repository cache
const repositoryCache = new Map<string, any>();

/**
 * Get or create a repository instance (singleton pattern)
 */
export function getRepository<T>(
  RepositoryClass: new (...args: any[]) => T,
  ...args: any[]
): T {
  const cacheKey = RepositoryClass.name;
  
  if (!repositoryCache.has(cacheKey)) {
    repositoryCache.set(cacheKey, new RepositoryClass(...args));
  }
  
  return repositoryCache.get(cacheKey);
}

/**
 * Clear repository cache (useful for testing)
 */
export function clearRepositoryCache(): void {
  repositoryCache.clear();
}

/**
 * Get database instance
 */
export function getDatabase() {
  return db;
}
