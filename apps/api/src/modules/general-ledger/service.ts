import { GeneralLedgerRepository, ChartOfAccountsRepository } from './repository';
import { IGeneralLedger, IChartOfAccounts } from './model';
import { JournalEntryRepository } from '../journal-entry/repository';
import { VendorBill } from '../vendor-bill/model';
import { CustomerInvoice } from '../customer-invoice/model';
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
    // Compute level from parent depth if parentAccountId is provided.
    let level = data.level ?? 1;
    if ((data as any).parentAccountId) {
      const parent = await this.coaRepository.findById(String((data as any).parentAccountId));
      if (parent) level = (Number((parent as any).level) || 1) + 1;
    }
    return this.coaRepository.create({ ...rest, accountCode, level } as IChartOfAccounts);
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

  private parseDateBound(value?: string | null, endOfDay = false): Date | undefined {
    if (value == null || String(value).trim() === '') return undefined;
    const raw = String(value).trim();
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return undefined;
    // If caller passed a date-only YYYY-MM-DD, pin to start/end of that local day.
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y, m, day] = raw.split('-').map(Number);
      return endOfDay
        ? new Date(y, m - 1, day, 23, 59, 59, 999)
        : new Date(y, m - 1, day, 0, 0, 0, 0);
    }
    return d;
  }

  async getTrialBalance(
    organizationId: string,
    opts?: { dateFrom?: string | null; dateTo?: string | null; asOf?: boolean },
  ) {
    const accounts = await this.coaRepository.findByOrganization(organizationId);
    const dateFrom = opts?.asOf ? undefined : this.parseDateBound(opts?.dateFrom, false);
    const dateTo = this.parseDateBound(opts?.dateTo, true);
    const entries = await this.jeRepository.findByOrganizationInDateRange(organizationId, {
      status: 'posted',
      dateFrom,
      dateTo,
    });
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

  async getIncomeStatement(
    organizationId: string,
    opts?: { dateFrom?: string | null; dateTo?: string | null },
  ) {
    const tb = await this.getTrialBalance(organizationId, opts);
    return buildIncomeStatementFromTrialBalance(tb);
  }

  async getBalanceSheet(
    organizationId: string,
    opts?: { dateFrom?: string | null; dateTo?: string | null },
  ) {
    // Balance sheet is cumulative as-of dateTo (ignore dateFrom).
    const tb = await this.getTrialBalance(organizationId, {
      dateTo: opts?.dateTo,
      asOf: true,
    });
    return buildBalanceSheetFromTrialBalance(tb);
  }

  // ---------------------------------------------------------------------------
  // Aged Payable (AP) — Odoo 19 Accounting › Reporting › Aged Payable
  // ---------------------------------------------------------------------------

  async getAgedPayable(organizationId: string): Promise<{
    vendorId: string
    vendorName: string
    current: number
    days30: number
    days60: number
    days90: number
    over90: number
    total: number
    bills: Array<{
      billId: string
      billNumber: string
      billDate: string
      dueDate: string
      totalAmount: number
      outstandingAmount: number
      daysOverdue: number
      status: string
    }>
  }[]> {
    const now = new Date()

    const bills = await VendorBill.find({
      organizationId,
      deletedAt: null,
      status: { $in: ['approved', 'in_payment', 'partially_paid'] },
    })
      .populate('vendorId', 'name')
      .lean()

    const byVendor = new Map<string, any>()

    for (const b of bills as any[]) {
      const vendorId = String(b.vendorId?._id ?? b.vendorId ?? 'unknown')
      const vendorName = String(b.vendorId?.name ?? 'Unknown Vendor')
      const outstanding = Number(b.outstandingAmount ?? 0)
      if (outstanding <= 0.009) continue

      const dueDate = b.dueDate ? new Date(b.dueDate) : now
      const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / 86_400_000))

      if (!byVendor.has(vendorId)) {
        byVendor.set(vendorId, { vendorId, vendorName, current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0, bills: [] })
      }
      const row = byVendor.get(vendorId)!
      row.total = Math.round((row.total + outstanding) * 100) / 100

      if (daysOverdue === 0)            row.current = Math.round((row.current + outstanding) * 100) / 100
      else if (daysOverdue <= 30)       row.days30  = Math.round((row.days30  + outstanding) * 100) / 100
      else if (daysOverdue <= 60)       row.days60  = Math.round((row.days60  + outstanding) * 100) / 100
      else if (daysOverdue <= 90)       row.days90  = Math.round((row.days90  + outstanding) * 100) / 100
      else                              row.over90  = Math.round((row.over90  + outstanding) * 100) / 100

      row.bills.push({
        billId: String(b._id),
        billNumber: b.billNumber ?? '',
        billDate: b.billDate ? new Date(b.billDate).toISOString() : '',
        dueDate: b.dueDate  ? new Date(b.dueDate).toISOString()  : '',
        totalAmount: Number(b.totalAmount ?? 0),
        outstandingAmount: outstanding,
        daysOverdue,
        status: b.status,
      })
    }

    return Array.from(byVendor.values()).sort((a, b) => b.total - a.total)
  }

  // ---------------------------------------------------------------------------
  // Aged Receivable (AR) — Odoo 19 Accounting › Reporting › Aged Receivable
  // ---------------------------------------------------------------------------

  async getAgedReceivable(organizationId: string): Promise<{
    customerId: string
    customerName: string
    current: number
    days30: number
    days60: number
    days90: number
    over90: number
    total: number
    invoices: Array<{
      invoiceId: string
      invoiceNumber: string
      invoiceDate: string
      dueDate: string
      totalAmount: number
      outstandingAmount: number
      daysOverdue: number
      status: string
    }>
  }[]> {
    const now = new Date()

    const invoices = await CustomerInvoice.find({
      organizationId,
      deletedAt: null,
      status: { $in: ['approved', 'sent', 'in_payment', 'partially_paid', 'overdue'] },
    })
      .lean()

    const byCustomer = new Map<string, any>()

    for (const inv of invoices as any[]) {
      const customerId = String(inv.customerId ?? inv.clientId ?? 'unknown')
      const outstanding = Math.round(Math.max(0, (Number(inv.totalAmount ?? 0) - Number(inv.paidAmount ?? 0))) * 100) / 100
      if (outstanding <= 0.009) continue

      const dueDate = inv.dueDate ? new Date(inv.dueDate) : now
      const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / 86_400_000))

      if (!byCustomer.has(customerId)) {
        byCustomer.set(customerId, { customerId, customerName: customerId.slice(-8), current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0, invoices: [] })
      }
      const row = byCustomer.get(customerId)!
      row.total = Math.round((row.total + outstanding) * 100) / 100

      if (daysOverdue === 0)            row.current = Math.round((row.current + outstanding) * 100) / 100
      else if (daysOverdue <= 30)       row.days30  = Math.round((row.days30  + outstanding) * 100) / 100
      else if (daysOverdue <= 60)       row.days60  = Math.round((row.days60  + outstanding) * 100) / 100
      else if (daysOverdue <= 90)       row.days90  = Math.round((row.days90  + outstanding) * 100) / 100
      else                              row.over90  = Math.round((row.over90  + outstanding) * 100) / 100

      row.invoices.push({
        invoiceId: String(inv._id),
        invoiceNumber: inv.invoiceNumber ?? inv.seqNo ?? '',
        invoiceDate: inv.invoiceDate ? new Date(inv.invoiceDate).toISOString() : '',
        dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString() : '',
        totalAmount: Number(inv.totalAmount ?? 0),
        outstandingAmount: outstanding,
        daysOverdue,
        status: inv.status,
      })
    }

    return Array.from(byCustomer.values()).sort((a, b) => b.total - a.total)
  }
}
