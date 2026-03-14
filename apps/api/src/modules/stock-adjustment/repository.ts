import { MongoBaseRepository } from '../base/mongo-repository';
import { StockAdjustment, IStockAdjustment } from './model';

export class StockAdjustmentRepository extends MongoBaseRepository<IStockAdjustment> {
  constructor() {
    super(StockAdjustment);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
