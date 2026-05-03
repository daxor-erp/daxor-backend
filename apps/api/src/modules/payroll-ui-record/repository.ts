import { MongoBaseRepository } from '../base/mongo-repository'
import { PayrollUiRecord, IPayrollUiRecord } from './model'

export class PayrollUiRecordRepository extends MongoBaseRepository<IPayrollUiRecord> {
  constructor() {
    super(PayrollUiRecord)
  }

  async findByOrgAndCategory(organizationId: string, category: string) {
    return this.findAll({ organizationId, category, isDeleted: false } as any)
  }
}
