import type { ApprovalRequestRepository } from '~/modules/approval-request/repository'
import type { OrganizationService } from '~/modules/organization/service'
import type { UserService } from '~/modules/user/service'
import type { PurchaseOrderService } from '~/modules/purchase-order/service'
import type { SalesOrderService } from '~/modules/sales-order/service'
import type { ModuleWorkspaceRecordService } from '~/modules/module-workspace-record/service'
import type { QuotationService } from '~/modules/quotation/service'
import type { CustomerInvoiceService } from '~/modules/customer-invoice/service'
import type { LeadService } from '~/modules/lead/service'
import type { PayrollUiRecordService } from '~/modules/payroll-ui-record/service'
import type { PayrollManagementService } from '~/modules/payroll-management/service'
import type { VendorBillService } from '~/modules/vendor-bill/service'
import type { SalesEnquiryService } from '~/modules/sales-enquiry/service'
import type { VendorService } from '~/modules/vendor/service'
import type { ProjectService } from '~/modules/project/service'
import type { SalesReturnService } from '~/modules/sales-return/service'
import type { DeliveryChallanService } from '~/modules/delivery-challan/service'
import type { GRNService } from '~/modules/grn/service'
import type { MaterialReceiptService } from '~/modules/material-receipt/service'

export type ApprovalDecision = 'APPROVED' | 'REJECTED'

export type SubmitApprovalAction = 'SUBMIT'

export interface InitiateApprovalWorkflowInput {
	action: SubmitApprovalAction
	entityType: string
	entityId: string
	requesterUserId: string
}

export interface PendingApprovalCreateOpts {
	organizationId: unknown
	moduleKey: string
	entityType: string
	entityId: unknown
	title: string
	requesterUserId: string
}

export interface ApprovalWorkflowDeps {
	repository: ApprovalRequestRepository
	organizationService: OrganizationService
	userService: UserService
	purchaseOrderService: PurchaseOrderService
	salesOrderService: SalesOrderService
	moduleWorkspaceService: ModuleWorkspaceRecordService
	quotationService: QuotationService
	customerInvoiceService: CustomerInvoiceService
	leadService: LeadService
	payrollUiRecordService: PayrollUiRecordService
	payrollManagementService: PayrollManagementService
	vendorBillService: VendorBillService
	salesEnquiryService: SalesEnquiryService
	vendorService: VendorService
	projectService: ProjectService
	salesReturnService: SalesReturnService
	deliveryChallanService: DeliveryChallanService
	grnService: GRNService
	materialReceiptService: MaterialReceiptService
}
