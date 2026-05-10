import { MongoBaseRepository } from '../base/mongo-repository';
import { SiteLocation, ISiteLocation } from './model';

export class SiteLocationRepository extends MongoBaseRepository<ISiteLocation> {
  constructor() {
    super(SiteLocation);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
