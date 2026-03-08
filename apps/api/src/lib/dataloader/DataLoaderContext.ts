/**
 * DataLoader Context
 * 
 * Provides a centralized way to access all loaders within a request context
 * This ensures loaders are created once per request and shared across services
 */

import type { DataLoader } from './DataLoader';
import {
  createUserLoader,
  createOrganizationLoader,
  createProjectLoader,
  createItemLoader,
  createVendorLoader,
  createPurchaseOrderLoader,
  createPurchaseRequestLoader,
  createGrnLoader,
  createItemReceiptLoader,
  createSalesEnquiryLoader,
  createSalesQuotationLoader,
  createSalesOrderLoader,
  createCustomerInvoiceLoader,
  createCustomerPaymentLoader,
  createClientPurchaseOrderLoader,
  createVendorBillLoader,
  createVendorPaymentLoader,
  createVendorPrepaymentLoader,
  createDeliveryOrderLoader,
  createProjectScheduleLoader,
  createProjectTaskLoader,
  createTimesheetLoader,
  createAttendanceLoader,
  createVoucherLoader,
  createRateCardLoader,
  createWipLoader,
  createDocumentLoader,
  createTransmittalLoader,
  createCommunicationLogLoader,
  createNotificationLoader,
  createSystemSettingLoader,
  createAuditLogLoader,
} from './loaders';

export interface DataLoaderContextType {
  user: DataLoader<string, any>;
  organization: DataLoader<string, any>;
  project: DataLoader<string, any>;
  item: DataLoader<string, any>;
  vendor: DataLoader<string, any>;
  purchaseOrder: DataLoader<string, any>;
  purchaseRequest: DataLoader<string, any>;
  grn: DataLoader<string, any>;
  itemReceipt: DataLoader<string, any>;
  salesEnquiry: DataLoader<string, any>;
  salesQuotation: DataLoader<string, any>;
  salesOrder: DataLoader<string, any>;
  customerInvoice: DataLoader<string, any>;
  customerPayment: DataLoader<string, any>;
  clientPurchaseOrder: DataLoader<string, any>;
  vendorBill: DataLoader<string, any>;
  vendorPayment: DataLoader<string, any>;
  vendorPrepayment: DataLoader<string, any>;
  deliveryOrder: DataLoader<string, any>;
  projectSchedule: DataLoader<string, any>;
  projectTask: DataLoader<string, any>;
  timesheet: DataLoader<string, any>;
  attendance: DataLoader<string, any>;
  voucher: DataLoader<string, any>;
  rateCard: DataLoader<string, any>;
  wip: DataLoader<string, any>;
  document: DataLoader<string, any>;
  transmittal: DataLoader<string, any>;
  communicationLog: DataLoader<string, any>;
  notification: DataLoader<string, any>;
  systemSetting: DataLoader<string, any>;
  auditLog: DataLoader<string, any>;
}

/**
 * Create a new DataLoader context with all loaders
 * Should be created once per request
 */
export function createDataLoaderContext(): DataLoaderContextType {
  return {
    user: createUserLoader(),
    organization: createOrganizationLoader(),
    project: createProjectLoader(),
    item: createItemLoader(),
    vendor: createVendorLoader(),
    purchaseOrder: createPurchaseOrderLoader(),
    purchaseRequest: createPurchaseRequestLoader(),
    grn: createGrnLoader(),
    itemReceipt: createItemReceiptLoader(),
    salesEnquiry: createSalesEnquiryLoader(),
    salesQuotation: createSalesQuotationLoader(),
    salesOrder: createSalesOrderLoader(),
    customerInvoice: createCustomerInvoiceLoader(),
    customerPayment: createCustomerPaymentLoader(),
    clientPurchaseOrder: createClientPurchaseOrderLoader(),
    vendorBill: createVendorBillLoader(),
    vendorPayment: createVendorPaymentLoader(),
    vendorPrepayment: createVendorPrepaymentLoader(),
    deliveryOrder: createDeliveryOrderLoader(),
    projectSchedule: createProjectScheduleLoader(),
    projectTask: createProjectTaskLoader(),
    timesheet: createTimesheetLoader(),
    attendance: createAttendanceLoader(),
    voucher: createVoucherLoader(),
    rateCard: createRateCardLoader(),
    wip: createWipLoader(),
    document: createDocumentLoader(),
    transmittal: createTransmittalLoader(),
    communicationLog: createCommunicationLogLoader(),
    notification: createNotificationLoader(),
    systemSetting: createSystemSettingLoader(),
    auditLog: createAuditLogLoader(),
  };
}
