import { MongoBaseRepository } from '../base/mongo-repository';
import { Customer, ICustomer } from './model';

export class CustomerRepository extends MongoBaseRepository<ICustomer> {
  constructor() {
    super(Customer);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
