import { MongoBaseRepository } from '../base/mongo-repository';
import { JournalEntry, IJournalEntry } from './model';

export class JournalEntryRepository extends MongoBaseRepository<IJournalEntry> {
  constructor() {
    super(JournalEntry);
  }

  async findByOrganization(organizationId: string, status?: string) {
    const filter: any = { organizationId, isDeleted: { $ne: true } };
    if (status) filter.status = status;
    return this.findAll(filter);
  }

  /** Posted (or status-filtered) journals, optionally bounded by entryDate. */
  async findByOrganizationInDateRange(
    organizationId: string,
    opts?: { status?: string; dateFrom?: Date; dateTo?: Date },
  ) {
    const filter: any = { organizationId, isDeleted: { $ne: true } };
    if (opts?.status) filter.status = opts.status;
    if (opts?.dateFrom || opts?.dateTo) {
      filter.entryDate = {};
      if (opts.dateFrom) filter.entryDate.$gte = opts.dateFrom;
      if (opts.dateTo) filter.entryDate.$lte = opts.dateTo;
    }
    return this.findAll(filter);
  }

  async findByEntryNumber(entryNumber: string, organizationId: string) {
    return this.findOne({ entryNumber, organizationId, isDeleted: false } as any);
  }

  async findByReferenceNumber(referenceNumber: string, organizationId: string) {
    return this.findOne({ referenceNumber, organizationId, isDeleted: false } as any);
  }
}
