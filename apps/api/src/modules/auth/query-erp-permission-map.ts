export type QueryPermissionRule = { moduleKey: string; submoduleKey: string }

function q(
	moduleKey: string,
	submoduleKey: string,
	names: string[],
): Record<string, QueryPermissionRule> {
	const o: Record<string, QueryPermissionRule> = {}
	for (const n of names) o[n] = { moduleKey, submoduleKey }
	return o
}

/**
 * GraphQL Query → require `view` on submodule. Field names must match schema (camelCase resolver names).
 * Unlisted queries stay allowed (e.g. `me`, platform admin fields).
 */
export const ERP_GRAPHQL_QUERY_PERMISSIONS: Record<string, QueryPermissionRule> = {
	...q('crm', 'clients', ['client', 'clients']),
	...q('crm', 'crm_lead_management', ['lead', 'leads']),
	...q('crm', 'crm_opportunity_management', ['opportunity', 'opportunities']),
	...q('quotations', 'quotations', [
		'quotation',
		'quotations',
		'quotationsByOrganization',
		'quotationsByClient',
		'quotationsByStatus',
	]),
	...q('sales', 'sales_sales_enquiry', [
		'salesEnquiry',
		'salesEnquiries',
		'salesEnquiriesByClient',
		'salesEnquiriesByStatus',
		'salesEnquiriesByAssignedTo',
	]),
	...q('sales', 'sales_enter_sales_order', ['salesorder', 'salesorders', 'cashSalesRefundCandidates']),
	...q('sales', 'delivery_challan', ['deliverychallan', 'deliverychallans']),
	...q('sales', 'sales_returns', ['salesreturn', 'salesreturns']),
	...q('sales', 'sales_create_invoices', ['customerinvoice', 'customerinvoices']),
	...q('sales', 'sales_delivery_orders', ['deliveryOrder', 'deliveryOrders']),
	...q('purchases', 'vendors', ['vendor', 'vendors', 'vendorEligibleApprovers', 'vendorApprovalRequests']),
	...q('purchases', 'projects', ['project', 'projects']),
	...q('purchases', 'purchases_enter_purchase_orders', ['purchaseorder', 'purchaseorders']),
	...q('purchases', 'material_receipt', ['materialreceipt', 'materialreceipts', 'materialreceiptsByPO']),
	...q('purchases', 'grn', ['grn', 'grns', 'grnsByPO']),
	...q('payables', 'payables_enter_bills', [
		'vendorBill',
		'vendorBills',
		'vendorBillsByVendor',
		'outstandingVendorBills',
	]),
	...q('payables', 'payables_pay_bills', ['vendorPayment', 'vendorPayments']),
	...q('inventory', 'warehouse', ['warehouse', 'warehouses']),
	...q('inventory', 'inventory_control', [
		'inventoryControl',
		'inventoryControls',
		'inventoryreturn',
		'inventoryreturns',
	]),
	...q('inventory', 'inventory_intercompany_transfer', ['intercompanyTransfer', 'intercompanyTransfers']),
	...q('inventory', 'goods_receipt', ['goodsReceipt', 'goodsReceipts']),
	...q('inventory', 'stock_transfers', ['stockTransfer', 'stockTransfers']),
	...q('inventory', 'stock_adjustments', ['stockAdjustment', 'stockAdjustments']),
	...q('inventory', 'inventory_items', ['item', 'items']),
	...q('inventory', 'inventory_enter_transfer_orders', ['internalorder', 'internalorders']),
	...q('products', 'products', ['product', 'products']),
	...q('financial', 'general_ledger', ['generalLedger', 'generalLedgers', 'chartOfAccount', 'chartOfAccounts']),
	...q('banks', 'banks_make_deposits', ['cashBank', 'cashBanks']),
	...q('banks', 'banks_write_checks', ['bankAccount', 'bankAccounts']),
	...q('banks', 'banks_reconcile_bank', ['bankStatementLines']),
	...q('banks', 'banks_reconciliation_rules', ['reconciliationRules']),
	...q('payroll', 'payroll_management', ['payrollmanagement', 'payrollmanagements']),
	...q('payroll', 'payroll_data_preparation', ['payrolluirecord', 'payrolluirecords']),
	...q('payroll', 'salary_processing', ['salaryprocessing', 'salaryprocessings']),
	...q('payroll', 'payroll_others_loan_repayment', ['loanrepayment', 'loanrepayments']),
	...q('hr', 'hr_masters_employee_master', ['employeeMaster', 'employeeMasters']),
	...q('hr', 'hr_leave_leave_type', ['leaveType', 'leaveTypes']),
	...q('hr', 'hr_leave_leave_enrollment', ['leaveEnrollment', 'leaveEnrollments']),
	...q('hr', 'hr_leave_leave_application', ['leaveApplication', 'leaveApplications']),
	...q('hr', 'hr_leave_leave_reinstatement', ['leaveReinstatement', 'leaveReinstatements']),
	...q('hr', 'hr_timesheets', ['timesheetEntry', 'timesheetEntries', 'timesheetWeeklySummary']),
	...q('hr', 'hr_masters_career_progress_salary', ['career', 'careers']),
	...q('hr', 'hr_masters_job_applicant', ['applicant', 'applicants']),
	...q('customers', 'customers', ['customer', 'customers']),
	...q('customers', 'customers_accept_payments', ['customerPayment', 'customerPayments']),
	...q('financial', 'financial_intercompany_allocation', ['intercompanyAllocation', 'intercompanyAllocations']),
	...q('financial', 'financial_intercompany_journal', ['intercompanyJournalEntry', 'intercompanyJournalEntries']),
	...q('financial', 'financial_fixed_assets', ['fixedAsset', 'fixedAssets', 'fixedAssetSummaryByCategory']),
	...q('production', 'production_bom', ['billOfMaterials', 'billsOfMaterials']),
	...q('production', 'work_orders', ['workorder', 'workorders']),
	...q('production', 'production_planning', ['productionplanning', 'productionplannings']),
	...q('production', 'production_quality', ['qcInspection', 'qcInspections', 'qcOutcomeSummary']),
	...q('documents', 'documents', ['documents', 'organizationDocuments', 'document']),
	...q('financial', 'financial_tax_rates_gst', ['taxRate', 'taxRates']),
}
