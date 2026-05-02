export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ERP_ADMIN: 'ERP_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  EXTRACTION_MANAGER: 'EXTRACTION_MANAGER',
  PRODUCTION_MANAGER: 'PRODUCTION_MANAGER',
  PURCHASE_MANAGER: 'PURCHASE_MANAGER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  QUALITY_MANAGER: 'QUALITY_MANAGER',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  HR_PAYROLL_MANAGER: 'HR_PAYROLL_MANAGER',
  SALES_MANAGER: 'SALES_MANAGER',
  WAREHOUSE_SUPERVISOR: 'WAREHOUSE_SUPERVISOR',
  ASSET_MANAGER: 'ASSET_MANAGER',
} as const

export const RESOURCES = {
  // Node 1: Extraction
  EXTRACTION: 'extraction',
  
  // Node 2: Production
  PRODUCTION: 'production',
  
  // Node 3: Purchase
  PURCHASE_REQUEST: 'purchase_request',
  
  // Node 4: Inventory
  STOCK: 'stock',
  
  // Node 5: Quality
  QUALITY: 'quality',
  
  // Node 6: Finance
  TRANSACTION: 'transaction',
  
  // Node 7: HR
  EMPLOYEE: 'employee',
  
  // Node 8: Payroll
  PAYSLIP: 'payslip',
  
  // Node 10: Production Planning
  PRODUCTION_PLANNING: 'production_planning',
  
  // Node 11: Work Order
  WORK_ORDER: 'work_order',
  
  // Node 12: Vendor
  VENDOR: 'vendor',
  
  // Node 13: Purchase Order
  PURCHASE_ORDER: 'purchase_order',
  
  // Node 14: Vendor Payment
  VENDOR_PAYMENT: 'vendor_payment',
  
  // Node 15: Material Receipt
  MATERIAL_RECEIPT: 'material_receipt',
  
  // Node 16: Inventory Control
  INVENTORY_CONTROL: 'inventory_control',
  
  // Node 17: Inventory Return
  INVENTORY_RETURN: 'inventory_return',
  
  // Node 18: Internal Order
  INTERNAL_ORDER: 'internal_order',
  
  // Node 19: Stock Adjustment
  STOCK_ADJUSTMENT: 'stock_adjustment',
  
  // Node 20: Stock Transfer
  STOCK_TRANSFER: 'stock_transfer',
  
  // Node 21: Goods Receipt
  GOODS_RECEIPT: 'goods_receipt',
  
  // Node 22: IP Inspection
  IP_INSPECTION: 'ip_inspection',
  
  // Node 23: GRN
  GRN: 'grn',
  
  // Node 24: Excise Invoice
  EXCISE_INVOICE: 'excise_invoice',
  
  // Node 25: General Ledger
  GENERAL_LEDGER: 'general_ledger',
  
  // Node 26: Cash Bank
  CASH_BANK: 'cash_bank',
  
  // Node 27: Payroll Management
  PAYROLL_MANAGEMENT: 'payroll_management',
  
  // Node 28: Salary Processing
  SALARY_PROCESSING: 'salary_processing',
  
  // Node 29: Sales Pipeline
  SALES_PIPELINE: 'sales_pipeline',
  
  // Node 30: Warehouse
  WAREHOUSE: 'warehouse',
  
  // Node 31: Sales Order
  SALES_ORDER: 'sales_order',
  
  // Node 32: Sales Enquiry
  SALES_ENQUIRY: 'sales_enquiry',
  
  // Node 33: Sales Return
  SALES_RETURN: 'sales_return',
  
  // Node 34: Customer
  CUSTOMER: 'customer',
  
  // Node 35: Customer Invoice
  CUSTOMER_INVOICE: 'customer_invoice',
  
  // Node 36: Delivery Challan
  DELIVERY_CHALLAN: 'delivery_challan',
  
  // Node 37: Job Applicant
  JOB_APPLICANT: 'job_applicant',
  
  // Node 38: Fixed Asset
  FIXED_ASSET: 'fixed_asset',
  
  // System Resources
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  AUDIT_LOG: 'audit_log',
  ORGANIZATION: 'organization',
} as const

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const

