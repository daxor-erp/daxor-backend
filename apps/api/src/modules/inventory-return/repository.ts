import { MongoBaseRepository } from '../base/mongo-repository';
import { InventoryReturn, IInventoryReturn } from './model';

export class InventoryReturnRepository extends MongoBaseRepository<IInventoryReturn> {
  constructor() {
    super(InventoryReturn);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
