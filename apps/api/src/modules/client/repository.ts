import { MongoBaseRepository } from '../base/mongo-repository'
import { Client } from './model'

export class ClientRepository extends MongoBaseRepository<any> {
	constructor() {
		super(Client)
	}

	async findByEmail(email: string): Promise<any | null> {
		return this.findOne({ email, deletedAt: null })
	}

	async findByOrganization(organizationId: string): Promise<any[]> {
		return this.findAllActive({ organizationId })
	}

	async findByStatus(status: string): Promise<any[]> {
		return this.findAllActive({ status })
	}
import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Client } from './model'

interface IClientDocument extends IBaseEntity {
  seqNo?: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  website?: string
  industry?: string
  notes?: string
  status: string
  organizationId: any
}

export class ClientRepository extends MongoBaseRepository<IClientDocument> {
  constructor() {
    super(Client as any)
  }

  async findByOrganization(organizationId: string) {
    return this.model.find({ organizationId, deletedAt: null })
  }

  async findByEmail(email: string, organizationId: string) {
    return this.model.findOne({ email, organizationId, deletedAt: null })
  }

  async findByStatus(status: string, organizationId: string) {
    return this.model.find({ status, organizationId, deletedAt: null })
  }
}
