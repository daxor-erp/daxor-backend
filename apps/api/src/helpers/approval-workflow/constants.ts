/** Domain entity kinds routed through ApprovalRequest + org module approvers. */
export const APPROVAL_ENTITY_PURCHASE_ORDER = 'PURCHASE_ORDER'
export const APPROVAL_ENTITY_SALES_ORDER = 'SALES_ORDER'
export const APPROVAL_ENTITY_SALES_ENQUIRY = 'SALES_ENQUIRY'
export const APPROVAL_ENTITY_MODULE_WORKSPACE = 'MODULE_WORKSPACE_RECORD'
export const APPROVAL_ENTITY_QUOTATION = 'QUOTATION'
export const APPROVAL_ENTITY_CUSTOMER_INVOICE = 'CUSTOMER_INVOICE'
/** Legacy: retained so historical queue rows can still be resolved. New submits do not enqueue leads. */
export const APPROVAL_ENTITY_LEAD = 'LEAD'
export const APPROVAL_ENTITY_PAYROLL_UI_RECORD = 'PAYROLL_UI_RECORD'
export const APPROVAL_ENTITY_PAYROLL_MANAGEMENT = 'PAYROLL_MANAGEMENT'
export const APPROVAL_ENTITY_VENDOR_BILL = 'VENDOR_BILL'
export const APPROVAL_ENTITY_VENDOR = 'VENDOR'
export const APPROVAL_ENTITY_PROJECT = 'PROJECT'
export const APPROVAL_ENTITY_SALES_RETURN = 'SALES_RETURN'
export const APPROVAL_ENTITY_DELIVERY_CHALLAN = 'DELIVERY_CHALLAN'
export const APPROVAL_ENTITY_GRN = 'GRN'
export const APPROVAL_ENTITY_MATERIAL_RECEIPT = 'MATERIAL_RECEIPT'

/** Keys aligned with Organization.moduleApprovers / org-admin Approvals UI. */
export const MODULE_KEY_PURCHASES = 'purchases'
export const MODULE_KEY_SALES = 'sales'
export const MODULE_KEY_QUOTATIONS = 'quotations'
export const MODULE_KEY_PAYROLL = 'payroll'
export const MODULE_KEY_PAYABLES = 'payables'
/** Vendor master records (distinct from broader purchases routing). Org-admin Approvals assigns users under this key. */
export const MODULE_KEY_VENDORS = 'vendors'
