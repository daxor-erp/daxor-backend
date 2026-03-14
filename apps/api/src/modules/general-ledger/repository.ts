import { MongoBaseRepository } from '../base/mongo-repository';
import { GeneralLedger, ChartOfAccounts, IGeneralLedger, IChartOfAccounts } from './model';

export class GeneralLedgerRepository extends MongoBaseRepository<IGeneralLedger> {
  constructor() {
    super(GeneralLedger);
  }

  async findByFiscalYear(organizationId: string, fiscalYear: string) {
    return this.findAll({ organizationId, fiscalYear, isDeleted: false } as any);
  }

  async findByReferenceModule(organizationId: string, referenceModule: string, referenceId: string) {
    return this.findAll({ organizationId, referenceModule, referenceId, isDeleted: false } as any);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}

export class ChartOfAccountsRepository extends MongoBaseRepository<IChartOfAccounts> {
  constructor() {
    super(ChartOfAccounts);
  }

  async findByAccountType(organizationId: string, accountType: string) {
    return this.findAll({ organizationId, accountType, isDeleted: false, isActive: true } as any);
  }

  async findByAccountCode(organizationId: string, accountCode: string) {
    return this.findOne({ organizationId, accountCode, isDeleted: false } as any);
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any);
  }
}
