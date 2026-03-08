import { MongoBaseRepository } from '../base/mongo-repository';
import { Item } from './model';

export class ItemRepository extends MongoBaseRepository<any> {
  constructor() {
    super(Item);
  }

  async findByCode(code: string): Promise<any | null> {
    return this.findOne({ code, deletedAt: null });
  }

  async findByCategory(category: string): Promise<any[]> {
    return this.findAllActive({ category });
  }

  async findByOrganization(organizationId: string): Promise<any[]> {
    return this.findAllActive({ organizationId });
  }

  async findLowStock(): Promise<any[]> {
    return this.findAllActive({
      $expr: { $lte: ['$stockQuantity', '$minStockLevel'] }
    });
  }

  async findActive(): Promise<any[]> {
    return this.findAllActive({ status: 'active' });
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    await this.update(id, { $inc: { stockQuantity: quantity } });
  }
}