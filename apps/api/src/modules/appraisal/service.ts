import { AppraisalRepository } from './repository';
import { IAppraisal } from './model';

export class AppraisalService {
  private repo = new AppraisalRepository();

  async create(data: Partial<IAppraisal>, userId: string) {
    return this.repo.create({ ...data, createdBy: userId } as IAppraisal);
  }
  async getAll(organizationId: string) { return this.repo.findByOrganization(organizationId); }
  async getById(id: string) { return this.repo.findById(id); }
  async update(id: string, data: Partial<IAppraisal>) { return this.repo.update(id, data); }
  async transition(id: string, status: IAppraisal['status']) {
    const update: Partial<IAppraisal> = { status };
    if (status === 'FINALIZED') update.finalizedAt = new Date();
    return this.repo.update(id, update);
  }
  async delete(id: string) { return this.repo.softDelete(id); }
}
