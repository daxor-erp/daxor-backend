/**
 * Base Service
 * Provides common service functionality for all modules
 */

import type { PaginationOptions } from '../../types/global';
import { MongoBaseRepository, IBaseEntity } from './mongo-repository';
import { AppError } from '../../lib/errors/AppError';
import { ERROR_CODES } from '../../lib/errors/errorCodes';

export abstract class BaseService<T extends IBaseEntity> {
  protected repository: MongoBaseRepository<T>;

  constructor(repository: MongoBaseRepository<T>) {
    this.repository = repository;
  }

  async findAll(filters: any = {}): Promise<T[]> {
    return this.repository.findAll(filters);
  }

  async findById(id: string): Promise<T> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new AppError('Resource not found', 404, ERROR_CODES.NOT_FOUND);
    }
    return record;
  }

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    const existingRecord = await this.repository.findById(id);
    if (!existingRecord) {
      throw new AppError('Resource not found', 404, ERROR_CODES.NOT_FOUND);
    }

    const updatedRecord = await this.repository.update(id, data);
    if (!updatedRecord) {
      throw new AppError('Failed to update resource', 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }

    return updatedRecord;
  }

  async delete(id: string): Promise<void> {
    const existingRecord = await this.repository.findById(id);
    if (!existingRecord) {
      throw new AppError('Resource not found', 404, ERROR_CODES.NOT_FOUND);
    }

    await this.repository.update(id, { 
      deletedAt: new Date(),
      status: 'deleted'
    });
  }

  async findWithPagination(
    filters: any = {},
    options: PaginationOptions
  ): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    return this.repository.findPaginated(filters, page, limit, sort);
  }

  async exists(filters: any): Promise<boolean> {
    return this.repository.exists(filters);
  }

  async count(filters: any = {}): Promise<number> {
    return this.repository.count(filters);
  }
}