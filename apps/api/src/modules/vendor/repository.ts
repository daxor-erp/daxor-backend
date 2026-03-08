import { MongoBaseRepository } from '../base/mongo-repository';
import { Vendor } from './model';

export class VendorRepository extends MongoBaseRepository<any> {
  constructor() {
    super(Vendor);
  }

  async findByCode(code: string): Promise<any | null> {
    return this.findOne({ code, deletedAt: null });
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.findOne({ email, deletedAt: null });
  }

  async findByOrganization(organizationId: string): Promise<any[]> {
    return this.findAllActive({ organizationId });
  }

  async findActive(): Promise<any[]> {
    return this.findAllActive({ status: 'active' });
  }
}