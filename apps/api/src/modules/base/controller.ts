/**
 * Base Controller
 * Provides common controller functionality for all modules
 */

import { Request, Response, NextFunction } from 'express';
import type { ApiResponse, PaginationOptions } from '../../types/global';
import { BaseService } from './service';
import { logger } from '../../lib/logger';

export abstract class BaseController<T> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
      const data = await this.service.findAll(filters);
      
      const response: ApiResponse<T[]> = {
        success: true,
        message: 'Records retrieved successfully',
        data,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);
      
      const response: ApiResponse<T> = {
        success: true,
        message: 'Record retrieved successfully',
        data,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.create(req.body);
      
      const response: ApiResponse<T> = {
        success: true,
        message: 'Record created successfully',
        data,
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      
      const response: ApiResponse<T> = {
        success: true,
        message: 'Record updated successfully',
        data,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      
      const response: ApiResponse = {
        success: true,
        message: 'Record deleted successfully',
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  findWithPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
      const options: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };
      
      const result = await this.service.findWithPagination(filters, options);
      
      // Ensure _id is included in the response
      const serializedData = result.data.map((item: any) => {
        const obj = item.toObject ? item.toObject() : item;
        return obj;
      });
      
      const response: ApiResponse = {
        success: true,
        message: 'Records retrieved successfully',
        data: { ...result, data: serializedData },
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}