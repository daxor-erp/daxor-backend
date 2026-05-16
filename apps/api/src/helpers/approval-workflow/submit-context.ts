import { GraphQLValidationError } from '@repo/errors'
import {
	APPROVAL_ENTITY_CUSTOMER_INVOICE,
	APPROVAL_ENTITY_MODULE_WORKSPACE,
	APPROVAL_ENTITY_PAYROLL_UI_RECORD,
	APPROVAL_ENTITY_PAYROLL_MANAGEMENT,
	APPROVAL_ENTITY_VENDOR_BILL,
	APPROVAL_ENTITY_VENDOR,
	APPROVAL_ENTITY_PROJECT,
	APPROVAL_ENTITY_SALES_RETURN,
	APPROVAL_ENTITY_DELIVERY_CHALLAN,
	APPROVAL_ENTITY_GRN,
	APPROVAL_ENTITY_MATERIAL_RECEIPT,
	APPROVAL_ENTITY_PURCHASE_ORDER,
	APPROVAL_ENTITY_QUOTATION,
	APPROVAL_ENTITY_SALES_ENQUIRY,
	APPROVAL_ENTITY_SALES_ORDER,
	MODULE_KEY_PAYABLES,
	MODULE_KEY_PAYROLL,
	MODULE_KEY_PURCHASES,
	MODULE_KEY_QUOTATIONS,
	MODULE_KEY_SALES,
} from './constants'
import { deriveSalesEnquiryWorkflowStatus, RECORD_APPROVAL_PENDING } from './record-approval-status'
import type { ApprovalWorkflowDeps, PendingApprovalCreateOpts } from './types'

type SubmitPayload = Omit<PendingApprovalCreateOpts, 'requesterUserId'>

