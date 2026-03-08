/**
 * DataLoader
 * 
 * Generic DataLoader implementation for batching and caching database queries
 * Prevents N+1 query problems by batching multiple requests into a single query
 * 
 * Features:
 * - Automatic batching of requests within a single event loop tick
 * - Request-scoped caching to avoid duplicate queries
 * - Configurable batch size limits
 * - Error handling per key
 */

export interface DataLoaderOptions<K, V> {
  /**
   * Function to batch load multiple keys
   * Should return an array of values or errors in the same order as keys
   */
  batchLoadFn: (keys: readonly K[]) => Promise<(V | Error)[]>;
  
  /**
   * Optional function to extract cache key from value
   * Used for automatic cache priming
   */
  cacheKeyFn?: (value: V) => K;
  
  /**
   * Maximum number of keys to batch in a single request
   * Default: 100
   */
  maxBatchSize?: number;
  
  /**
   * Enable/disable caching
   * Default: true
   */
  cache?: boolean;
  
  /**
   * Cache TTL in milliseconds
   * Default: undefined (cache for request lifetime)
   */
  cacheTTL?: number;
}

export class DataLoader<K, V> {
  private batchLoadFn: (keys: readonly K[]) => Promise<(V | Error)[]>;
  private cacheKeyFn?: (value: V) => K;
  private maxBatchSize: number;
  private cacheEnabled: boolean;
  private cacheTTL?: number;
  
  // Batch queue
  private batch: Array<{
    key: K;
    resolve: (value: V | Error) => void;
    reject: (error: Error) => void;
  }> = [];
  
  // Batch timeout
  private batchTimeout: NodeJS.Timeout | null = null;
  
  // Cache
  private cache: Map<K, { value: Promise<V | Error>; timestamp: number }> = new Map();
  
  constructor(options: DataLoaderOptions<K, V>) {
    this.batchLoadFn = options.batchLoadFn;
    this.cacheKeyFn = options.cacheKeyFn;
    this.maxBatchSize = options.maxBatchSize ?? 100;
    this.cacheEnabled = options.cache !== false;
    this.cacheTTL = options.cacheTTL;
  }

  /**
   * Load a single value by key
   */
  async load(key: K): Promise<V> {
    // Check cache first
    if (this.cacheEnabled) {
      const cached = this.cache.get(key);
      if (cached) {
        // Check TTL if set
        if (!this.cacheTTL || Date.now() - cached.timestamp < this.cacheTTL) {
          const result = await cached.value;
          if (result instanceof Error) {
            throw result;
          }
          return result;
        } else {
          // Expired, remove from cache
          this.cache.delete(key);
        }
      }
    }

    // Create promise for this key
    const promise = new Promise<V | Error>((resolve, reject) => {
      this.batch.push({ key, resolve, reject });
    });

    // Cache the promise
    if (this.cacheEnabled) {
      this.cache.set(key, {
        value: promise,
        timestamp: Date.now()
      });
    }

    // Schedule batch dispatch if not already scheduled
    if (!this.batchTimeout) {
      this.batchTimeout = setImmediate(() => {
        this.dispatchBatch();
      });
    }

    // If batch is full, dispatch immediately
    if (this.batch.length >= this.maxBatchSize) {
      if (this.batchTimeout) {
        clearImmediate(this.batchTimeout);
        this.batchTimeout = null;
      }
      this.dispatchBatch();
    }

    const result = await promise;
    if (result instanceof Error) {
      throw result;
    }
    return result;
  }

  /**
   * Load multiple values by keys
   */
  async loadMany(keys: readonly K[]): Promise<(V | Error)[]> {
    return Promise.all(keys.map(key => this.load(key).catch(error => error)));
  }

  /**
   * Clear a specific key from cache
   */
  clear(key: K): this {
    this.cache.delete(key);
    return this;
  }

  /**
   * Clear all cached values
   */
  clearAll(): this {
    this.cache.clear();
    return this;
  }

  /**
   * Prime the cache with a value
   */
  prime(key: K, value: V): this {
    if (this.cacheEnabled) {
      this.cache.set(key, {
        value: Promise.resolve(value),
        timestamp: Date.now()
      });
    }
    return this;
  }

