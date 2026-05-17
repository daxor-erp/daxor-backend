import { GraphQLAuthError, GraphQLValidationError } from '@repo/errors'
import { ApprovalRequestRepository } from './repository'
import { OrganizationService } from '../organization/service'
import { UserService } from '../user/service'
import { PurchaseOrderService } from '../purchase-order/service'
import { SalesOrderService } from '../sales-order/service'
import { ModuleWorkspaceRecordService } from '../module-workspace-record/service'
import { QuotationService } from '../quotation/service'
import { CustomerInvoiceService } from '../customer-invoice/service'
import { LeadService } from '../lead/service'
import { PayrollUiRecordService } from '../payroll-ui-record/service'
import { PayrollManagementService } from '../payroll-management/service'
import { VendorBillService } from '../vendor-bill/service'
import { SalesEnquiryService } from '../sales-enquiry/service'
import { VendorService } from '../vendor/service'
import { ProjectService } from '../project/service'
import { SalesReturnService } from '../sales-return/service'
import { DeliveryChallanService } from '../delivery-challan/service'
import { GRNService } from '../grn/service'
import { MaterialReceiptService } from '../material-receipt/service'
import { NotificationService } from '../notification/service'
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
	MODULE_KEY_PURCHASES,
	type ApprovalDecision,
	type ApprovalWorkflowDeps,
	ensureApproverConfigured as ensureApproverConfiguredHelper,
	handleApprovalResolution,
	initiateApprovalWorkflow,
} from '~/helpers/approval-workflow'

export {
	APPROVAL_ENTITY_PURCHASE_ORDER,
	APPROVAL_ENTITY_SALES_ORDER,
	APPROVAL_ENTITY_SALES_ENQUIRY,
	APPROVAL_ENTITY_MODULE_WORKSPACE,
	APPROVAL_ENTITY_QUOTATION,
	APPROVAL_ENTITY_CUSTOMER_INVOICE,
	APPROVAL_ENTITY_LEAD,
	APPROVAL_ENTITY_PAYROLL_UI_RECORD,
	APPROVAL_ENTITY_PAYROLL_MANAGEMENT,
	APPROVAL_ENTITY_VENDOR_BILL,
	APPROVAL_ENTITY_VENDOR,
	APPROVAL_ENTITY_PROJECT,
	APPROVAL_ENTITY_SALES_RETURN,
	APPROVAL_ENTITY_DELIVERY_CHALLAN,
	APPROVAL_ENTITY_GRN,
	APPROVAL_ENTITY_MATERIAL_RECEIPT,
	MODULE_KEY_PURCHASES,
	MODULE_KEY_SALES,
	MODULE_KEY_QUOTATIONS,
	MODULE_KEY_PAYROLL,
	MODULE_KEY_PAYABLES,
} from '~/helpers/approval-workflow/constants'

export type { ApprovalDecision } from '~/helpers/approval-workflow/types'

export class ApprovalRequestService {
	private deps: ApprovalWorkflowDeps

	constructor() {
		this.deps = {
			repository: new ApprovalRequestRepository(),
			organizationService: new OrganizationService(),
			userService: new UserService(),
			purchaseOrderService: new PurchaseOrderService(),
			salesOrderService: new SalesOrderService(),
			moduleWorkspaceService: new ModuleWorkspaceRecordService(),
			quotationService: new QuotationService(),
			customerInvoiceService: new CustomerInvoiceService(),
			leadService: new LeadService(),
			payrollUiRecordService: new PayrollUiRecordService(),
			payrollManagementService: new PayrollManagementService(),
			vendorBillService: new VendorBillService(),
			salesEnquiryService: new SalesEnquiryService(),
			vendorService: new VendorService(),
			projectService: new ProjectService(),
			salesReturnService: new SalesReturnService(),
			deliveryChallanService: new DeliveryChallanService(),
			grnService: new GRNService(),
			materialReceiptService: new MaterialReceiptService(),
			notificationService: new NotificationService(),
		}
	}

	async ensureApproverConfigured(organizationId: string, moduleKey: string): Promise<void> {
		await ensureApproverConfiguredHelper(this.deps, organizationId, moduleKey)
	}

	async findPendingByEntity(entityType: string, entityId: string): Promise<any | null> {
		return this.deps.repository.findPendingForEntity(entityType, entityId)
	}

	async listPendingForAssignee(assigneeUserId: string): Promise<any[]> {
		return this.deps.repository.listPendingForAssignee(assigneeUserId)
	}

	async listForUser(
		userId: string,
		opts: { status?: string; role?: 'REQUESTER' | 'APPROVER' | 'ANY'; limit?: number; skip?: number } = {},
	): Promise<any[]> {
		return this.deps.repository.listForUser(userId, opts)
	}

