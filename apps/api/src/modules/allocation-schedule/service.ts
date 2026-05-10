import { AllocationScheduleRepository } from './repository';
import { IAllocationSchedule } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class AllocationScheduleService {
  private repository: AllocationScheduleRepository;

  constructor() {
    this.repository = new AllocationScheduleRepository();
  }

  async create(data: Partial<IAllocationSchedule>, userId: string) {
    const seq = await getNextSequence({ type: 'AllocationSchedule', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('ALLOC', data.organizationId!.toString(), seq);
    
    return this.repository.create({ ...data, seqNo, createdBy: userId } as IAllocationSchedule);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IAllocationSchedule>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
