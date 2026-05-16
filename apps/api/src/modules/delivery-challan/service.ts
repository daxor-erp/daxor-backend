import { GraphQLValidationError } from '@repo/errors';
import { DeliveryChallanRepository } from './repository';
import { IDeliveryChallan } from './model';

export class DeliveryChallanService {
  private repository: DeliveryChallanRepository;

  constructor() {
    this.repository = new DeliveryChallanRepository();
  }

  async create(data: Partial<IDeliveryChallan>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    const { status: _s, ...rest } = data as Record<string, unknown>;
    return this.repository.create({
      ...rest,
      docNumber,
      createdBy: userId,
      status: 'DRAFT',
    } as IDeliveryChallan);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IDeliveryChallan>) {
    const existing = await this.repository.findById(id);
    if (!existing || existing.isDeleted) throw new GraphQLValidationError('Delivery challan not found');
    const st = String(existing.status);
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED') {
      throw new GraphQLValidationError('Only draft or declined delivery challans can be edited');
    }
    const { status: _ignored, ...rest } = data as Record<string, unknown>;
    return this.repository.update(id, rest as Partial<IDeliveryChallan>);
  }

  async submitForOrgApproval(id: string) {
    const row = await this.repository.findById(id);
    if (!row || row.isDeleted) throw new GraphQLValidationError('Delivery challan not found');
    const st = String(row.status);
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED') {
      throw new GraphQLValidationError('Only draft or declined delivery challans can be sent for approval');
    }
    return this.repository.update(id, { status: 'SUBMITTED' });
  }

  async approveApproval(id: string, _decidedByUserId?: string) {
    const row = await this.repository.findById(id);
    if (!row || row.isDeleted) throw new GraphQLValidationError('Delivery challan not found');
    if (String(row.status) !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only submitted delivery challans can be approved');
    }
    return this.repository.update(id, { status: 'APPROVED' });
  }

  async declineApproval(id: string, _decidedByUserId?: string) {
    const row = await this.repository.findById(id);
    if (!row || row.isDeleted) throw new GraphQLValidationError('Delivery challan not found');
    if (String(row.status) !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only submitted delivery challans can be declined');
    }
    return this.repository.update(id, { status: 'APPROVAL_DECLINED' });
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `DELIVERY_CHALLAN-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
