import { SiteLocationRepository } from './repository';
import { ISiteLocation } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class SiteLocationService {
  private repository: SiteLocationRepository;

  constructor() {
    this.repository = new SiteLocationRepository();
  }

  async create(data: Partial<ISiteLocation>, userId: string) {
    const seq = await getNextSequence({ type: 'SiteLocation', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('LOC', data.organizationId!.toString(), seq);
    return this.repository.create({ ...data, seqNo, createdBy: userId } as ISiteLocation);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<ISiteLocation>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
