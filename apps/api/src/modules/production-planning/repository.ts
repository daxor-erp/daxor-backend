import { MongoBaseRepository } from '../base/mongo-repository';
import { ProductionPlanning, IProductionPlanning } from './model';

export class ProductionPlanningRepository extends MongoBaseRepository<IProductionPlanning> {
  constructor() {
    super(ProductionPlanning);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
