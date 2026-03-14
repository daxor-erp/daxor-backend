import { MongoBaseRepository } from '../base/mongo-repository';
import { ExciseInvoice, IExciseInvoice } from './model';

export class ExciseInvoiceRepository extends MongoBaseRepository<IExciseInvoice> {
  constructor() {
    super(ExciseInvoice);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