type Action = typeof ACTIONS[keyof typeof ACTIONS]

const ALL_ACTIONS: Action[] = [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE]
const READ_ONLY: Action[] = [ACTIONS.READ]

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    displayName: 'Super Admin',
    description: 'Full system access - CEO/CTO level',
    permissions: Object.values(RESOURCES).map(resource => ({
      resource,
      actions: ALL_ACTIONS
    }))
  },
  
  [ROLES.ERP_ADMIN]: {
    displayName: 'ERP System Admin',
    description: 'Technical administration - no business data access',
    permissions: [
      { resource: RESOURCES.USER, actions: ALL_ACTIONS },
      { resource: RESOURCES.ROLE, actions: ALL_ACTIONS },
      { resource: RESOURCES.PERMISSION, actions: ALL_ACTIONS },
      { resource: RESOURCES.AUDIT_LOG, actions: READ_ONLY },
      { resource: RESOURCES.ORGANIZATION, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
    ]
  },

  [ROLES.ORG_ADMIN]: {
    displayName: 'Organization Admin',
    description: 'Manages users for a single tenant organization',
    permissions: [
      { resource: RESOURCES.USER, actions: ALL_ACTIONS },
      { resource: RESOURCES.ORGANIZATION, actions: READ_ONLY },
    ]
  },
  
  [ROLES.EXTRACTION_MANAGER]: {
    displayName: 'Extraction Manager',
    description: 'Mining operations oversight',
    permissions: [
      { resource: RESOURCES.EXTRACTION, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK, actions: READ_ONLY },
    ]
  },
  
  [ROLES.PRODUCTION_MANAGER]: {
    displayName: 'Production Manager',
    description: 'Factory operations management',
    permissions: [
      { resource: RESOURCES.PRODUCTION, actions: ALL_ACTIONS },
      { resource: RESOURCES.PRODUCTION_PLANNING, actions: ALL_ACTIONS },
      { resource: RESOURCES.WORK_ORDER, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK, actions: READ_ONLY },
    ]
  },
  
  [ROLES.PURCHASE_MANAGER]: {
    displayName: 'Purchase Manager',
    description: 'Supplier and procurement management',
    permissions: [
      { resource: RESOURCES.PURCHASE_REQUEST, actions: ALL_ACTIONS },
      { resource: RESOURCES.VENDOR, actions: ALL_ACTIONS },
      { resource: RESOURCES.PURCHASE_ORDER, actions: ALL_ACTIONS },
      { resource: RESOURCES.VENDOR_PAYMENT, actions: READ_ONLY },
      { resource: RESOURCES.MATERIAL_RECEIPT, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK, actions: READ_ONLY },
    ]
  },
  
  [ROLES.INVENTORY_MANAGER]: {
    displayName: 'Inventory Manager',
    description: 'Warehouse and stock management',
    permissions: [
      { resource: RESOURCES.STOCK, actions: ALL_ACTIONS },
      { resource: RESOURCES.INVENTORY_CONTROL, actions: ALL_ACTIONS },
      { resource: RESOURCES.INVENTORY_RETURN, actions: ALL_ACTIONS },
      { resource: RESOURCES.INTERNAL_ORDER, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK_ADJUSTMENT, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK_TRANSFER, actions: ALL_ACTIONS },
      { resource: RESOURCES.WAREHOUSE, actions: READ_ONLY },
    ]
  },
  
  [ROLES.QUALITY_MANAGER]: {
    displayName: 'Quality Manager',
    description: 'Quality assurance and inspection',
    permissions: [
      { resource: RESOURCES.QUALITY, actions: ALL_ACTIONS },
      { resource: RESOURCES.GOODS_RECEIPT, actions: ALL_ACTIONS },
      { resource: RESOURCES.IP_INSPECTION, actions: ALL_ACTIONS },
      { resource: RESOURCES.GRN, actions: ALL_ACTIONS },
      { resource: RESOURCES.EXCISE_INVOICE, actions: READ_ONLY },
      { resource: RESOURCES.STOCK, actions: READ_ONLY },
      { resource: RESOURCES.MATERIAL_RECEIPT, actions: READ_ONLY },
    ]
  },
  
  [ROLES.FINANCE_MANAGER]: {
    displayName: 'Finance Manager',
    description: 'Financial oversight - read all, write finance',
    permissions: [
      { resource: RESOURCES.TRANSACTION, actions: ALL_ACTIONS },
      { resource: RESOURCES.GENERAL_LEDGER, actions: ALL_ACTIONS },
      { resource: RESOURCES.CASH_BANK, actions: ALL_ACTIONS },
      // Read access to all business modules
      ...Object.values(RESOURCES)
        .filter(r => !['user', 'role', 'permission'].includes(r))
        .map(resource => ({ resource, actions: READ_ONLY }))
    ]
  },
  
  [ROLES.HR_PAYROLL_MANAGER]: {
    displayName: 'HR & Payroll Manager',
    description: 'People and payroll management',
    permissions: [
      { resource: RESOURCES.EMPLOYEE, actions: ALL_ACTIONS },
      { resource: RESOURCES.PAYSLIP, actions: ALL_ACTIONS },
      { resource: RESOURCES.PAYROLL_MANAGEMENT, actions: ALL_ACTIONS },
      { resource: RESOURCES.SALARY_PROCESSING, actions: ALL_ACTIONS },
      { resource: RESOURCES.JOB_APPLICANT, actions: ALL_ACTIONS },
    ]
  },
  
  [ROLES.SALES_MANAGER]: {
    displayName: 'Sales Manager',
    description: 'Revenue and customer management',
    permissions: [
      { resource: RESOURCES.SALES_PIPELINE, actions: ALL_ACTIONS },
      { resource: RESOURCES.SALES_ORDER, actions: ALL_ACTIONS },
      { resource: RESOURCES.SALES_ENQUIRY, actions: ALL_ACTIONS },
      { resource: RESOURCES.SALES_RETURN, actions: ALL_ACTIONS },
      { resource: RESOURCES.CUSTOMER, actions: ALL_ACTIONS },
      { resource: RESOURCES.CUSTOMER_INVOICE, actions: ALL_ACTIONS },
      { resource: RESOURCES.DELIVERY_CHALLAN, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK, actions: READ_ONLY },
    ]
  },
  
  [ROLES.WAREHOUSE_SUPERVISOR]: {
    displayName: 'Warehouse Supervisor',
    description: 'Daily warehouse operations',
    permissions: [
      { resource: RESOURCES.WAREHOUSE, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK, actions: ALL_ACTIONS },
      { resource: RESOURCES.STOCK_TRANSFER, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    ]
  },
  
  [ROLES.ASSET_MANAGER]: {
    displayName: 'Asset Manager',
    description: 'Equipment and asset tracking',
    permissions: [
      { resource: RESOURCES.FIXED_ASSET, actions: ALL_ACTIONS },
      { resource: RESOURCES.TRANSACTION, actions: READ_ONLY },
    ]
  },
}

export const getRolePermissions = (roleName: string) => {
  return ROLE_PERMISSIONS[roleName as keyof typeof ROLE_PERMISSIONS] || null
}

export const hasPermission = (
  userRoles: string[],
  resource: string,
  action: string
): boolean => {
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true
  
  for (const roleName of userRoles) {
    const roleConfig = ROLE_PERMISSIONS[roleName as keyof typeof ROLE_PERMISSIONS]
    if (!roleConfig) continue
    
    const permission = roleConfig.permissions.find(p => p.resource === resource)
    if (permission && permission.actions.includes(action as Action)) {
      return true
    }
  }
  
  return false
}