export async function buildPendingPayloadForSubmit(
	entityType: string,
	entityId: string,
	deps: ApprovalWorkflowDeps,
): Promise<SubmitPayload> {
	switch (entityType) {
		case APPROVAL_ENTITY_PURCHASE_ORDER: {
			const po = await deps.purchaseOrderService.findById(entityId)
			if (!po || po.deletedAt) throw new GraphQLValidationError('Purchase order not found')
			if (String(po.status) !== 'submitted') {
				throw new GraphQLValidationError('Purchase order must be submitted before approval routing')
			}
			const title = `Purchase order ${po.seqNo || entityId} — approval requested`
			return {
				organizationId: po.organizationId,
				moduleKey: MODULE_KEY_PURCHASES,
				entityType,
				entityId: po._id ?? po.id,
				title,
			}
		}
		case APPROVAL_ENTITY_SALES_ENQUIRY: {
			const enq = await deps.salesEnquiryService.findById(entityId)
			if (!enq || enq.deletedAt) throw new GraphQLValidationError('Sales enquiry not found')
			if (deriveSalesEnquiryWorkflowStatus(enq) !== RECORD_APPROVAL_PENDING) {
				throw new GraphQLValidationError('Sales enquiry must be pending approval before routing')
			}
			const ref = enq.enquiryNumber ?? enq.seqNo ?? entityId
			const subj = enq.subject ? ` — ${String(enq.subject)}` : ''
			const title = `Sales enquiry ${ref}${subj} — approval requested`
			return {
				organizationId: enq.organizationId,
				moduleKey: MODULE_KEY_SALES,
				entityType,
				entityId: enq._id ?? enq.id,
				title,
			}
		}
		case APPROVAL_ENTITY_SALES_ORDER: {
			const so = await deps.salesOrderService.findById(entityId)
			if (!so || (so as any).deletedAt) throw new GraphQLValidationError('Sales order not found')
			if ((so as any).cashSale === true) {
				throw new GraphQLValidationError('Cash sales are not routed through this approval flow.')
			}
			if (String((so as any).status) !== 'submitted') {
				throw new GraphQLValidationError('Sales order must be submitted before approval routing')
			}
			const seq = (so as any).seqNo ?? (so as any).salesOrderNumber ?? entityId
			const title = `Sales order ${seq} — approval requested`
			return {
				organizationId: (so as any).organizationId,
				moduleKey: MODULE_KEY_SALES,
				entityType,
				entityId: (so as any)._id ?? (so as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_MODULE_WORKSPACE: {
			const row = await deps.moduleWorkspaceService.findById(entityId)
			if (!row || row.deletedAt) throw new GraphQLValidationError('Workspace record not found')
			if (String(row.status) !== 'pending_approval') {
				throw new GraphQLValidationError('Workspace record must be pending approval before routing')
			}
			const mk = String(row.approvalModuleKey)
			const titleBase = String(row.title || 'Workspace item')
			return {
				organizationId: row.organizationId,
				moduleKey: mk,
				entityType,
				entityId: row._id ?? row.id,
				title: `${titleBase} — approval requested`,
			}
		}
		case APPROVAL_ENTITY_QUOTATION: {
			const q = await deps.quotationService.getQuotationById(entityId)
			if (!q || q.deletedAt) throw new GraphQLValidationError('Quotation not found')
			if (String(q.status) !== 'submitted') {
				throw new GraphQLValidationError('Quotation must be submitted before approval routing')
			}
			const num = q.quotationNumber ?? entityId
			const title = `Quotation ${num} — approval requested`
			return {
				organizationId: q.organizationId,
				moduleKey: MODULE_KEY_QUOTATIONS,
				entityType,
				entityId: q._id ?? q.id,
				title,
			}
		}
		case APPROVAL_ENTITY_CUSTOMER_INVOICE: {
			const inv = await deps.customerInvoiceService.findById(entityId)
			if (!inv || (inv as any).deletedAt) throw new GraphQLValidationError('Invoice not found')
			if (String((inv as any).status) !== 'submitted') {
				throw new GraphQLValidationError('Invoice must be submitted before approval routing')
			}
			const num = (inv as any).seqNo ?? (inv as any).invoiceNumber ?? entityId
			const title = `Customer invoice ${num} — approval requested`
			return {
				organizationId: (inv as any).organizationId,
				moduleKey: MODULE_KEY_SALES,
				entityType,
				entityId: (inv as any)._id ?? (inv as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_PAYROLL_UI_RECORD: {
			const row = await deps.payrollUiRecordService.getById(entityId)
			if (!row) throw new GraphQLValidationError('Payroll record not found')
			if (String((row as any).approvalStatus) !== 'pending') {
				throw new GraphQLValidationError('Payroll record must be pending before approval routing')
			}
			const cat = String((row as any).category ?? '')
			const code = (row as any).code ? ` ${(row as any).code}` : ''
			const title = `Payroll ${cat}${code} — approval requested`
			return {
				organizationId: (row as any).organizationId,
				moduleKey: MODULE_KEY_PAYROLL,
				entityType,
				entityId: (row as any)._id ?? (row as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_PAYROLL_MANAGEMENT: {
			const row = await deps.payrollManagementService.getById(entityId)
			if (!row) throw new GraphQLValidationError('Payroll management record not found')
			if (String((row as any).status ?? '').toUpperCase() !== 'SUBMITTED') {
				throw new GraphQLValidationError('Payroll run must be submitted before approval routing')
			}
			const ref = (row as any).docNumber ?? entityId
			const ttl = (row as any).title ? ` — ${String((row as any).title)}` : ''
			const title = `Payroll management ${ref}${ttl} — approval requested`
			return {
				organizationId: (row as any).organizationId,
				moduleKey: MODULE_KEY_PAYROLL,
				entityType,
				entityId: (row as any)._id ?? (row as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_VENDOR_BILL: {
			const bill = await deps.vendorBillService.getBillById(entityId)
			if (!bill || (bill as any).deletedAt) throw new GraphQLValidationError('Vendor bill not found')
			if (String((bill as any).status) !== 'submitted') {
				throw new GraphQLValidationError('Vendor bill must be submitted before approval routing')
			}
			const num = (bill as any).billNumber ?? entityId
			const title = `Vendor bill ${num} — approval requested`
			return {
				organizationId: (bill as any).organizationId,
				moduleKey: MODULE_KEY_PAYABLES,
				entityType,
				entityId: (bill as any)._id ?? (bill as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_VENDOR: {
			const v = await deps.vendorService.getVendorById(entityId)
			if (!v || (v as any).deletedAt) throw new GraphQLValidationError('Vendor not found')
			const ap = String((v as any).orgApprovalStatus ?? 'approved')
			if (ap !== 'submitted') {
				throw new GraphQLValidationError('Vendor must be submitted before approval routing')
			}
			const code = (v as any).seqNo ?? entityId
			const title = `Vendor ${code} — ${String((v as any).name ?? '').trim() || 'approval requested'}`
			return {
				organizationId: (v as any).organizationId,
				moduleKey: MODULE_KEY_PURCHASES,
				entityType,
				entityId: (v as any)._id ?? (v as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_PROJECT: {
			const p = await deps.projectService.findById(entityId)
			if (!p || (p as any).deletedAt) throw new GraphQLValidationError('Project not found')
			const ap = String((p as any).orgApprovalStatus ?? 'approved')
			if (ap !== 'submitted') {
				throw new GraphQLValidationError('Project must be submitted before approval routing')
			}
			const code = (p as any).seqNo ?? entityId
			const title = `Project ${code} — ${String((p as any).name ?? '').trim() || 'approval requested'}`
			return {
				organizationId: (p as any).organizationId,
				moduleKey: MODULE_KEY_PURCHASES,
				entityType,
				entityId: (p as any)._id ?? (p as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_SALES_RETURN: {
			const row = await deps.salesReturnService.getById(entityId)
			if (!row || (row as any).isDeleted) throw new GraphQLValidationError('Sales return not found')
			if (String((row as any).status) !== 'SUBMITTED') {
				throw new GraphQLValidationError('Sales return must be submitted before approval routing')
			}
			const title = `Sales return ${(row as any).docNumber ?? entityId} — approval requested`
			return {
				organizationId: (row as any).organizationId,
				moduleKey: MODULE_KEY_SALES,
				entityType,
				entityId: (row as any)._id ?? (row as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_DELIVERY_CHALLAN: {
			const row = await deps.deliveryChallanService.getById(entityId)
			if (!row || (row as any).isDeleted) throw new GraphQLValidationError('Delivery challan not found')
			if (String((row as any).status) !== 'SUBMITTED') {
				throw new GraphQLValidationError('Delivery challan must be submitted before approval routing')
			}
			const title = `Delivery challan ${(row as any).docNumber ?? entityId} — approval requested`
			return {
				organizationId: (row as any).organizationId,
				moduleKey: MODULE_KEY_SALES,
				entityType,
				entityId: (row as any)._id ?? (row as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_GRN: {
			const row = await deps.grnService.getGRNById(entityId)
			if (!row || (row as any).deletedAt) throw new GraphQLValidationError('GRN not found')
			if (String((row as any).status) !== 'submitted') {
				throw new GraphQLValidationError('GRN must be submitted before approval routing')
			}
			const title = `GRN ${(row as any).grnNumber ?? entityId} — approval requested`
			return {
				organizationId: (row as any).organizationId,
				moduleKey: MODULE_KEY_PURCHASES,
				entityType,
				entityId: (row as any)._id ?? (row as any).id,
				title,
			}
		}
		case APPROVAL_ENTITY_MATERIAL_RECEIPT: {
			const row = await deps.materialReceiptService.getById(entityId)
			if (!row || (row as any).deletedAt) throw new GraphQLValidationError('Material receipt not found')
			if (String((row as any).status) !== 'submitted') {
				throw new GraphQLValidationError('Material receipt must be submitted before approval routing')
			}
			const title = `Material receipt ${(row as any).mrnNumber ?? entityId} — approval requested`
			return {
				organizationId: (row as any).organizationId,
				moduleKey: MODULE_KEY_PURCHASES,
				entityType,
				entityId: (row as any)._id ?? (row as any).id,
				title,
			}
		}
		default:
			throw new GraphQLValidationError(`Unsupported entity type for approval submit: ${entityType}`)
	}
}
