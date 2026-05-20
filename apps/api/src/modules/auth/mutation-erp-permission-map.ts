import type { ErpPermissionAction } from './erp-module-permission'

export type MutationPermissionRule = {
	moduleKey: string
	submoduleKey: string
	action: ErpPermissionAction
}

function sub(
	moduleKey: string,
	submoduleKey: string,
	entries: Array<[string, ErpPermissionAction]>,
): Record<string, MutationPermissionRule> {
	const out: Record<string, MutationPermissionRule> = {}
	for (const [name, action] of entries) {
		out[name] = { moduleKey, submoduleKey, action }
	}
	return out
}

/**
 * GraphQL Mutation → ERP nav submodule (keys = path slug: /foo/bar → foo_bar).
 * Unlisted mutations are not restricted by tenant UI ACL (may still use RBAC resources elsewhere).
 */
export const ERP_GRAPHQL_MUTATION_PERMISSIONS: Record<string, MutationPermissionRule> = {
	...sub('crm', 'clients', [
		['createClient', 'create'],
		['updateClient', 'update'],
		['deleteClient', 'delete'],
	]),
	...sub('crm', 'crm_lead_management', [
		['createLead', 'create'],
		['updateLead', 'update'],
		['deleteLead', 'delete'],
		['submitLeadForApproval', 'update'],
		['convertLeadToOpportunity', 'update'],
	]),
	...sub('crm', 'crm_opportunity_management', [
		['createOpportunity', 'create'],
		['updateOpportunity', 'update'],
		['deleteOpportunity', 'delete'],
	]),
	...sub('quotations', 'quotations', [
		['createQuotation', 'create'],
		['updateQuotation', 'update'],
		['deleteQuotation', 'delete'],
		['submitQuotationForApproval', 'update'],
		['createSalesQuotation', 'create'],
		['updateSalesQuotation', 'update'],
		['deleteSalesQuotation', 'delete'],
	]),
	...sub('quotations', 'quotations_send', [['sendQuotation', 'update']]),
	...sub('sales', 'sales_sales_enquiry', [
		['createSalesEnquiry', 'create'],
		['updateSalesEnquiry', 'update'],
		['deleteSalesEnquiry', 'delete'],
		['submitSalesEnquiryForApproval', 'update'],
	]),
	...sub('sales', 'sales_enter_sales_order', [
		['createSalesOrder', 'create'],
		['updateSalesOrder', 'update'],
		['deleteSalesOrder', 'delete'],
		['submitSalesOrder', 'update'],
	]),
	...sub('sales', 'sales_enter_cash_sales', [['refundCashSale', 'update']]),
	...sub('sales', 'delivery_challan', [
		['createDeliveryChallan', 'create'],
		['updateDeliveryChallan', 'update'],
		['deleteDeliveryChallan', 'delete'],
		['submitDeliveryChallanForApproval', 'update'],
	]),
	...sub('sales', 'sales_returns', [
		['createSalesReturn', 'create'],
		['updateSalesReturn', 'update'],
		['deleteSalesReturn', 'delete'],
		['submitSalesReturnForApproval', 'update'],
	]),
	...sub('sales', 'sales_create_invoices', [
		['createCustomerInvoice', 'create'],
		['updateCustomerInvoice', 'update'],
		['deleteCustomerInvoice', 'delete'],
		['submitCustomerInvoiceForApproval', 'update'],
	]),
	...sub('sales', 'sales_delivery_orders', [
		['createDeliveryOrder', 'create'],
		['updateDeliveryOrder', 'update'],
		['deleteDeliveryOrder', 'delete'],
		['transitionDeliveryOrderStatus', 'update'],
	]),
	...sub('purchases', 'vendors', [
		['createVendor', 'create'],
		['updateVendor', 'update'],
		['deleteVendor', 'delete'],
		['submitVendorForApproval', 'update'],
	]),
	...sub('purchases', 'projects', [
		['createProject', 'create'],
		['updateProject', 'update'],
		['deleteProject', 'delete'],
		['submitProjectForApproval', 'update'],
	]),
	...sub('purchases', 'purchases_enter_purchase_orders', [
		['createPurchaseOrder', 'create'],
		['updatePurchaseOrder', 'update'],
		['deletePurchaseOrder', 'delete'],
		['submitPurchaseOrder', 'update'],
		['approvePurchaseOrder', 'update'],
		['receivePurchaseOrder', 'update'],
		['billPurchaseOrder', 'update'],
	]),
	...sub('purchases', 'material_receipt', [
		['createMaterialReceipt', 'create'],
		['updateMaterialReceipt', 'update'],
		['deleteMaterialReceipt', 'delete'],
		['submitMaterialReceiptForApproval', 'update'],
		['confirmMaterialReceipt', 'update'],
		['cancelMaterialReceipt', 'update'],
	]),
	...sub('purchases', 'grn', [
		['createGRN', 'create'],
		['updateGRN', 'update'],
		['deleteGRN', 'delete'],
		['submitGRNForApproval', 'update'],
	]),
	...sub('payables', 'payables_enter_bills', [
		['createVendorBill', 'create'],
		['updateVendorBill', 'update'],
		['deleteVendorBill', 'delete'],
		['approveVendorBill', 'update'],
		['submitVendorBillForApproval', 'update'],
	]),
	...sub('payables', 'payables_pay_bills', [
		['createVendorPayment', 'create'],
		['updateVendorPayment', 'update'],
		['deleteVendorPayment', 'delete'],
	]),
	...sub('payables', 'payables_enter_vendor_credits', [
		['createVendorCredit', 'create'],
		['updateVendorCredit', 'update'],
		['deleteVendorCredit', 'delete'],
	]),
	...sub('payables', 'payables_enter_vendor_prepayment', [
		['createVendorPrepayment', 'create'],
		['updateVendorPrepayment', 'update'],
		['deleteVendorPrepayment', 'delete'],
	]),
	...sub('production', 'production_bom', [
		['createBillOfMaterials', 'create'],
		['updateBillOfMaterials', 'update'],
		['deleteBillOfMaterials', 'delete'],
	]),
	...sub('production', 'work_orders', [
		['createWorkOrder', 'create'],
		['updateWorkOrder', 'update'],
		['deleteWorkOrder', 'delete'],
	]),
	...sub('production', 'production_planning', [
		['createProductionPlanning', 'create'],
		['updateProductionPlanning', 'update'],
		['deleteProductionPlanning', 'delete'],
	]),
	...sub('production', 'production_quality', [
		['createQCInspection', 'create'],
		['updateQCInspection', 'update'],
		['deleteQCInspection', 'delete'],
		['setQCInspectionOutcome', 'update'],
	]),
	...sub('inventory', 'warehouse', [
		['createWarehouse', 'create'],
		['updateWarehouse', 'update'],
		['createWarehouseBin', 'create'],
		['updateWarehouseBin', 'update'],
	]),
	...sub('inventory', 'inventory_control', [
		['createInventoryControl', 'create'],
		['updateInventoryControl', 'update'],
		['createStockMovement', 'create'],
		['adjustStock', 'update'],
		['createInventoryReturn', 'create'],
		['updateInventoryReturn', 'update'],
		['deleteInventoryReturn', 'delete'],
	]),
	...sub('inventory', 'inventory_intercompany_transfer', [
		['createIntercompanyTransfer', 'create'],
		['updateIntercompanyTransfer', 'update'],
		['confirmIntercompanyTransfer', 'update'],
		['cancelIntercompanyTransfer', 'update'],
		['deleteIntercompanyTransfer', 'delete'],
	]),
	...sub('inventory', 'goods_receipt', [
		['createGoodsReceipt', 'create'],
		['updateGoodsReceipt', 'update'],
		['deleteGoodsReceipt', 'delete'],
		['createIPInspection', 'create'],
		['updateIPInspection', 'update'],
		['deleteIPInspection', 'delete'],
	]),
	...sub('inventory', 'stock_transfers', [
		['createStockTransfer', 'create'],
		['updateStockTransfer', 'update'],
		['confirmStockTransfer', 'update'],
		['cancelStockTransfer', 'update'],
		['deleteStockTransfer', 'delete'],
	]),
	...sub('inventory', 'stock_adjustments', [
		['createStockAdjustment', 'create'],
		['updateStockAdjustment', 'update'],
		['confirmStockAdjustment', 'update'],
		['cancelStockAdjustment', 'update'],
		['deleteStockAdjustment', 'delete'],
	]),
	...sub('inventory', 'inventory_items', [
		['createItem', 'create'],
		['updateItem', 'update'],
		['deleteItem', 'delete'],
		['createAsset', 'create'],
		['updateAsset', 'update'],
		['deleteAsset', 'delete'],
	]),
	...sub('inventory', 'inventory_enter_transfer_orders', [
		['createInternalOrder', 'create'],
		['updateInternalOrder', 'update'],
		['deleteInternalOrder', 'delete'],
	]),
	...sub('products', 'products', [
		['createProduct', 'create'],
		['updateProduct', 'update'],
		['deleteProduct', 'delete'],
		['createExciseInvoice', 'create'],
		['updateExciseInvoice', 'update'],
		['deleteExciseInvoice', 'delete'],
	]),
	...sub('financial', 'financial_fixed_assets', [
		['createFixedAsset', 'create'],
		['updateFixedAsset', 'update'],
		['deleteFixedAsset', 'delete'],
		['postFixedAssetDepreciation', 'update'],
		['disposeFixedAsset', 'update'],
	]),
	...sub('financial', 'general_ledger', [
		['createJournalEntry', 'create'],
		['updateJournalEntry', 'update'],
		['postJournalEntry', 'update'],
		['deleteJournalEntry', 'delete'],
		['createGeneralLedger', 'create'],
	]),
	...sub('financial', 'financial_revalue_currency_balances', [
		['createCurrencyRevaluation', 'create'],
		['postCurrencyRevaluation', 'update'],
		['deleteCurrencyRevaluation', 'delete'],
	]),
	...sub('financial', 'financial_set_up_budgets', [
		['createBudget', 'create'],
		['updateBudget', 'update'],
		['activateBudget', 'update'],
		['deleteBudget', 'delete'],
	]),
	...sub('financial', 'financial_create_allocation_schedules', [
		['createAllocationSchedule', 'create'],
		['updateAllocationSchedule', 'update'],
		['deleteAllocationSchedule', 'delete'],
	]),
	...sub('financial', 'financial_chart_of_accounts', [
		['createChartOfAccount', 'create'],
		['updateChartOfAccount', 'update'],
		['deleteChartOfAccount', 'delete'],
	]),
	...sub('financial', 'financial_intercompany_allocation', [
		['createIntercompanyAllocation', 'create'],
		['updateIntercompanyAllocation', 'update'],
		['deleteIntercompanyAllocation', 'delete'],
		['postIntercompanyAllocation', 'update'],
		['reverseIntercompanyAllocation', 'update'],
	]),
	...sub('financial', 'financial_intercompany_journal', [
		['createIntercompanyJournalEntry', 'create'],
		['updateIntercompanyJournalEntry', 'update'],
		['deleteIntercompanyJournalEntry', 'delete'],
		['postIntercompanyJournalEntry', 'update'],
		['reverseIntercompanyJournalEntry', 'update'],
	]),
	...sub('documents', 'documents', [['deleteDocument', 'delete']]),
	...sub('banks', 'banks_make_deposits', [['createCashBank', 'create']]),
	...sub('banks', 'banks_reconcile_account', [['reconcileCashBank', 'update']]),
	...sub('banks', 'banks_write_checks', [
		['createBankAccount', 'create'],
		['updateBankAccount', 'update'],
	]),
	...sub('banks', 'banks_reconcile_bank', [
		['createBankStatementLine', 'create'],
		['deleteBankStatementLine', 'delete'],
		['matchBankStatementLineToBook', 'update'],
	]),
	...sub('banks', 'banks_reconciliation_rules', [
		['createReconciliationRule', 'create'],
		['updateReconciliationRule', 'update'],
		['deleteReconciliationRule', 'delete'],
	]),
	...sub('banks', 'banks_transfer_funds', [['transferBankFunds', 'update']]),
	...sub('payroll', 'payroll_management', [
		['createPayrollManagement', 'create'],
		['updatePayrollManagement', 'update'],
		['deletePayrollManagement', 'delete'],
		['submitPayrollManagementForApproval', 'update'],
	]),
	...sub('payroll', 'payroll_data_preparation', [
		['createPayrollUiRecord', 'create'],
		['updatePayrollUiRecord', 'update'],
		['deletePayrollUiRecord', 'delete'],
		['submitPayrollUiRecordForApproval', 'update'],
	]),
	...sub('payroll', 'salary_processing', [
		['createSalaryProcessing', 'create'],
		['updateSalaryProcessing', 'update'],
		['deleteSalaryProcessing', 'delete'],
	]),
	...sub('payroll', 'payroll_others_loan_repayment', [
		['createLoanRepayment', 'create'],
		['updateLoanRepayment', 'update'],
		['deleteLoanRepayment', 'delete'],
	]),
	...sub('hr', 'hr_masters_employee_master', [
		['createEmployeeMaster', 'create'],
		['updateEmployeeMaster', 'update'],
		['deleteEmployeeMaster', 'delete'],
	]),
	...sub('hr', 'hr_leave_leave_type', [
		['createLeaveType', 'create'],
		['updateLeaveType', 'update'],
		['deleteLeaveType', 'delete'],
	]),
	...sub('hr', 'hr_leave_leave_enrollment', [
		['createLeaveEnrollment', 'create'],
		['updateLeaveEnrollment', 'update'],
		['deleteLeaveEnrollment', 'delete'],
	]),
	...sub('hr', 'hr_leave_leave_application', [
		['createLeaveApplication', 'create'],
		['updateLeaveApplication', 'update'],
		['deleteLeaveApplication', 'delete'],
		['approveLeaveApplication', 'update'],
		['rejectLeaveApplication', 'update'],
	]),
	...sub('hr', 'hr_leave_leave_reinstatement', [
		['createLeaveReinstatement', 'create'],
		['updateLeaveReinstatement', 'update'],
		['approveLeaveReinstatement', 'update'],
		['rejectLeaveReinstatement', 'update'],
		['deleteLeaveReinstatement', 'delete'],
	]),
	...sub('hr', 'hr_timesheets', [
		['createTimesheetEntry', 'create'],
		['updateTimesheetEntry', 'update'],
		['deleteTimesheetEntry', 'delete'],
		['submitTimesheetEntry', 'update'],
		['resolveTimesheetEntry', 'update'],
		['createAttendance', 'create'],
		['updateAttendance', 'update'],
		['deleteAttendance', 'delete'],
	]),
	...sub('hr', 'hr_masters_career_progress_salary', [
		['createCareer', 'create'],
		['updateCareer', 'update'],
		['deleteCareer', 'delete'],
	]),
	...sub('hr', 'hr_masters_job_applicant', [
		['createRecruitment', 'create'],
		['updateRecruitment', 'update'],
		['createApplicant', 'create'],
		['updateApplicant', 'update'],
		['deleteApplicant', 'delete'],
	]),
	...sub('customers', 'customers', [
		['createCustomer', 'create'],
		['updateCustomer', 'update'],
		['deleteCustomer', 'delete'],
	]),
	...sub('customers', 'customers_accept_payments', [
		['createCustomerPayment', 'create'],
		['updateCustomerPayment', 'update'],
		['deleteCustomerPayment', 'delete'],
	]),
	...sub('customers', 'customers_refund_cash_sales', [
		['createCustomerRefund', 'create'],
		['cancelCustomerRefund', 'update'],
	]),
	...sub('customers', 'customers_record_deposits', [
		['createCustomerDeposit', 'create'],
		['cancelCustomerDeposit', 'update'],
	]),
	...sub('customers', 'customers_generate_price_lists', [['generatePriceList', 'create']]),
	...sub('customers', 'customers_individual_price_list', [
		['upsertIndividualPriceList', 'update'],
		['seedIndividualPriceListFromCatalog', 'update'],
		['deleteIndividualPriceList', 'delete'],
	]),
	...sub('customers', 'customers_assess_finance_charges', [
		['draftFinanceChargeAssessment', 'create'],
		['postFinanceChargeAssessment', 'update'],
		['cancelFinanceChargeAssessment', 'update'],
		['deleteFinanceChargeAssessment', 'delete'],
	]),
	...sub('customers', 'customers_issue_return_authorizations', [
		['createReturnAuthorization', 'create'],
		['approveReturnAuthorization', 'update'],
		['rejectReturnAuthorization', 'update'],
		['cancelReturnAuthorization', 'update'],
		['deleteReturnAuthorization', 'delete'],
		['receiveReturnAuthorizationGoods', 'update'],
	]),
}
