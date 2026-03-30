import { ProductRepository } from './repository'

export class ProductService {
  private repository: ProductRepository

  constructor() {
    this.repository = new ProductRepository()
  }

  async createProduct(data: any, userId: string) {
    return this.repository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async getProductById(id: string) {
    return this.repository.findById(id)
  }

  async getProductsByOrganization(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getProductBySku(sku: string, organizationId: string) {
    return this.repository.findBySku(sku, organizationId)
  }

  async getProductsByCategory(category: string, organizationId: string) {
    return this.repository.findByCategory(category, organizationId)
  }

  async getProductsByStatus(status: string, organizationId: string) {
    return this.repository.findByStatus(status, organizationId)
  }

  async getAllProducts() {
    return this.repository.findAll({ deletedAt: null })
  }

  async updateProduct(id: string, data: any, userId: string) {
    return this.repository.update(id, {
      ...data,
      updatedBy: userId,
      updatedAt: new Date(),
    })
  }

  async deleteProduct(id: string) {
    return this.repository.softDelete(id)
  }
}
