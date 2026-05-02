import { MongoBaseRepository } from '../base/mongo-repository'
import { LoanRepayment, ILoanRepayment } from './model'

export class LoanRepaymentRepository extends MongoBaseRepository<ILoanRepayment> {
  constructor() {
    super(LoanRepayment)
  }

  async findByOrganization(organizationId: string) {
    return this.findAll({ organizationId, isDeleted: false } as any)
  }
}
