import { MongoBaseRepository } from '../base/mongo-repository';
import { GoodsReceipt, IGoodsReceipt } from './model';

export class GoodsReceiptRepository extends MongoBaseRepository<IGoodsReceipt> {
  constructor() {
    super(GoodsReceipt);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
