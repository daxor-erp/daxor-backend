import { PurchaseOrderService } from './service'
import type { GraphQLContext } from '~/types/graphql.context'
import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import { assertAuthenticated, isOrgAdmin } from '../auth/authz'
import { ApprovalRequestService, APPROVAL_ENTITY_PURCHASE_ORDER } from '../approval-request/service'
import { VendorService } from '../vendor/service'
import { ProductService } from '../product/service'
import { ProductVariantService } from '../product-variant/service'
import { UomService } from '../uom/service'
import { TaxRateService } from '../tax-rate/service'
import { OrganizationService } from '../organization/service'
import { PaymentTermService } from '../payment-term/service'
import { UserService } from '../user/service'
import { WarehouseService } from '../warehouse/service'
import { sendPurchaseOrderEmailToVendor } from './purchase-order-email'

const service = new PurchaseOrderService()
const approvalService = new ApprovalRequestService()
const vendorService = new VendorService()
const productService = new ProductService()
const variantService = new ProductVariantService()
const uomService = new UomService()
const taxRateService = new TaxRateService()
const organizationService = new OrganizationService()
const paymentTermService = new PaymentTermService()
const userService = new UserService()
const warehouseService = new WarehouseService()

function iso(d: unknown): string | null {
  if (d == null) return null
  const t = new Date(d as string).getTime()
  if (Number.isNaN(t)) return null
  return new Date(t).toISOString()
}

