import { MongoBaseRepository } from '../base/mongo-repository';
import { CurrencyRevaluation, ICurrencyRevaluation } from './model';

export class CurrencyRevaluationRepository extends MongoBaseRepository<ICurrencyRevaluation> {
  constructor() {
    super(CurrencyRevaluation);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
