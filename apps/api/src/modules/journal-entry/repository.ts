import { MongoBaseRepository } from '../base/mongo-repository';
import { JournalEntry, IJournalEntry } from './model';

export class JournalEntryRepository extends MongoBaseRepository<IJournalEntry> {
  constructor() {
    super(JournalEntry);
  }

  async findByOrganization(organizationId: string, status?: string) {
    const filter: any = { organizationId, isDeleted: false };
    if (status) filter.status = status;
    return this.findAll(filter);
  }

  async findByEntryNumber(entryNumber: string, organizationId: string) {
    return this.findOne({ entryNumber, organizationId, isDeleted: false } as any);
  }
}
