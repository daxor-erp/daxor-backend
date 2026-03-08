import { MongoBaseRepository } from '../base/mongo-repository';
import { CustomerInvoice } from './model';

export class CustomerInvoiceRepository extends MongoBaseRepository<any> {
  constructor() {
    super(CustomerInvoice);
  }

  async findByClientId(clientId: string): Promise<any[]> {
    return this.findAllActive({ clientId });
  }

  async findByProjectId(projectId: string): Promise<any[]> {
    return this.findAllActive({ projectId });
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.findAllActive({ status });
  }
}