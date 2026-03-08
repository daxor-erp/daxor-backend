/**
 * Base Repository
 * Provides common repository functionality for all modules
 */

import { Knex } from 'knex';
import type { BaseModel, PaginationOptions, PaginatedResult } from '../../types/global';

export abstract class BaseRepository<T extends BaseModel> {
  protected db: Knex;
  protected tableName: string;

  constructor(tableName: string, db: Knex) {
    this.tableName = tableName;
    this.db = db;
  }

  //Camel case mapper inside base repository

  private toCamelCase(obj: any): any {
  if (!obj) return obj;

  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = obj[key];
    return acc;
  }, {});
}

protected mapRow(row: any): T {
  return this.toCamelCase(row) as T;
}

protected mapRows(rows: any[]): T[] {
  return rows.map(row => this.mapRow(row));
}


  async findAll(filters: Partial<T> = {}): Promise<T[]> {
    return this.db(this.tableName)
      .where(filters)
      .whereNull('deleted_at')
      .select('*')
      .then(rows => this.mapRows(rows));
  }

  async findById(id: string | number): Promise<T | undefined> {
    return this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .first()
      .then(row => row ? this.mapRow(row) : undefined);
  }

  /**
   * Find multiple records by IDs (for DataLoader batching)
   */
  async findByIds(ids: (string | number)[]): Promise<T[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.db(this.tableName)
      .whereIn('id', ids)
      .whereNull('deleted_at')
      .select('*')
      .then(rows => this.mapRows(rows));
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const [record] = await this.db(this.tableName)
      .insert({
        ...data,
        created_at: this.db.fn.now(),
        updated_at: this.db.fn.now()
      })
      .returning('*');
    return this.mapRow(record);
  }

  async update(id: string | number, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | undefined> {
    const [record] = await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update({
        ...data,
        updated_at: this.db.fn.now()
      })
      .returning('*');
    return record ? this.mapRow(record) : undefined;
  }

  async delete(id: string | number): Promise<void> {
    await this.db(this.tableName)
      .where({ id })
      .update({ deleted_at: this.db.fn.now() });
  }

  async hardDelete(id: string | number): Promise<void> {
    await this.db(this.tableName)
      .where({ id })
      .del();
  }

  async findWithPagination(
  filters: Partial<T> = {},
  options: PaginationOptions
): Promise<PaginatedResult<T>> {
  const { page, limit, sortBy = 'created_at', sortOrder = 'desc' } = options;
  const offset = (page - 1) * limit;

  const query = this.db(this.tableName)
    .where(filters)
    .whereNull('deleted_at');

  const [{ count }] = await query.clone().count('* as count');
  const total = parseInt(count as string, 10);
  const totalPages = Math.ceil(total / limit);

  const rawData = await query
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(offset)
    .select('*');

  // ✅ APPLY CAMEL CASE MAPPING HERE
  const data = this.mapRows(rawData);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

  async exists(id: string | number): Promise<boolean> {
    const record = await this.db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .first();
    return !!record;
  }

  async count(filters: Partial<T> = {}): Promise<number> {
    const [{ count }] = await this.db(this.tableName)
      .where(filters)
      .whereNull('deleted_at')
      .count('* as count');
    return parseInt(count as string, 10);
  }
}