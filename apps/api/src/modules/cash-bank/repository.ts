import { MongoBaseRepository } from '../base/mongo-repository';
import { CashBank, BankAccount, ICashBank, IBankAccount } from './model';

export class CashBankRepository extends MongoBaseRepository<ICashBank> {
  constructor() {
    super(CashBank);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
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
