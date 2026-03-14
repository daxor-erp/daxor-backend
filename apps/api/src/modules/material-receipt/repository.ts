import { MongoBaseRepository } from '../base/mongo-repository';
import { MaterialReceipt, IMaterialReceipt } from './model';

export class MaterialReceiptRepository extends MongoBaseRepository<IMaterialReceipt> {
  constructor() {
    super(MaterialReceipt);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
