import { MongoBaseRepository } from '../base/mongo-repository'
import { IntercompanyTransfer } from './model'

export class IntercompanyTransferRepository extends MongoBaseRepository<any> {
  constructor() {
    super(IntercompanyTransfer as any)
  }

  async findByOrg(organizationId: string, page = 1, limit = 100) {
    return this.findPaginated({ organizationId, deletedAt: null }, page, limit, {
      createdAt: -1,
    })
  }
}
