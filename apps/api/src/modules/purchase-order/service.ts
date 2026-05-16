import { PurchaseOrderRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'
import { VendorRepository } from '../vendor/repository'
import { ProjectRepository } from '../project/repository'
import { GRNService } from '../grn/service'
import { VendorBillService } from '../vendor-bill/service'

export class PurchaseOrderService {
  private repository: PurchaseOrderRepository
  private vendorRepo: VendorRepository
  private projectRepo: ProjectRepository
  private grnService: GRNService
  private billService: VendorBillService

  constructor() {
    this.repository = new PurchaseOrderRepository()
    this.vendorRepo = new VendorRepository()
    this.projectRepo = new ProjectRepository()
    this.grnService = new GRNService()
    this.billService = new VendorBillService()
  }

  async create(data: any, userId: string): Promise<any> {
    const seq = await getNextSequence({ type: 'PurchaseOrder', organizationId: data.organizationId })
    const seqNo = formatEntitySequence('PO', data.organizationId.toString(), seq)

    // Denormalize vendor and project names for easy display
    let vendorName: string | undefined
    let projectName: string | undefined

    if (data.vendorId) {
      const vendor = await this.vendorRepo.findById(data.vendorId)
      vendorName = vendor?.name
    }

    if (data.projectId) {
      const project = await this.projectRepo.findById(data.projectId)
      projectName = project?.name
    }

    return this.repository.create({
      ...data,
      seqNo,
      vendorName,
      projectName,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async findById(id: string): Promise<any> {
    return this.repository.findById(id)
  }

  async update(id: string, data: any, userId?: string): Promise<any> {
    return this.repository.update(id, { ...data, updatedBy: userId, updatedAt: new Date() })
  }

  async findWithPagination(filter: any, options: any): Promise<any> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    return this.repository.findPaginatedWithPopulate(filter, page, limit, sort)
  }

  async submit(id: string, userId: string): Promise<any> {
    const po = await this.repository.findById(id)
    if (!po) throw new Error('Purchase order not found')
    if (po.status !== 'draft') throw new Error('Only draft POs can be submitted')
    return this.repository.update(id, { status: 'submitted', updatedBy: userId })
  }

  async approve(id: string, userId: string): Promise<any> {
    const po = await this.repository.findById(id)
    if (!po) throw new Error('Purchase order not found')
    if (po.status !== 'submitted') throw new Error('Only submitted POs can be approved')
    return this.repository.update(id, { status: 'approved', updatedBy: userId })
  }

  /** Decline after submission — returns PO to rejected state so it can be revised. */
  async reject(id: string, userId: string): Promise<any> {
    const po = await this.repository.findById(id)
    if (!po) throw new Error('Purchase order not found')
    if (po.status !== 'submitted') throw new Error('Only submitted POs can be declined')
    return this.repository.update(id, { status: 'rejected', updatedBy: userId })
  }

  async receive(id: string, userId: string): Promise<any> {
    const po = await this.repository.findById(id)
    if (!po) throw new Error('Purchase order not found')
    if (!['approved', 'sent'].includes(po.status)) throw new Error('Only approved or sent POs can be received')
    const updated = await this.repository.update(id, { status: 'received', updatedBy: userId })
    // Auto-create GRN when PO is received
    try {
      await this.grnService.createFromPO(po, userId)
    } catch (e) {
      // GRN creation failure shouldn't block PO receipt
    }
    return updated
  }

  async softDelete(id: string, userId: string): Promise<any> {
    const po = await this.repository.findById(id)
    if (!po) throw new Error('Purchase order not found')
    if (!['draft', 'cancelled', 'rejected'].includes(po.status)) throw new Error('Only draft POs can be deleted')
    return this.repository.update(id, { deletedAt: new Date(), deletedBy: userId })
  }

  async billPurchaseOrder(id: string, billDate: string, dueDate: string, userId: string): Promise<any> {
    const po = await this.repository.findById(id)
    if (!po) throw new Error('Purchase order not found')
    if (!po.vendorId) throw new Error('PO must have a vendor before billing')
    if (['draft', 'submitted'].includes(po.status)) throw new Error('PO must be approved or received before billing')

    const lineItems = (po.items || []).map((item: any) => ({
      description: item.itemDescription,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      discount: 0,
      tax: 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }))

    const subtotal = lineItems.reduce((s: number, l: any) => s + l.total, 0)

    return this.billService.createBill({
      vendorId: po.vendorId,
      purchaseOrderId: po._id || po.id,
      billDate,
      dueDate,
      lineItems,
      subtotal,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: subtotal || po.totalAmount || 0,
      notes: `Billed from PO ${po.seqNo}`,
      organizationId: po.organizationId,
    }, userId)
  }
}