  /**
   * Check if a key exists in cache
   */
  has(key: K): boolean {
    if (!this.cacheEnabled) {
      return false;
    }
    const cached = this.cache.get(key);
    if (!cached) {
      return false;
    }
    // Check TTL if set
    if (this.cacheTTL && Date.now() - cached.timestamp >= this.cacheTTL) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Get cached value without triggering a load
   * Returns undefined if not cached
   */
  async getCached(key: K): Promise<V | undefined> {
    if (!this.cacheEnabled) {
      return undefined;
    }
    const cached = this.cache.get(key);
    if (!cached) {
      return undefined;
    }
    // Check TTL if set
    if (this.cacheTTL && Date.now() - cached.timestamp >= this.cacheTTL) {
      this.cache.delete(key);
      return undefined;
    }
    const result = await cached.value;
    if (result instanceof Error) {
      return undefined;
    }
    return result;
  }

  /**
   * Get all cached keys
   */
  getCachedKeys(): K[] {
    if (!this.cacheEnabled) {
      return [];
    }
    const now = Date.now();
    const keys: K[] = [];
    for (const [key, cached] of this.cache.entries()) {
      if (!this.cacheTTL || now - cached.timestamp < this.cacheTTL) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    if (!this.cacheEnabled) {
      return 0;
    }
    const now = Date.now();
    let size = 0;
    for (const cached of this.cache.values()) {
      if (!this.cacheTTL || now - cached.timestamp < this.cacheTTL) {
        size++;
      }
    }
    return size;
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): number {
    if (!this.cacheEnabled || !this.cacheTTL) {
      return 0;
    }
    const now = Date.now();
    let cleared = 0;
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp >= this.cacheTTL) {
        this.cache.delete(key);
        cleared++;
      }
    }
    return cleared;
  }

  /**
   * Prime multiple keys at once
   */
  primeMany(entries: Array<{ key: K; value: V }>): this {
    if (this.cacheEnabled) {
      const timestamp = Date.now();
      entries.forEach(({ key, value }) => {
        this.cache.set(key, {
          value: Promise.resolve(value),
          timestamp
        });
      });
    }
    return this;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    enabled: boolean;
    ttl?: number;
    keys: K[];
  } {
    return {
      size: this.getCacheSize(),
      enabled: this.cacheEnabled,
      ttl: this.cacheTTL,
      keys: this.getCachedKeys()
    };
  }

  /**
   * Dispatch the current batch
   */
  private async dispatchBatch(): Promise<void> {
    if (this.batch.length === 0) {
      return;
    }

    // Clear timeout
    if (this.batchTimeout) {
      clearImmediate(this.batchTimeout);
      this.batchTimeout = null;
    }

    // Get current batch
    const batch = this.batch;
    this.batch = [];

    // Extract unique keys
    const keys = Array.from(new Set(batch.map(item => item.key)));

    try {
      // Load batch
      const results = await this.batchLoadFn(keys);
      
      // Create result map
      const resultMap = new Map<K, V | Error>();
      keys.forEach((key, index) => {
        resultMap.set(key, results[index]);
      });

      // Resolve all promises
      batch.forEach(({ key, resolve, reject }) => {
        const result = resultMap.get(key);
        if (result === undefined) {
          reject(new Error(`No result for key: ${key}`));
        } else if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
          
          // Prime cache if cacheKeyFn is provided
          if (this.cacheKeyFn && this.cacheEnabled) {
            const cacheKey = this.cacheKeyFn(result);
            if (cacheKey !== key) {
              this.prime(cacheKey, result);
            }
          }
        }
      });
    } catch (error) {
      // Reject all promises on batch error
      const batchError = error instanceof Error ? error : new Error(String(error));
      batch.forEach(({ reject }) => {
        reject(batchError);
      });
    }
  }
}

/**
 * Create a new DataLoader instance
 */
export function createDataLoader<K, V>(options: DataLoaderOptions<K, V>): DataLoader<K, V> {
  return new DataLoader(options);
}
