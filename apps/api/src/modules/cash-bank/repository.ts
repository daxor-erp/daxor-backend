import type { FilterQuery } from 'mongoose';
import { MongoBaseRepository } from '../base/mongo-repository';
import {
  BankAccount,
  BankStatementLine,
  CashBank,
  ReconciliationRule,
  type ICashBank,
  type IBankAccount,
  type IBankStatementLine,
  type IReconciliationRule,
} from './model';

export type CashBankListFilters = {
  reconciliationStatus?: string;
  bankAccount?: string;
};

export class CashBankRepository extends MongoBaseRepository<ICashBank> {
  constructor() {
    super(CashBank);
  }

  async findByOrganization(organizationId: string, filters?: CashBankListFilters) {
    const q: FilterQuery<ICashBank> = { organizationId, isDeleted: false } as FilterQuery<ICashBank>;
    if (filters?.reconciliationStatus) {
      q.reconciliationStatus = filters.reconciliationStatus;
    }
    if (filters?.bankAccount) {
      q.bankAccount = filters.bankAccount;
    }
    return this.findAll(q as any);
  }
}

export class BankAccountRepository extends MongoBaseRepository<IBankAccount> {
  constructor() {
    super(BankAccount);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}

export class BankStatementLineRepository extends MongoBaseRepository<IBankStatementLine> {
  constructor() {
    super(BankStatementLine);
  }

  async findByOrgAndAccount(organizationId: string, bankAccount: string, onlyUnmatched?: boolean) {
    const f: FilterQuery<IBankStatementLine> = {
      organizationId,
      bankAccount,
      isDeleted: false,
    } as FilterQuery<IBankStatementLine>;
    if (onlyUnmatched) {
      f.isMatched = false;
    }
    return this.model.find(f as any).sort({ lineDate: -1, createdAt: -1 }).exec();
  }
}

export class ReconciliationRuleRepository extends MongoBaseRepository<IReconciliationRule> {
  constructor() {
    super(ReconciliationRule);
  }

  async findByOrganization(organizationId: string) {
    return this.model
      .find({ organizationId, isDeleted: false } as FilterQuery<IReconciliationRule>)
      .sort({ priority: 1, name: 1 })
      .exec();
  }
}
