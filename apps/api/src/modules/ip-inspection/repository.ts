import { MongoBaseRepository } from '../base/mongo-repository';
import { IPInspection, IIPInspection } from './model';

export class IPInspectionRepository extends MongoBaseRepository<IIPInspection> {
  constructor() {
    super(IPInspection);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
