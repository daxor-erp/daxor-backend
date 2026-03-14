import { MongoBaseRepository } from '../base/mongo-repository';
import { StockTransfer, IStockTransfer } from './model';

export class StockTransferRepository extends MongoBaseRepository<IStockTransfer> {
  constructor() {
    super(StockTransfer);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
