import { MongoBaseRepository } from '../base/mongo-repository';
import { Budget, IBudget } from './model';

export class BudgetRepository extends MongoBaseRepository<IBudget> {
  constructor() {
    super(Budget);
  }

  async findByOrganization(organizationId: string, fiscalYear?: string) {
    const filter: any = { organizationId, isDeleted: false };
    if (fiscalYear) filter.fiscalYear = fiscalYear;
    return this.findAll(filter);
  }
}
