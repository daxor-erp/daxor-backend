import { JournalEntryRepository } from './repository';
import { IJournalEntry } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class JournalEntryService {
  private repository: JournalEntryRepository;

  constructor() {
    this.repository = new JournalEntryRepository();
  }

  async create(data: Partial<IJournalEntry>, userId: string) {
    const seq = await getNextSequence({ type: 'JournalEntry', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('JE', data.organizationId!.toString(), seq);
    
    const totalDebit = data.lines?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0;
    const totalCredit = data.lines?.reduce((sum, line) => sum + (line.credit || 0), 0) || 0;
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error('Journal entry is not balanced. Debits must equal credits.');
    }
    
    return this.repository.create({ 
      ...data, 
      seqNo, 
      totalDebit, 
      totalCredit, 
      createdBy: userId 
    } as IJournalEntry);
  }

  async getAll(organizationId: string, status?: string) {
    return this.repository.findByOrganization(organizationId, status);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IJournalEntry>) {
    if (data.lines) {
      const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
      const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
      
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error('Journal entry is not balanced. Debits must equal credits.');
      }
      
      data.totalDebit = totalDebit;
      data.totalCredit = totalCredit;
    }
    
    return this.repository.update(id, data);
  }

  async post(id: string, userId: string) {
    return this.repository.update(id, { 
      status: 'posted', 
      postedAt: new Date(), 
      postedBy: userId 
    } as any);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