	async ensureApproverConfiguredForPurchases(organizationId: string): Promise<void> {
		await this.ensureApproverConfigured(organizationId, MODULE_KEY_PURCHASES)
	}

	async enqueuePurchaseOrderSubmitted(poId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_PURCHASE_ORDER,
				entityId: poId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueSalesOrderSubmitted(soId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_SALES_ORDER,
				entityId: soId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueSalesEnquirySubmitted(enquiryId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_SALES_ENQUIRY,
				entityId: enquiryId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueModuleWorkspaceRecord(recordId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_MODULE_WORKSPACE,
				entityId: recordId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueQuotationSubmitted(qId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_QUOTATION,
				entityId: qId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueCustomerInvoiceSubmitted(invId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_CUSTOMER_INVOICE,
				entityId: invId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueuePayrollUiRecordSubmitted(recId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_PAYROLL_UI_RECORD,
				entityId: recId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueuePayrollManagementSubmitted(pmId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_PAYROLL_MANAGEMENT,
				entityId: pmId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueVendorBillSubmitted(billId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_VENDOR_BILL,
				entityId: billId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueVendorSubmitted(vendorId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_VENDOR,
				entityId: vendorId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueProjectSubmitted(projectId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_PROJECT,
				entityId: projectId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueSalesReturnSubmitted(returnId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_SALES_RETURN,
				entityId: returnId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueDeliveryChallanSubmitted(challanId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_DELIVERY_CHALLAN,
				entityId: challanId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueGRNSubmitted(grnId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_GRN,
				entityId: grnId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async enqueueMaterialReceiptSubmitted(receiptId: string, requesterUserId: string): Promise<any> {
		return initiateApprovalWorkflow(
			{
				action: 'SUBMIT',
				entityType: APPROVAL_ENTITY_MATERIAL_RECEIPT,
				entityId: receiptId,
				requesterUserId,
			},
			this.deps,
		)
	}

	async resolveRequest(
		id: string,
		decision: ApprovalDecision,
		ctxUserId: string,
		isOrgAdminUser: boolean,
		note?: string | null,
	): Promise<any> {
		const row = await this.deps.repository.findById(id)
		if (!row || String(row.status) !== 'PENDING') {
			throw new GraphQLValidationError('Approval request not found or already resolved.')
		}

		const ctxMember = await this.deps.userService.findById(ctxUserId)
		if (!ctxMember || ctxMember.deletedAt) throw new GraphQLAuthError('Forbidden')
		const sameOrg = String(ctxMember.organizationId ?? '') === String(row.organizationId)
		if (!sameOrg) throw new GraphQLAuthError('Forbidden')

		const isAssignee = String(row.assigneeApproverUserId) === String(ctxUserId)
		if (!isAssignee && !isOrgAdminUser) {
			throw new GraphQLAuthError('You are not the assigned approver for this request.')
		}

		const entityType = String(row.entityType)
		const entityId = String(row.entityId)

		await handleApprovalResolution(this.deps, entityType, entityId, decision, ctxUserId)

		const now = new Date()
		await this.deps.repository.update(id, {
			status: decision,
			decidedByUserId: ctxUserId,
			decidedAt: now,
			resolutionNote: note ?? undefined,
			updatedAt: now,
		})

		// Best-effort notification to the original requester.
		try {
			const decider = await this.deps.userService.findById(ctxUserId)
			const deciderName = decider
				? `${decider.firstName ?? ''} ${decider.lastName ?? ''}`.trim() || decider.email
				: 'An approver'
			const isApproved = decision === 'APPROVED'
			await this.deps.notificationService.notify({
				organizationId: String(row.organizationId),
				recipientUserId: String(row.requesterUserId),
				actorUserId: String(ctxUserId),
				kind: isApproved ? 'APPROVAL_APPROVED' : 'APPROVAL_REJECTED',
				severity: isApproved ? 'SUCCESS' : 'DANGER',
				title: isApproved
					? `Approved: ${row.title}`
					: `Rejected: ${row.title}`,
				message: note
					? `${deciderName} ${isApproved ? 'approved' : 'rejected'} your request. Note: ${note}`
					: `${deciderName} ${isApproved ? 'approved' : 'rejected'} your request.`,
				link: '/notifications',
				referenceModule: 'approval-request',
				referenceId: String(row._id ?? row.id ?? id),
				moduleKey: String(row.moduleKey ?? ''),
			})
		} catch {
			// swallowed — notifications are best-effort
		}

		return this.deps.repository.findById(id)
	}
}
