import { CashBankRepository, BankAccountRepository } from './repository';
import { ICashBank, IBankAccount } from './model';

export class CashBankService {
  private cbRepository: CashBankRepository;
  private baRepository: BankAccountRepository;

  constructor() {
    this.cbRepository = new CashBankRepository();
    this.baRepository = new BankAccountRepository();
  }

  async createTransaction(data: Partial<ICashBank>, userId: string) {
    const transactionNumber = await this.generateTransactionNumber(data.organizationId!);
    return this.cbRepository.create({
      ...data,
      transactionNumber,
      createdBy: userId,
      reconciliationStatus: 'PENDING',
    } as ICashBank);
  }

  async getTransactions(organizationId: string) {
    return this.cbRepository.findByOrganization(organizationId);
  }

  async reconcileTransaction(id: string) {
    return this.cbRepository.update(id, {
      reconciliationStatus: 'RECONCILED',
      reconciliationDate: new Date(),
    } as Partial<ICashBank>);
  }

  async createBankAccount(data: Partial<IBankAccount>) {
    return this.baRepository.create(data as IBankAccount);
  }

  async getBankAccounts(organizationId: string) {
    return this.baRepository.findByOrganization(organizationId);
  }

  async updateBankAccount(id: string, data: Partial<IBankAccount>) {
    return this.baRepository.update(id, data);
  }

  private async generateTransactionNumber(organizationId: string): Promise<string> {
    const count = await this.cbRepository.count({ organizationId } as any);
    return `CB-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
