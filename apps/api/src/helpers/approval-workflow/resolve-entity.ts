import { GraphQLValidationError } from '@repo/errors'
import {
	APPROVAL_ENTITY_CUSTOMER_INVOICE,
	APPROVAL_ENTITY_LEAD,
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
} from './constants'
import type { ApprovalDecision, ApprovalWorkflowDeps } from './types'

export async function applyApprovalDecisionToEntity(
	deps: ApprovalWorkflowDeps,
	entityType: string,
	entityId: string,
	decision: ApprovalDecision,
	decidedByUserId: string,
): Promise<void> {
	if (entityType === APPROVAL_ENTITY_PURCHASE_ORDER) {
		if (decision === 'APPROVED') await deps.purchaseOrderService.approve(entityId, decidedByUserId)
		else await deps.purchaseOrderService.reject(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_SALES_ORDER) {
		if (decision === 'APPROVED') await deps.salesOrderService.approve(entityId, decidedByUserId)
		else await deps.salesOrderService.reject(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_SALES_ENQUIRY) {
		if (decision === 'APPROVED') await deps.salesEnquiryService.approveApproval(entityId, decidedByUserId)
		else await deps.salesEnquiryService.declineApproval(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_MODULE_WORKSPACE) {
		if (decision === 'APPROVED') await deps.moduleWorkspaceService.markApproved(entityId, decidedByUserId)
		else await deps.moduleWorkspaceService.markRejected(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_QUOTATION) {
		if (decision === 'APPROVED') await deps.quotationService.approveApproval(entityId, decidedByUserId)
		else await deps.quotationService.declineApproval(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_CUSTOMER_INVOICE) {
		if (decision === 'APPROVED') await deps.customerInvoiceService.approveApproval(entityId, decidedByUserId)
		else await deps.customerInvoiceService.declineApproval(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_LEAD) {
		if (decision === 'APPROVED') await deps.leadService.approveFromQueue(entityId)
		else await deps.leadService.rejectFromQueue(entityId)
		return
	}
	if (entityType === APPROVAL_ENTITY_PAYROLL_UI_RECORD) {
		if (decision === 'APPROVED') await deps.payrollUiRecordService.approveFromQueue(entityId)
		else await deps.payrollUiRecordService.declineFromQueue(entityId)
		return
	}
	if (entityType === APPROVAL_ENTITY_PAYROLL_MANAGEMENT) {
		if (decision === 'APPROVED') await deps.payrollManagementService.approveApproval(entityId)
		else await deps.payrollManagementService.declineApproval(entityId)
		return
	}
	if (entityType === APPROVAL_ENTITY_VENDOR_BILL) {
		if (decision === 'APPROVED') await deps.vendorBillService.approveFromApprovalQueue(entityId, decidedByUserId)
		else await deps.vendorBillService.declineFromApprovalQueue(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_VENDOR) {
		if (decision === 'APPROVED') await deps.vendorService.approveFromApprovalQueue(entityId, decidedByUserId)
		else await deps.vendorService.declineFromApprovalQueue(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_PROJECT) {
		if (decision === 'APPROVED') await deps.projectService.approveFromApprovalQueue(entityId, decidedByUserId)
		else await deps.projectService.declineFromApprovalQueue(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_SALES_RETURN) {
		if (decision === 'APPROVED') await deps.salesReturnService.approveApproval(entityId, decidedByUserId)
		else await deps.salesReturnService.declineApproval(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_DELIVERY_CHALLAN) {
		if (decision === 'APPROVED') await deps.deliveryChallanService.approveApproval(entityId, decidedByUserId)
		else await deps.deliveryChallanService.declineApproval(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_GRN) {
		if (decision === 'APPROVED') await deps.grnService.approveFromApprovalQueue(entityId, decidedByUserId)
		else await deps.grnService.declineFromApprovalQueue(entityId, decidedByUserId)
		return
	}
	if (entityType === APPROVAL_ENTITY_MATERIAL_RECEIPT) {
		if (decision === 'APPROVED')
			await deps.materialReceiptService.approveFromApprovalQueue(entityId, decidedByUserId)
		else await deps.materialReceiptService.declineFromApprovalQueue(entityId, decidedByUserId)
		return
	}
	throw new GraphQLValidationError(`Unsupported entity type: ${entityType}`)
}
