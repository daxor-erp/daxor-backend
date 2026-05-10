import { ContractorRepository } from './repository';
import { IContractor } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class ContractorService {
  private repository: ContractorRepository;

  constructor() {
    this.repository = new ContractorRepository();
  }

  async create(data: Partial<IContractor>, userId: string) {
    const seq = await getNextSequence({ type: 'Contractor', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('CON', data.organizationId!.toString(), seq);
    return this.repository.create({ ...data, seqNo, createdBy: userId } as IContractor);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IContractor>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
