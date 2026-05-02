import { MongoBaseRepository } from '../base/mongo-repository';
import { User } from './model';

export class UserRepository extends MongoBaseRepository<any> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.findOne({ email, deletedAt: null });
  }

  async findByEmailInOrganization(email: string, organizationId: string): Promise<any | null> {
    return this.findOne({ email, organizationId, deletedAt: null });
  }

  async findByRole(role: string): Promise<any[]> {
    return this.findAllActive({ roles: role })
  }

  async findByOrganization(organizationId: string): Promise<any[]> {
    return this.findAllActive({ organizationId });
  }

  async findByUserType(userType: string, organizationId: string): Promise<any[]> {
    return this.findAllActive({ userType, organizationId });
  }

  async findByStatus(status: string, organizationId: string): Promise<any[]> {
    return this.findAllActive({ status, organizationId });
  }

  async findActive(): Promise<any[]> {
    return this.findAllActive({ status: 'active' });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { lastLoginAt: new Date() });
  }
}
