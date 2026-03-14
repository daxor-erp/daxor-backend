import { MongoBaseRepository } from '../base/mongo-repository';
import { VendorPayment, IVendorPayment } from './model';

export class VendorPaymentRepository extends MongoBaseRepository<IVendorPayment> {
  constructor() {
    super(VendorPayment);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
