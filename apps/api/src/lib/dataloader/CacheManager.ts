/**
 * Cache Manager
 * 
 * Provides centralized cache management for DataLoaders
 * Supports multiple cache strategies: in-memory, TTL-based, LRU
 */

export interface CacheOptions {
  defaultTTL?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size (for LRU)
  strategy?: 'ttl' | 'lru' | 'fifo';
}

export class CacheManager {
  private cache: Map<string, { value: any; timestamp: number; accessCount: number }> = new Map();
  private options: Required<CacheOptions>;
  private accessOrder: string[] = []; // For LRU/FIFO

  constructor(options: CacheOptions = {}) {
    this.options = {
      defaultTTL: options.defaultTTL ?? Infinity,
      maxSize: options.maxSize ?? 1000,
      strategy: options.strategy ?? 'ttl'
    };
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    if (!cached) {
      return undefined;
    }

    // Check TTL
    if (this.options.defaultTTL !== Infinity) {
      const age = Date.now() - cached.timestamp;
      if (age >= this.options.defaultTTL) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
        return undefined;
      }
    }

    // Update access count and order for LRU
    if (this.options.strategy === 'lru') {
      cached.accessCount++;
      this.updateAccessOrder(key);
    }

    return cached.value as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const effectiveTTL = ttl ?? this.options.defaultTTL;
    
    // Check if we need to evict (for LRU/FIFO)
    if (this.options.strategy !== 'ttl' && this.cache.size >= this.options.maxSize) {
      if (!this.cache.has(key)) {
        this.evict();
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0
    });

    this.updateAccessOrder(key);
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) {
      return false;
    }

    // Check TTL
    if (this.options.defaultTTL !== Infinity) {
      const age = Date.now() - cached.timestamp;
      if (age >= this.options.defaultTTL) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
        return false;
      }
    }

    return true;
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Get cache size
   */
  size(): number {
    this.cleanExpired();
    return this.cache.size;
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    this.cleanExpired();
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    strategy: string;
    ttl: number;
    hitRate?: number;
  } {
    this.cleanExpired();
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      strategy: this.options.strategy,
      ttl: this.options.defaultTTL
    };
  }

  /**
   * Clear expired entries
   */
  cleanExpired(): number {
    if (this.options.defaultTTL === Infinity) {
      return 0;
    }

    const now = Date.now();
    let cleaned = 0;
    const keysToDelete: string[] = [];

    for (const [key, cached] of this.cache.entries()) {
      const age = now - cached.timestamp;
      if (age >= this.options.defaultTTL) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      cleaned++;
    });

    return cleaned;
  }

  /**
   * Evict least recently used or first in first out
   */
  private evict(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    let keyToEvict: string;
    if (this.options.strategy === 'lru') {
      // Remove least recently used (first in access order)
      keyToEvict = this.accessOrder[0];
    } else {
      // FIFO - remove first added
      keyToEvict = this.accessOrder[0];
    }

    this.cache.delete(keyToEvict);
    this.removeFromAccessOrder(keyToEvict);
  }

  /**
   * Update access order for LRU
   */
  private updateAccessOrder(key: string): void {
    if (this.options.strategy === 'lru' || this.options.strategy === 'fifo') {
      this.removeFromAccessOrder(key);
      this.accessOrder.push(key);
    }
  }

  /**
   * Remove key from access order
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }
}

/**
 * Create a new CacheManager instance
 */
export function createCacheManager(options?: CacheOptions): CacheManager {
  return new CacheManager(options);
}
