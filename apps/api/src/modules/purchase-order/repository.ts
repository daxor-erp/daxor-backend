import { MongoBaseRepository } from '../base/mongo-repository';
import { PurchaseOrder } from './model';

export class PurchaseOrderRepository extends MongoBaseRepository<any> {
  constructor() {
    super(PurchaseOrder);
  }

  async findByVendorId(vendorId: string): Promise<any[]> {
    return this.findAllActive({ vendorId });
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.findAllActive({ status });
  }

  async findByVendorAndStatus(vendorId: string, status: string): Promise<any[]> {
    return this.findAllActive({ vendorId, status });
  }

  async findPendingApproval(): Promise<any[]> {
    return this.findAllActive({ status: 'submitted' });
  }

  async findApprovedPOs(): Promise<any[]> {
    return this.findAllActive({ status: 'approved' });
  }

  async findByOrganizationId(organizationId: string): Promise<any[]> {
    return this.findAllActive({ organizationId });
  }

  async findByDeliveryDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return this.findAllActive({
      deliveryDate: {
        $gte: startDate,
        $lte: endDate
      }
    });
  }

  async findByPRId(prId: string): Promise<any[]> {
    return this.findAllActive({ prId });
  }
}