export const resolvers = {
  Query: {
    purchaseorder: (_: unknown, { id }: { id: string }) => service.findById(id),
    purchaseorders: async (_: unknown, args: any) => {
      const { organizationId, page = 1, limit = 100, status } = args
      const filter: any = { organizationId, deletedAt: null }
      if (status) filter.status = status
      const result = await service.findWithPagination(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' })
      return result.data
    },
  },
  Mutation: {
    createPurchaseOrder: (_: unknown, { input }: any, ctx: GraphQLContext) =>
      service.create(input, ctx.user?.id ?? ''),

    createPurchaseRequisition: async (_: unknown, { input }: any, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const orgId = ctx.user?.organizationId
      if (orgId == null || String(orgId) === '') {
        throw new GraphQLAuthError('Organization context required')
      }
      if (String(input.organizationId) !== String(orgId)) {
        throw new GraphQLAuthError('Forbidden')
      }
      await approvalService.ensureApproverConfiguredForPurchases(String(orgId))
      const created = await service.create(input, ctx.user!.id)
      const poId = String(created._id ?? created.id)
      await service.submit(poId, ctx.user!.id)
      await approvalService.enqueuePurchaseOrderSubmitted(poId, ctx.user!.id)
      return service.findById(poId)
    },

    updatePurchaseOrder: (_: unknown, { id, input }: any, ctx: GraphQLContext) =>
      service.update(id, input, ctx.user?.id),

    deletePurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await service.softDelete(id, ctx.user?.id ?? '')
      return true
    },

    /** Optional "Print RFQ / Send by Email" step prior to formal submission. */
    markPurchaseOrderRfqSent: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.markRfqSent(id, ctx.user!.id)
    },

    /** Standalone "Print RFQ" action — distinct from Send by Email; does not change status. */
    markPurchaseOrderPrinted: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.markPrinted(id, ctx.user!.id)
    },

    submitPurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const poBefore = await service.findById(id)
      if (!poBefore || poBefore.deletedAt) throw new GraphQLAuthError('Purchase order not found')
      await approvalService.ensureApproverConfiguredForPurchases(String(poBefore.organizationId))
      const submitted = await service.submit(id, ctx.user!.id)
      await approvalService.enqueuePurchaseOrderSubmitted(id, ctx.user!.id)
      return submitted
    },

    approvePurchaseOrder: async (
      _: unknown,
      { id, vendorId }: { id: string; vendorId?: string | null },
      ctx: GraphQLContext,
    ) => {
      assertAuthenticated(ctx)
      const pending = await approvalService.findPendingByEntity(APPROVAL_ENTITY_PURCHASE_ORDER, id)
      if (pending) {
        const isAssignee = String(pending.assigneeApproverUserId) === String(ctx.user!.id)
        if (!isAssignee && !isOrgAdmin(ctx)) {
          throw new GraphQLAuthError(
            'Only the designated approver (or organization admin) can approve this PO.',
          )
        }
      }
      return service.approve(id, ctx.user!.id, vendorId)
    },

    /** RFQ (approved) -> Purchase Order — assigns the final confirmation date. */
    confirmPurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.confirmOrder(id, ctx.user!.id)
    },

    /** Send PO by Email with PDF attached — purchase_order -> sent. */
    sendPurchaseOrderByEmail: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      const po = await service.findById(id)
      if (!po || po.deletedAt) throw new GraphQLAuthError('Purchase order not found')
      const [organization, vendor] = await Promise.all([
        organizationService.findById(String(po.organizationId)),
        po.vendorId ? vendorService.getVendorById(String(po.vendorId)) : null,
      ])
      await sendPurchaseOrderEmailToVendor(po as any, organization as any, vendor as any)
      return service.markSent(id, ctx.user!.id)
    },

    receivePurchaseOrder: (
      _: unknown,
      { id, lines }: { id: string; lines?: Array<{ lineId: string; qtyReceived: number; allowOverReceipt?: boolean }> },
      ctx: GraphQLContext,
    ) => service.receive(id, ctx.user?.id ?? '', lines),

    cancelPurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.cancel(id, ctx.user!.id)
    },

    lockPurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.lock(id, ctx.user!.id)
    },

    billPurchaseOrder: (
      _: unknown,
      { id, billDate, dueDate, lines }: { id: string; billDate: string; dueDate: string; lines?: Array<{ lineId: string; quantity: number }> },
      ctx: GraphQLContext,
    ) => service.billPurchaseOrder(id, billDate, dueDate, ctx.user?.id ?? '', lines),

    closePurchaseOrderLine: async (_: unknown, { id, lineId }: { id: string; lineId: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.closeLine(id, lineId, ctx.user!.id)
    },

    duplicatePurchaseOrder: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      assertAuthenticated(ctx)
      return service.duplicate(id, ctx.user!.id)
    },
  },
  PurchaseOrder: {
    id: (p: any) => p._id || p.id,
    orderDate: (p: any) => (p.orderDate ? new Date(p.orderDate).toISOString() : new Date().toISOString()),
    orderDeadline: (p: any) => iso(p.orderDeadline),
    expectedArrival: (p: any) => iso(p.expectedArrival ?? p.deliveryDate),
    deliveryDate: (p: any) => iso(p.deliveryDate ?? p.expectedArrival),
    confirmationDate: (p: any) => iso(p.confirmationDate),
    createdAt: (p: any) => iso(p.createdAt),
    updatedAt: (p: any) => iso(p.updatedAt),
    vendorId: (p: any) => {
      if (!p.vendorId) return null
      return typeof p.vendorId === 'object' ? (p.vendorId._id?.toString() ?? p.vendorId.id) : p.vendorId?.toString()
    },
    vendor: (p: any) => {
      if (!p.vendorId) return null
      return typeof p.vendorId === 'object' ? p.vendorId : null
    },
    projectId: (p: any) => {
      if (!p.projectId) return null
      return typeof p.projectId === 'object' ? (p.projectId._id?.toString() ?? p.projectId.id) : p.projectId?.toString()
    },
    vendorName: (p: any) => {
      if (typeof p.vendorId === 'object' && p.vendorId?.name) return p.vendorId.name
      return p.vendorName || null
    },
    projectName: (p: any) => {
      if (typeof p.projectId === 'object' && p.projectId?.name) return p.projectId.name
      return p.projectName || null
    },
    deliverToLocationId: (p: any) => (p.deliverToLocationId != null ? String(p.deliverToLocationId) : null),
    deliverToLocation: async (p: any) => (p.deliverToLocationId ? warehouseService.getWarehouseById(String(p.deliverToLocationId)) : null),
    paymentTerms: (p: any) => (p.paymentTerms != null ? String(p.paymentTerms) : null),
    paymentTermsInfo: async (p: any) => (p.paymentTerms ? paymentTermService.findById(String(p.paymentTerms)) : null),
    buyerId: (p: any) => (p.buyerId != null ? String(p.buyerId) : null),
    buyer: async (p: any) => (p.buyerId ? userService.findById(String(p.buyerId)) : null),
    items: (p: any) => p.items ?? [],
    subtotal: (p: any) => p.untaxedAmount ?? p.subtotal ?? 0,
    untaxedAmount: (p: any) => p.untaxedAmount ?? p.subtotal ?? 0,
    taxAmount: (p: any) => p.taxAmount ?? 0,
    taxBreakdown: (p: any) => p.taxBreakdown ?? { cgst: 0, sgst: 0, igst: 0 },
    totalAmount: (p: any) => p.totalAmount ?? 0,
    receiptStatus: (p: any) => p.receiptStatus ?? 'not_received',
    billingStatus: (p: any) => p.billingStatus ?? 'not_billed',
    currency: (p: any) => p.currency ?? 'INR',
    exchangeRate: (p: any) => Number(p.exchangeRate ?? 1) || 1,
    totalAmountBaseCurrency: (p: any) => Number(p.totalAmountBaseCurrency ?? p.totalAmount ?? 0),
    version: (p: any) => Number(p.version ?? 0),
    askConfirmation: (p: any) => !!p.askConfirmation,
    lastPrintedAt: (p: any) => iso(p.lastPrintedAt),
    agreement: (p: any) => p.agreement ?? '',
    sourceDocument: (p: any) => p.sourceDocument ?? '',
    incoterms: (p: any) => p.incoterms ?? '',
  },
  POLineItem: {
    id: (l: any) => String(l._id ?? ''),
    lineType: (l: any) => l.lineType ?? 'product',
    productId: (l: any) => (l.productId != null ? String(l.productId) : null),
    product: async (l: any) => (l.productId ? productService.getProductById(String(l.productId)) : null),
    variantId: (l: any) => (l.variantId != null ? String(l.variantId) : null),
    variant: async (l: any) => (l.variantId ? variantService.findById(String(l.variantId)) : null),
    uomId: (l: any) => (l.uomId != null ? String(l.uomId) : null),
    uom: async (l: any) => (l.uomId ? uomService.findById(String(l.uomId)) : null),
    packagingId: (l: any) => (l.packagingId != null ? String(l.packagingId) : null),
    packaging: async (l: any) => {
      if (!l.packagingId || !l.productId) return null
      const product: any = await productService.getProductById(String(l.productId))
      const pkg = (product?.packagings ?? []).find((p: any) => String(p._id) === String(l.packagingId))
      return pkg ? { id: String(pkg._id), name: pkg.name, qtyPerPackage: pkg.qtyPerPackage ?? 1, barcode: pkg.barcode ?? '' } : null
    },
    packagingQty: (l: any) => l.packagingQty ?? 0,
    taxIds: (l: any) => (l.taxIds ?? []).map(String),
    taxes: async (l: any) =>
      Promise.all((l.taxIds ?? []).map((id: unknown) => taxRateService.findById(String(id)))).then((rows) => rows.filter(Boolean)),
    discountPercent: (l: any) => l.discountPercent ?? 0,
    lineUntaxed: (l: any) => l.lineUntaxed ?? 0,
    lineTax: (l: any) => l.lineTax ?? 0,
    lineTotal: (l: any) => l.lineTotal ?? (l.quantity ?? 0) * (l.unitPrice ?? 0),
    qtyReceived: (l: any) => l.qtyReceived ?? 0,
    qtyBilled: (l: any) => l.qtyBilled ?? 0,
    closedForReceiving: (l: any) => !!l.closedForReceiving,
    note: (l: any) => l.note ?? null,
    // legacy fields
    itemId: (l: any) => (l.itemId != null ? String(l.itemId) : null),
    itemDescription: (l: any) => l.itemDescription ?? l.productName ?? null,
  },
}
