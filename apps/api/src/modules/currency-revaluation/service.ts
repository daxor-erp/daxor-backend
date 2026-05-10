import { CurrencyRevaluationRepository } from './repository';
import { ICurrencyRevaluation } from './model';
import { getNextSequence } from '../counter';
import { formatEntitySequence } from '../../lib/sequence';

export class CurrencyRevaluationService {
  private repository: CurrencyRevaluationRepository;

  constructor() {
    this.repository = new CurrencyRevaluationRepository();
  }

  async create(data: Partial<ICurrencyRevaluation>, userId: string) {
    const seq = await getNextSequence({ type: 'CurrencyRevaluation', organizationId: data.organizationId! });
    const seqNo = formatEntitySequence('REVAL', data.organizationId!.toString(), seq);
    
    // Mock calculation - in real scenario, fetch open balances and apply exchange rates
    const lines = [
      {
        accountCode: '1200',
        accountName: 'Foreign Currency Account',
        currency: 'USD',
        originalAmount: 10000,
        revaluedAmount: 10500,
        gainLoss: 500,
      }
    ];
    
    const totalGainLoss = lines.reduce((sum, line) => sum + line.gainLoss, 0);
    
    return this.repository.create({ 
      ...data, 
      seqNo, 
      lines,
      totalGainLoss,
      exchangeRates: { USD: 1.05 },
      createdBy: userId 
    } as ICurrencyRevaluation);
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async post(id: string) {
    return this.repository.update(id, { status: 'posted', postedAt: new Date() } as any);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}
