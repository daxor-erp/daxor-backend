import { MongoBaseRepository } from '../base/mongo-repository';
import { SalesOrder } from './model';

export class SalesOrderRepository extends MongoBaseRepository<any> {
  constructor() {
    super(SalesOrder);
  }

  async findByClientId(clientId: string): Promise<any[]> {
    return this.findAllActive({ clientId });
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.findAllActive({ status });
  }

  async findByProjectId(projectId: string): Promise<any[]> {
    return this.findAllActive({ projectId });
  }
}