import { MongoBaseRepository } from '../base/mongo-repository';
import { Organization } from './model';

export class OrganizationRepository extends MongoBaseRepository<any> {
  constructor() {
    super(Organization);
  }

  async findByCode(code: string): Promise<any | null> {
    return this.findOne({ code, deletedAt: null });
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.findOne({ email, deletedAt: null });
  }

  async findActive(): Promise<any[]> {
    return this.findAllActive({ status: 'active' });
  }
}