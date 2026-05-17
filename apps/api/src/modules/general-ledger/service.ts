import { GeneralLedgerRepository, ChartOfAccountsRepository } from './repository';
import { IGeneralLedger, IChartOfAccounts } from './model';

export class GeneralLedgerService {
  private glRepository: GeneralLedgerRepository;
  private coaRepository: ChartOfAccountsRepository;

  constructor() {
    this.glRepository = new GeneralLedgerRepository();
    this.coaRepository = new ChartOfAccountsRepository();
  }

  async createTransaction(data: Partial<IGeneralLedger>, userId: string) {
    const transactionNumber = await this.generateTransactionNumber(data.organizationId!);
    
    const transaction = await this.glRepository.create({
      ...data,
      transactionNumber,
      createdBy: userId,
      status: 'POSTED',
    } as IGeneralLedger);

    return transaction;
  }

  async getTransactions(organizationId: string, filters: any) {
    if (filters.fiscalYear) {
      return this.glRepository.findByFiscalYear(organizationId, filters.fiscalYear);
    }
    return this.glRepository.findByOrganization(organizationId);
  }

  async getTransactionById(id: string) {
    return this.glRepository.findById(id);
  }

  async createChartOfAccount(data: Partial<IChartOfAccounts>) {
    const accountCode = await this.generateAccountCode(data.organizationId!, data.accountType!);
    const { accountCode: _ignored, ...rest } = data;
    return this.coaRepository.create({ ...rest, accountCode } as IChartOfAccounts);
  }

  private async generateAccountCode(organizationId: string, accountType: string): Promise<string> {
    const baseByType: Record<string, number> = {
      asset: 1000,
      liability: 2000,
      equity: 3000,
      revenue: 4000,
      expense: 5000,
    };
    const base = baseByType[String(accountType).toLowerCase()] ?? 9000;
    const existing = await this.coaRepository.findByOrganization(organizationId);
    const sameTypePrefix = String(base).slice(0, 1);
    const usedNumeric = existing
      .map((a: any) => Number(String(a.accountCode || '').trim()))
      .filter((n: number) => Number.isFinite(n) && String(n).startsWith(sameTypePrefix));
    const next = usedNumeric.length ? Math.max(...usedNumeric) + 1 : base;
    return String(next);
  }

  async getChartOfAccounts(organizationId: string, filters: any) {
    if (filters.accountType) {
      return this.coaRepository.findByAccountType(organizationId, filters.accountType);
    }
    return this.coaRepository.findByOrganization(organizationId);
  }

  async updateChartOfAccount(id: string, data: Partial<IChartOfAccounts>) {
    return this.coaRepository.update(id, data);
  }

  async deleteChartOfAccount(id: string) {
    return this.coaRepository.softDelete(id);
  }

  private async generateTransactionNumber(organizationId: string): Promise<string> {
    const count = await this.glRepository.count({ organizationId } as any);
    return `GL-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
