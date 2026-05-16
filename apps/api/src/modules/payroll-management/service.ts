import { GraphQLValidationError } from '@repo/errors';
import { PayrollManagementRepository } from './repository';
import { IPayrollManagement } from './model';

export class PayrollManagementService {
  private repository: PayrollManagementRepository;

  constructor() {
    this.repository = new PayrollManagementRepository();
  }

  async create(data: Partial<IPayrollManagement>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!);
    const payload = this.normalizeInput({
      ...data,
      docNumber,
      createdBy: userId,
      status: 'DRAFT',
    });
    return this.repository.create(payload as IPayrollManagement);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    const row = await this.repository.findById(id);
    if (row && (row as IPayrollManagement).isDeleted) return null;
    return row;
  }

  async update(id: string, data: Partial<IPayrollManagement>) {
    const payload = this.normalizeInput(data);
    return this.repository.update(id, payload);
  }

  async delete(id: string) {
    await this.repository.update(id, { isDeleted: true } as Partial<IPayrollManagement>);
  }

  async submitForApproval(id: string): Promise<IPayrollManagement> {
    const doc = await this.getById(id);
    if (!doc) throw new GraphQLValidationError('Payroll management record not found');
    const st = String(doc.status ?? '').toUpperCase();
    if (st !== 'DRAFT' && st !== 'APPROVAL_DECLINED' && st !== 'PENDING_REVIEW') {
      throw new GraphQLValidationError('Only draft or declined payroll runs can be sent for approval');
    }
    return this.repository.update(id, { status: 'SUBMITTED' } as Partial<IPayrollManagement>);
  }

  async approveApproval(id: string): Promise<IPayrollManagement> {
    const doc = await this.getById(id);
    if (!doc) throw new GraphQLValidationError('Payroll management record not found');
    if (String(doc.status ?? '').toUpperCase() !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only payroll runs pending approval can be approved');
    }
    return this.repository.update(id, { status: 'APPROVED' } as Partial<IPayrollManagement>);
  }

  async declineApproval(id: string): Promise<IPayrollManagement> {
    const doc = await this.getById(id);
    if (!doc) throw new GraphQLValidationError('Payroll management record not found');
    if (String(doc.status ?? '').toUpperCase() !== 'SUBMITTED') {
      throw new GraphQLValidationError('Only payroll runs pending approval can be declined');
    }
    return this.repository.update(id, { status: 'APPROVAL_DECLINED' } as Partial<IPayrollManagement>);
  }

  private normalizeInput(
    data: Partial<IPayrollManagement>,
  ): Partial<IPayrollManagement> {
    const out: Partial<IPayrollManagement> = { ...data };
    if (out.title !== undefined) out.title = (out.title as string)?.trim() || undefined;
    if (out.remarks !== undefined) out.remarks = (out.remarks as string)?.trim() || undefined;
    for (const key of ['payPeriodStart', 'payPeriodEnd', 'docDate'] as const) {
      const v = out[key];
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' && v === '') continue;
      if (v instanceof Date) continue;
      if (typeof v === 'string') {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) (out as any)[key] = d;
      }
    }
    return out;
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any);
    return `PAYROLL_MANAGEMENT-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
