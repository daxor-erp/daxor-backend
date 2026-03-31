import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { logger } from '../../lib/logger';

export interface IBaseEntity extends Document {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export abstract class MongoBaseRepository<T extends IBaseEntity> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      logger.error(`Error creating document in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Find document by ID
   */
  async findById(id: string | any): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      logger.error(`Error finding document by ID in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Find all documents matching filters
   */
  async findAll(filters: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filters).exec();
    } catch (error) {
      logger.error(`Error finding documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Find all active (non-deleted) documents
   */
  async findAllActive(filters: FilterQuery<T> = {}): Promise<T[]> {
    try {
      const query = { ...filters, deletedAt: null } as FilterQuery<T>;
      return await this.model.find(query).exec();
    } catch (error) {
      logger.error(`Error finding active documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Find one document matching filters
   */
  async findOne(filters: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filters).exec();
    } catch (error) {
      logger.error(`Error finding one document in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Update document by ID
   */
  async update(id: string | any, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      logger.error(`Error updating document in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(filters: FilterQuery<T>, data: UpdateQuery<T>): Promise<any> {
    try {
      return await this.model.updateMany(filters, data).exec();
    } catch (error) {
      logger.error(`Error updating multiple documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Delete document by ID (hard delete)
   */
  async delete(id: string | any): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      logger.error(`Error deleting document in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete document by ID
   */
  async softDelete(id: string | any): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      ).exec();
    } catch (error) {
      logger.error(`Error soft deleting document in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete multiple documents
   */
  async softDeleteMany(filters: FilterQuery<T>): Promise<any> {
    try {
      return await this.model.updateMany(filters, { deletedAt: new Date() }).exec();
    } catch (error) {
      logger.error(`Error soft deleting multiple documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Restore soft-deleted document
   */
  async restore(id: string | any): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { deletedAt: null },
        { new: true }
      ).exec();
    } catch (error) {
      logger.error(`Error restoring document in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Count documents matching filters
   */
  async count(filters: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filters).exec();
    } catch (error) {
      logger.error(`Error counting documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Check if document exists
   */
  async exists(filters: FilterQuery<T>): Promise<boolean> {
    try {
      const doc = await this.model.findOne(filters).exec();
      return doc !== null;
    } catch (error) {
      logger.error(`Error checking document existence in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Find with pagination
   */
  async findPaginated(
    filters: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number; page: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;
      // Exclude soft-deleted records by default
      const query = { ...filters, deletedAt: null } as FilterQuery<T>;
      const data = await this.model
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.model.countDocuments(query).exec();
      const pages = Math.ceil(total / limit);

      return { data, total, page, pages };
    } catch (error) {
      logger.error(`Error finding paginated documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Aggregate documents
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      logger.error(`Error aggregating documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }

  /**
   * Find with pagination (alias accepting options object — used by legacy services)
   */
  async findWithPagination(
    filters: FilterQuery<T> = {},
    options: { page?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}
  ): Promise<{ data: T[]; total: number; page: number; pages: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    return this.findPaginated(filters, page, limit, sort)
  }

  /**
   * Bulk write operations
   */
  async bulkWrite(operations: any[]): Promise<any> {
    try {
      return await this.model.collection.bulkWrite(operations);
    } catch (error) {
      logger.error(`Error bulk writing documents in ${this.model.collection.name}:`, error);
      throw error;
    }
  }
}

