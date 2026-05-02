import {
  BankAccountRepository,
  BankStatementLineRepository,
  CashBankRepository,
  ReconciliationRuleRepository,
  type CashBankListFilters,
} from './repository';
import type {
  IBankAccount,
  IBankStatementLine,
  ICashBank,
  IReconciliationRule,
} from './model';

const TOLERANCE = 0.01;

function signedLineAmount(line: { amount: number; lineKind: string }): number {
  return line.lineKind === 'debit' ? -Math.abs(line.amount) : Math.abs(line.amount);
}

function signedBookAmount(t: ICashBank): number {
  const ty = (t.transactionType || '').toLowerCase();
  if (ty === 'payment' || ty === 'payout' || ty === 'withdrawal' || ty === 'fee') {
    return -Math.abs(t.amount);
  }
  return Math.abs(t.amount);
}

export class CashBankService {
  private cbRepository: CashBankRepository;
  private baRepository: BankAccountRepository;
  private bslRepository: BankStatementLineRepository;
  private ruleRepository: ReconciliationRuleRepository;

  constructor() {
    this.cbRepository = new CashBankRepository();
    this.baRepository = new BankAccountRepository();
    this.bslRepository = new BankStatementLineRepository();
    this.ruleRepository = new ReconciliationRuleRepository();
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

  async getTransactions(organizationId: string, filters?: CashBankListFilters) {
    return this.cbRepository.findByOrganization(organizationId, filters);
  }

  async reconcileTransaction(id: string) {
    return this.cbRepository.update(id, {
      reconciliationStatus: 'RECONCILED',
      reconciliationDate: new Date(),
    } as Partial<ICashBank>);
  }

  async createBankAccount(data: Partial<IBankAccount>) {
    const accountHolder =
      (data.accountHolder && String(data.accountHolder).trim()) || data.accountName || '';
    return this.baRepository.create({ ...data, accountHolder } as IBankAccount);
  }

  async getBankAccounts(organizationId: string) {
    return this.baRepository.findByOrganization(organizationId);
  }

  async updateBankAccount(id: string, data: Partial<IBankAccount>) {
    return this.baRepository.update(id, data);
  }

  async getReconciliationRules(organizationId: string) {
    return this.ruleRepository.findByOrganization(organizationId);
  }

  async createReconciliationRule(data: Partial<IReconciliationRule>) {
    if (!data.name || !String(data.name).trim()) {
      throw new Error('Rule name is required');
    }
    if (!data.organizationId) {
      throw new Error('organizationId is required');
    }
    const tol = data.amountTolerance;
    if (tol !== undefined && (typeof tol !== 'number' || tol < 0)) {
      throw new Error('amountTolerance must be a non-negative number');
    }
    return this.ruleRepository.create({
      name: String(data.name).trim(),
      organizationId: data.organizationId,
      bankAccount: (data.bankAccount !== undefined && data.bankAccount !== null
        ? String(data.bankAccount)
        : ''
      ).trim(),
      priority: data.priority !== undefined && data.priority !== null ? Number(data.priority) : 100,
      isActive: data.isActive !== false,
      bankLineTextContains: (data.bankLineTextContains !== undefined && data.bankLineTextContains !== null
        ? String(data.bankLineTextContains)
        : ''
      ).trim(),
      bookLineTextContains: (data.bookLineTextContains !== undefined && data.bookLineTextContains !== null
        ? String(data.bookLineTextContains)
        : ''
      ).trim(),
      amountTolerance: tol !== undefined && tol !== null ? Number(tol) : 0.01,
      notes: (data.notes !== undefined && data.notes !== null ? String(data.notes) : '').trim(),
      isDeleted: false,
    } as IReconciliationRule);
  }

  async updateReconciliationRule(id: string, data: Partial<IReconciliationRule>) {
    const u: Record<string, unknown> = { ...data };
    delete u.id;
    delete u.organizationId;
    if (u.amountTolerance !== undefined && (typeof u.amountTolerance !== 'number' || (u.amountTolerance as number) < 0)) {
      throw new Error('amountTolerance must be a non-negative number');
    }
    if (u.name !== undefined) u.name = String(u.name).trim();
    if (u.bankLineTextContains !== undefined) u.bankLineTextContains = String(u.bankLineTextContains).trim();
    if (u.bookLineTextContains !== undefined) u.bookLineTextContains = String(u.bookLineTextContains).trim();
    if (u.bankAccount !== undefined) u.bankAccount = String(u.bankAccount ?? '').trim();
    if (u.notes !== undefined) u.notes = String(u.notes ?? '').trim();
    return this.ruleRepository.update(id, u as Partial<IReconciliationRule>);
  }

  async deleteReconciliationRule(id: string) {
    const r = await this.ruleRepository.findById(id);
    if (!r || r.isDeleted) {
      return false;
    }
    const u = await this.ruleRepository.update(id, { isDeleted: true } as Partial<IReconciliationRule>);
    return u !== null;
  }

  /**
   * Move funds between two bank accounts: one payment on the source, one receipt on the destination,
   * both sharing referenceModule `bank_transfer` and the same `referenceId`.
   */
  async transferBankFunds(
    input: {
      organizationId: string;
      transferDate: string;
      fromAccountNumber: string;
      toAccountNumber: string;
      amount: number;
      currency?: string | null;
      description: string;
      paymentMethod?: string | null;
    },
    userId: string,
  ) {
    const fromNo = String(input.fromAccountNumber).trim();
    const toNo = String(input.toAccountNumber).trim();
    if (!fromNo || !toNo) {
      throw new Error('From and to accounts are required');
    }
    if (fromNo === toNo) {
      throw new Error('From and to accounts must be different');
    }
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    const from = await this.baRepository.findOne({
      organizationId: input.organizationId,
      accountNumber: fromNo,
      isDeleted: false,
    } as any);
    const to = await this.baRepository.findOne({
      organizationId: input.organizationId,
      accountNumber: toNo,
      isDeleted: false,
    } as any);
    if (!from || !to) {
      throw new Error('One or both bank accounts were not found');
    }
    if (!from.isActive || !to.isActive) {
      throw new Error('Both accounts must be active');
    }
    const cFrom = (from as IBankAccount).currency || 'USD';
    const cTo = (to as IBankAccount).currency || 'USD';
    if (cFrom !== cTo) {
      throw new Error('Both accounts must use the same currency for transfers');
    }
    const currency = (input.currency && String(input.currency).trim()) || cFrom;
    if (currency !== cFrom) {
      throw new Error('Currency does not match the selected accounts');
    }
    const when = new Date(input.transferDate);
    if (Number.isNaN(when.getTime())) {
      throw new Error('Invalid transfer date');
    }
    const desc = String(input.description || '').trim() || 'Bank transfer';
    const transferId = `tf-${String(input.organizationId).slice(-4)}-${Date.now()}`;
    const fromName = (from as IBankAccount).accountName || fromNo;
    const toName = (to as IBankAccount).accountName || toNo;
    const method = (input.paymentMethod && String(input.paymentMethod).trim()) || 'internal_transfer';

    const out = await this.createTransaction(
      {
        organizationId: input.organizationId,
        transactionDate: when,
        transactionType: 'payment',
        bankAccount: fromNo,
        referenceModule: 'bank_transfer',
        referenceId: transferId,
        amount: input.amount,
        currency,
        paymentMethod: method,
        description: `Transfer to ${toName} (${toNo}): ${desc}`,
      } as Partial<ICashBank>,
      userId,
    );

    const inn = await this.createTransaction(
      {
        organizationId: input.organizationId,
        transactionDate: when,
        transactionType: 'receipt',
        bankAccount: toNo,
        referenceModule: 'bank_transfer',
        referenceId: transferId,
        amount: input.amount,
        currency,
        paymentMethod: method,
        description: `Transfer from ${fromName} (${fromNo}): ${desc}`,
      } as Partial<ICashBank>,
      userId,
    );

    return {
      transferId,
      fromCashBankId: String((out as any)._id),
      toCashBankId: String((inn as any)._id),
      fromTransactionNumber: (out as any).transactionNumber,
      toTransactionNumber: (inn as any).transactionNumber,
    };
  }

  async getBankStatementLines(organizationId: string, bankAccount: string, onlyUnmatched?: boolean) {
    return this.bslRepository.findByOrgAndAccount(organizationId, bankAccount, onlyUnmatched);
  }

  async createBankStatementLine(
    data: Pick<
      IBankStatementLine,
      'organizationId' | 'bankAccount' | 'lineDate' | 'amount' | 'lineKind' | 'description' | 'bankReference'
    >,
  ) {
    if (data.lineKind !== 'credit' && data.lineKind !== 'debit') {
      throw new Error('lineKind must be credit or debit');
    }
    if (data.amount < 0 || !Number.isFinite(data.amount)) {
      throw new Error('amount must be a positive number');
    }
    return this.bslRepository.create({
      ...data,
      amount: Math.abs(data.amount),
      isMatched: false,
      isDeleted: false,
    } as IBankStatementLine);
  }

  async deleteBankStatementLine(id: string) {
    const line = await this.bslRepository.findById(id);
    if (!line || line.isDeleted) {
      return false;
    }
    if (line.isMatched) {
      throw new Error('Unmatch or reconcile elsewhere before removing a matched bank line');
    }
    const u = await this.bslRepository.update(id, { isDeleted: true } as Partial<IBankStatementLine>);
    return u !== null;
  }

  /**
   * Link a line from the bank-issued statement to a book (CashBook) line and mark the book line reconciled.
   */
  async matchBankStatementLineToBook(bankStatementLineId: string, cashBankId: string) {
    const line = await this.bslRepository.findById(bankStatementLineId);
    if (!line || line.isDeleted) {
      throw new Error('Bank statement line not found');
    }
    if (line.isMatched) {
      throw new Error('This bank line is already matched');
    }
    const book = await this.cbRepository.findById(cashBankId);
    if (!book) {
      throw new Error('Book line not found');
    }
    if (book.isDeleted) {
      throw new Error('Book line not found');
    }
    if (book.reconciliationStatus === 'RECONCILED') {
      throw new Error('Book line is already reconciled');
    }
    if (book.organizationId !== line.organizationId) {
      throw new Error('Organization mismatch');
    }
    if (book.bankAccount !== line.bankAccount) {
      throw new Error('Bank account does not match this bank statement line');
    }
    const sl = signedLineAmount(line);
    const sb = signedBookAmount(book);
    if (Math.abs(sl - sb) > TOLERANCE) {
      throw new Error(
        `Amount or direction does not match (bank line ${sl.toFixed(2)} vs book ${sb.toFixed(2)})`,
      );
    }
    const reconciled = await this.reconcileTransaction(cashBankId);
    await this.bslRepository.update(bankStatementLineId, {
      isMatched: true,
      matchedCashBankId: String((reconciled as any)?._id || cashBankId),
    } as Partial<IBankStatementLine>);
    const updated = await this.bslRepository.findById(bankStatementLineId);
    if (!updated) {
      throw new Error('Failed to load bank statement line after match');
    }
    return updated;
  }

  private async generateTransactionNumber(organizationId: string): Promise<string> {
    const count = await this.cbRepository.count({ organizationId } as any);
    return `CB-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`;
  }
}
