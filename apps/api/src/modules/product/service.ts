import { GraphQLValidationError } from '@repo/errors'
import { ProductRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'
import { ProductVariantService } from '../product-variant/service'
import { userIdForRef } from '~/lib/user-ref'

const variantService = new ProductVariantService()

type AnyRecord = Record<string, unknown>

export class ProductService {
  private repository: ProductRepository

  constructor() {
    this.repository = new ProductRepository()
  }

  async createProduct(data: AnyRecord, userId: string) {
    const name = String(data.name ?? '').trim()
    if (!name) throw new GraphQLValidationError('Product name is required')

    const organizationId = String(data.organizationId)
    const seq = await getNextSequence({ type: 'Product', organizationId })
    const seqNo = formatEntitySequence('P', organizationId, seq)

    let internalReference = data.internalReference != null ? String(data.internalReference).trim() : ''
    if (!internalReference) internalReference = seqNo

    const existing = await this.repository.findByInternalReference(internalReference, organizationId)
    if (existing) {
      throw new GraphQLValidationError(`Internal reference "${internalReference}" is already in use`)
    }

    const uid = userIdForRef(userId)
    const { attributeLines, ...rest } = data as AnyRecord & { attributeLines?: Array<{ attributeId: string; valueIds: string[] }> }

    const payload: AnyRecord = {
      ...rest,
      name,
      seqNo,
      internalReference,
      attributeLines: attributeLines ?? [],
    }
    if (uid) {
      payload.createdBy = uid
      payload.updatedBy = uid
    }

    const created = await this.repository.create(payload)
    const productId = String((created as any)._id)

    if (attributeLines?.length) {
      await variantService.regenerateForProduct(productId, organizationId, name, attributeLines)
    }

    return created
  }

  async getProductById(id: string) {
    return this.repository.findById(id)
  }

  async getProductsByOrganization(
    organizationId: string,
    filters: { search?: string; categoryId?: string; canBePurchased?: boolean; canBeSold?: boolean; status?: string } = {},
  ) {
    return this.repository.findByOrganization(organizationId, filters)
  }

  async updateProduct(id: string, data: AnyRecord, userId: string) {
    const existing = await this.repository.findById(id)
    if (!existing || (existing as any).deletedAt) throw new GraphQLValidationError('Product not found')

    const { attributeLines, ...rest } = data as AnyRecord & { attributeLines?: Array<{ attributeId: string; valueIds: string[] }> }
    const uid = userIdForRef(userId)
    const payload: AnyRecord = { ...rest }

    if (rest.internalReference != null) {
      const ref = String(rest.internalReference).trim()
      if (ref) {
        const dup = await this.repository.findByInternalReference(ref, String((existing as any).organizationId))
        if (dup && String((dup as any)._id) !== id) {
          throw new GraphQLValidationError(`Internal reference "${ref}" is already in use`)
        }
        payload.internalReference = ref
      }
    }

    if (attributeLines != null) payload.attributeLines = attributeLines
    if (uid) payload.updatedBy = uid

    const updated = await this.repository.update(id, payload)

    if (attributeLines != null) {
      const name = String(rest.name ?? (existing as any).name)
      await variantService.regenerateForProduct(id, String((existing as any).organizationId), name, attributeLines)
    }

    return updated
  }

  async deleteProduct(id: string, userId: string) {
    const uid = userIdForRef(userId)
    // Gap 12 — block deletion when open (unreceived / unbilled) POs reference this product.
    const { PurchaseOrder } = await import('../purchase-order/model')
    const openPOs = await PurchaseOrder.countDocuments({
      'items.productId': id,
      deletedAt: null,
      status: { $nin: ['billed', 'cancelled', 'rejected', 'locked'] },
    })
    if (openPOs > 0) {
      throw new GraphQLValidationError(
        `Cannot delete this product — it is referenced on ${openPOs} open Purchase Order(s). Close or cancel those orders first.`,
      )
    }
    return this.repository.update(id, {
      deletedAt: new Date(),
      ...(uid ? { deletedBy: uid } : {}),
    } as AnyRecord)
  }
}
