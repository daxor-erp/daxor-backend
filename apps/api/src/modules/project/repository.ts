import { MongoBaseRepository } from '../base/mongo-repository';
import { Project } from './model';

export class ProjectRepository extends MongoBaseRepository<any> {
  constructor() {
    super(Project);
  }

  async findByCode(code: string): Promise<any | null> {
    return this.findOne({ code, deletedAt: null });
  }

  async findByOrganization(organizationId: string): Promise<any[]> {
    return this.findAllActive({ organizationId });
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.findAllActive({ status });
  }

  async findByManager(managerId: string): Promise<any[]> {
    return this.findAllActive({ managerId });
  }

  async findActive(): Promise<any[]> {
    return this.findAllActive({ status: 'active' });
  }
}