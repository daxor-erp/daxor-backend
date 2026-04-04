import { MongoBaseRepository } from '../base/mongo-repository'
import { Customer } from './model'

export class CustomerRepository extends MongoBaseRepository<any> {
  constructor() {
    super(Customer)
  }

  async findByOrganization(organizationId: string): Promise<any[]> {
    return this.findAllActive({ organizationId })
  }
}
