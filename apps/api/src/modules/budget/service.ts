import { BudgetRepository } from './repository';
import { IBudget } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class BudgetService {
  private repository: BudgetRepository;

  constructor() {
    this.repository = new BudgetRepository();
  }

  async create(data: Partial<IBudget>, userId: string) {
    const seq = await getNextSequence({ type: 'Budget', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('BUD', data.organizationId!.toString(), seq);
    
    const totalAmount = data.lines?.reduce((sum, line) => sum + (line.amount || 0), 0) || 0;
    
    return this.repository.create({ 
      ...data, 
      seqNo, 
      totalAmount, 
      createdBy: userId 
    } as IBudget);
  }

  async getAll(organizationId: string, fiscalYear?: string) {
    return this.repository.findByOrganization(organizationId, fiscalYear);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async update(id: string, data: Partial<IBudget>) {
    if (data.lines) {
      const totalAmount = data.lines.reduce((sum, line) => sum + (line.amount || 0), 0);
      data.totalAmount = totalAmount;
    }
    
    return this.repository.update(id, data);
  }

  async activate(id: string) {
    return this.repository.update(id, { status: 'active' } as any);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
