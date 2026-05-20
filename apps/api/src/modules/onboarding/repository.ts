import { MongoBaseRepository } from '../base/mongo-repository';
import { Onboarding, IOnboarding } from './model';

export class OnboardingRepository extends MongoBaseRepository<IOnboarding> {
  constructor() { super(Onboarding); }
  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
  async findByEmployee(employeeId: string) {
    return this.findOne({ employeeId, isDeleted: false } as any);
  }
}
