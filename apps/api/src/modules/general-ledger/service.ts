import { GeneralLedgerRepository, ChartOfAccountsRepository } from './repository';
import { IGeneralLedger, IChartOfAccounts } from './model';
import { JournalEntryRepository } from '../journal-entry/repository';
import {
  buildBalanceSheetFromTrialBalance,
  buildIncomeStatementFromTrialBalance,
} from '../../lib/financial-reports';

export class GeneralLedgerService {
  private glRepository: GeneralLedgerRepository;
  private coaRepository: ChartOfAccountsRepository;
  private jeRepository: JournalEntryRepository;

  constructor() {
    this.glRepository = new GeneralLedgerRepository();
    this.coaRepository = new ChartOfAccountsRepository();
    this.jeRepository = new JournalEntryRepository();
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

  async getTrialBalance(organizationId: string) {
    const accounts = await this.coaRepository.findByOrganization(organizationId);
    const entries = await this.jeRepository.findByOrganization(organizationId, 'posted');
    const byCode = new Map<
      string,
      { accountCode: string; accountName: string; accountType: string; debit: number; credit: number }
    >();

    for (const a of accounts) {
      const code = String((a as any).accountCode ?? '').trim();
      if (!code) continue;
      byCode.set(code, {
        accountCode: code,
        accountName: String((a as any).accountName ?? code),
        accountType: String((a as any).accountType ?? 'other'),
        debit: 0,
        credit: 0,
      });
    }

    for (const je of entries) {
      for (const line of (je as any).lines ?? []) {
        const code = String(line.accountCode ?? '').trim();
        if (!code) continue;
        if (!byCode.has(code)) {
          byCode.set(code, {
            accountCode: code,
            accountName: String(line.accountName ?? code),
            accountType: 'other',
            debit: 0,
            credit: 0,
          });
        }
        const row = byCode.get(code)!;
        row.debit += Number(line.debit) || 0;
        row.credit += Number(line.credit) || 0;
      }
    }

    return Array.from(byCode.values())
      .filter((r) => r.debit > 0.009 || r.credit > 0.009)
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  async getIncomeStatement(organizationId: string) {
    const tb = await this.getTrialBalance(organizationId);
    return buildIncomeStatementFromTrialBalance(tb);
  }

  async getBalanceSheet(organizationId: string) {
    const tb = await this.getTrialBalance(organizationId);
    return buildBalanceSheetFromTrialBalance(tb);
  }
}
