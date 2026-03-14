import { MongoBaseRepository, IBaseEntity } from '../base/mongo-repository'
import { Product } from './model'

interface IProductDocument extends IBaseEntity {
  seqNo?: string
  name: string
  sku: string
  description?: string
  category?: string
  brand?: string
  unit: string
  price: number
  costPrice?: number
  taxRate?: number
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  barcode?: string
  images?: string[]
  specifications?: Map<string, string>
  status: string
  organizationId: any
}

export class ProductRepository extends MongoBaseRepository<IProductDocument> {
  constructor() {
    super(Product as any)
  }

  async findByOrganization(organizationId: string) {
    return this.model.find({ organizationId, deletedAt: null })
  }

  async findBySku(sku: string, organizationId: string) {
    return this.model.findOne({ sku, organizationId, deletedAt: null })
  }

  async findByCategory(category: string, organizationId: string) {
    return this.model.find({ category, organizationId, deletedAt: null })
  }

  async findByStatus(status: string, organizationId: string) {
    return this.model.find({ status, organizationId, deletedAt: null })
  }
}
