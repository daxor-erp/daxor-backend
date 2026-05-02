import type { GraphQLResolveInfo } from 'graphql';
import type { GraphQLContext } from '~/types/graphql.context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type Applicant = {
  __typename?: 'Applicant';
  address: Address;
  alternatePhone: Maybe<Scalars['String']['output']>;
  applicantNumber: Scalars['String']['output'];
  applicationStatus: Scalars['String']['output'];
  coverLetterUrl: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  dateOfBirth: Scalars['String']['output'];
  education: Array<Education>;
  email: Scalars['String']['output'];
  experience: Maybe<Array<Experience>>;
  firstName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  nationality: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  resumeUrl: Maybe<Scalars['String']['output']>;
  skills: Array<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ApplicantInput = {
  address: AddressInput;
  alternatePhone: InputMaybe<Scalars['String']['input']>;
  applicantNumber: Scalars['String']['input'];
  applicationStatus: InputMaybe<Scalars['String']['input']>;
  coverLetterUrl: InputMaybe<Scalars['String']['input']>;
  dateOfBirth: Scalars['String']['input'];
  education: Array<EducationInput>;
  email: Scalars['String']['input'];
  experience: InputMaybe<Array<ExperienceInput>>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  nationality: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  resumeUrl: InputMaybe<Scalars['String']['input']>;
  skills: Array<Scalars['String']['input']>;
  source: Scalars['String']['input'];
};

export type Asset = {
  __typename?: 'Asset';
  assetName: Scalars['String']['output'];
  assetNumber: Scalars['String']['output'];
  assetType: Scalars['String']['output'];
  assignedTo: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentValue: Scalars['Float']['output'];
  depreciationMethod: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  manufacturer: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  purchaseDate: Scalars['String']['output'];
  purchasePrice: Scalars['Float']['output'];
  serialNumber: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usefulLife: Scalars['Int']['output'];
  warrantyExpiry: Maybe<Scalars['String']['output']>;
};

export type AssetInput = {
  assetName: Scalars['String']['input'];
  assetNumber: Scalars['String']['input'];
  assetType: Scalars['String']['input'];
  assignedTo: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  currentValue: Scalars['Float']['input'];
  depreciationMethod: Scalars['String']['input'];
  location: Scalars['String']['input'];
  manufacturer: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  purchaseDate: Scalars['String']['input'];
  purchasePrice: Scalars['Float']['input'];
  serialNumber: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  usefulLife: Scalars['Int']['input'];
  warrantyExpiry: InputMaybe<Scalars['String']['input']>;
};

export type Attendance = {
  __typename?: 'Attendance';
  checkIn: Maybe<Scalars['String']['output']>;
  checkOut: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BankAccount = {
  __typename?: 'BankAccount';
  accountHolder: Maybe<Scalars['String']['output']>;
  accountName: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  branchName: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  currentBalance: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  organizationId: Scalars['String']['output'];
};

export type BankAccountInput = {
  accountHolder: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  accountNumber: Scalars['String']['input'];
  accountType: Scalars['String']['input'];
  bankName: Scalars['String']['input'];
  branchName: Scalars['String']['input'];
  currency: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type BankStatementLine = {
  __typename?: 'BankStatementLine';
  amount: Scalars['Float']['output'];
  bankAccount: Scalars['String']['output'];
  bankReference: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isMatched: Scalars['Boolean']['output'];
  lineDate: Scalars['String']['output'];
  lineKind: Scalars['String']['output'];
  matchedCashBankId: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
};

export type BankStatementLineInput = {
  amount: Scalars['Float']['input'];
  bankAccount: Scalars['String']['input'];
  bankReference: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  lineDate: Scalars['String']['input'];
  lineKind: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};

export type BankTransferInput = {
  amount: Scalars['Float']['input'];
  currency: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  fromAccountNumber: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  paymentMethod: InputMaybe<Scalars['String']['input']>;
  toAccountNumber: Scalars['String']['input'];
  transferDate: Scalars['String']['input'];
};

export type BankTransferResult = {
  __typename?: 'BankTransferResult';
  fromCashBankId: Scalars['String']['output'];
  fromTransactionNumber: Scalars['String']['output'];
  toCashBankId: Scalars['String']['output'];
  toTransactionNumber: Scalars['String']['output'];
  transferId: Scalars['String']['output'];
};

export type Career = {
  __typename?: 'Career';
  closingDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  department: Scalars['String']['output'];
  employmentType: Scalars['String']['output'];
  experienceRequired: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobCode: Scalars['String']['output'];
  jobDescription: Scalars['String']['output'];
  jobTitle: Scalars['String']['output'];
  location: Scalars['String']['output'];
  openings: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  postedDate: Scalars['String']['output'];
  qualifications: Scalars['String']['output'];
  responsibilities: Scalars['String']['output'];
  salaryRange: SalaryRange;
  skills: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CareerInput = {
  closingDate: Scalars['String']['input'];
  department: Scalars['String']['input'];
  employmentType: Scalars['String']['input'];
  experienceRequired: Scalars['String']['input'];
  jobCode: Scalars['String']['input'];
  jobDescription: Scalars['String']['input'];
  jobTitle: Scalars['String']['input'];
  location: Scalars['String']['input'];
  openings: Scalars['Int']['input'];
  organizationId: Scalars['String']['input'];
  postedDate: Scalars['String']['input'];
  qualifications: Scalars['String']['input'];
  responsibilities: Scalars['String']['input'];
  salaryRange: SalaryRangeInput;
  skills: Array<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type CashBank = {
  __typename?: 'CashBank';
  amount: Scalars['Float']['output'];
  bankAccount: Scalars['String']['output'];
  chequeNumber: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  reconciliationDate: Maybe<Scalars['String']['output']>;
  reconciliationStatus: Scalars['String']['output'];
  referenceId: Scalars['String']['output'];
  referenceModule: Scalars['String']['output'];
  transactionDate: Scalars['String']['output'];
  transactionNumber: Scalars['String']['output'];
  transactionType: Scalars['String']['output'];
};

export type CashBankInput = {
  amount: Scalars['Float']['input'];
  bankAccount: Scalars['String']['input'];
  chequeNumber: InputMaybe<Scalars['String']['input']>;
  currency: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  referenceId: Scalars['String']['input'];
  referenceModule: Scalars['String']['input'];
  transactionDate: Scalars['String']['input'];
  transactionType: Scalars['String']['input'];
};

export type ChartOfAccounts = {
  __typename?: 'ChartOfAccounts';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  parentAccount: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ChartOfAccountsInput = {
  accountCode: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  accountType: Scalars['String']['input'];
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  level: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  parentAccount: InputMaybe<Scalars['String']['input']>;
};

export type Client = {
  __typename?: 'Client';
  address: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  company: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  industry: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  website: Maybe<Scalars['String']['output']>;
  zipCode: Maybe<Scalars['String']['output']>;
};

export type ClientRef = {
  __typename?: 'ClientRef';
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Competency = {
  __typename?: 'Competency';
  competency: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
};

export type CompetencyInput = {
  competency: Scalars['String']['input'];
  rating: Scalars['Float']['input'];
};

export type CreateAttendanceInput = {
  checkIn: InputMaybe<Scalars['String']['input']>;
  checkOut: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateClientInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  company: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  industry: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  website: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerDepositInput = {
  amount: Scalars['Float']['input'];
  customerId: Scalars['ID']['input'];
  depositDate: Scalars['String']['input'];
  depositMethod: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  referenceNumber: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  invoiceBillable: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  paymentTerms: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  taxNumber: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerInvoiceInput = {
  customerId: Scalars['ID']['input'];
  dueDate: InputMaybe<Scalars['String']['input']>;
  invoiceDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateCustomerPaymentInput = {
  allocations: Array<CustomerPaymentAllocationInput>;
  customerId: Scalars['ID']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentDate: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  referenceNumber: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateCustomerRefundInput = {
  amount: Scalars['Float']['input'];
  customerId: Scalars['ID']['input'];
  customerInvoiceId: InputMaybe<Scalars['ID']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  referenceNumber: InputMaybe<Scalars['String']['input']>;
  refundDate: Scalars['String']['input'];
  refundMethod: Scalars['String']['input'];
};

export type CreateGrnInput = {
  lineItems: Array<GrnLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId: InputMaybe<Scalars['ID']['input']>;
  receivedDate: Scalars['String']['input'];
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type CreateItemInput = {
  category: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  rate: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type CreateLeaveApplicationInput = {
  endDate: Scalars['String']['input'];
  leaveTypeId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLeaveEnrollmentInput = {
  calendarYear: Scalars['Int']['input'];
  carriedForward: InputMaybe<Scalars['Float']['input']>;
  entitledDays: Scalars['Float']['input'];
  leaveTypeId: Scalars['ID']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLeaveReinstatementInput = {
  calendarYear: Scalars['Int']['input'];
  daysRestored: Scalars['Float']['input'];
  leaveApplicationId: InputMaybe<Scalars['ID']['input']>;
  leaveTypeId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLeaveTypeInput = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  allowCarryForward: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  defaultDaysPerYear: InputMaybe<Scalars['Float']['input']>;
  maxCarryForwardDays: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  paid: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateMaterialReceiptInput = {
  lineItems: Array<MrnLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId: InputMaybe<Scalars['ID']['input']>;
  purchaseOrderNumber: InputMaybe<Scalars['String']['input']>;
  receiptDate: Scalars['String']['input'];
  totalAmount: Scalars['Float']['input'];
  vendorId: InputMaybe<Scalars['ID']['input']>;
  vendorName: InputMaybe<Scalars['String']['input']>;
  warehouseId: InputMaybe<Scalars['ID']['input']>;
  warehouseName: InputMaybe<Scalars['String']['input']>;
};

/** Create a tenant organization and its first ORG_ADMIN user (platform admins only). */
export type CreateOrgAdminUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateOrganizationInput = {
  address: InputMaybe<Scalars['String']['input']>;
  code: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
  type: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrganizationWithOrgAdminInput = {
  orgAdmin: CreateOrgAdminUserInput;
  organization: CreateOrganizationInput;
};

export type CreateProductInput = {
  barcode: InputMaybe<Scalars['String']['input']>;
  brand: InputMaybe<Scalars['String']['input']>;
  category: InputMaybe<Scalars['String']['input']>;
  costPrice: InputMaybe<Scalars['Float']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  images: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maxStockLevel: InputMaybe<Scalars['Float']['input']>;
  minStockLevel: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  price: Scalars['Float']['input'];
  reorderPoint: InputMaybe<Scalars['Float']['input']>;
  sku: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  taxRate: InputMaybe<Scalars['Float']['input']>;
  unit: Scalars['String']['input'];
};

export type CreateProjectInput = {
  description: InputMaybe<Scalars['String']['input']>;
  endDate: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  startDate: InputMaybe<Scalars['String']['input']>;
};

export type CreatePurchaseOrderInput = {
  deliveryDate: InputMaybe<Scalars['String']['input']>;
  items: Array<PoLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId: InputMaybe<Scalars['ID']['input']>;
  subtotal: Scalars['Float']['input'];
  taxAmount: InputMaybe<Scalars['Float']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type CreateQuotationInput = {
  clientId: Scalars['ID']['input'];
  discountAmount: InputMaybe<Scalars['Float']['input']>;
  lineItems: Array<QuotationLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  quotationDate: Scalars['String']['input'];
  quotationNumber: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  subtotal: Scalars['Float']['input'];
  taxAmount: InputMaybe<Scalars['Float']['input']>;
  terms: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  validUntil: Scalars['String']['input'];
};

export type CreateReturnAuthorizationInput = {
  customerId: Scalars['ID']['input'];
  lines: Array<ReturnAuthorizationLineInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
  requestedDate: Scalars['String']['input'];
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
};

export type CreateRoleInput = {
  description: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organizationId: InputMaybe<Scalars['ID']['input']>;
  permissions: Array<PermissionInput>;
};

export type CreateSalesEnquiryInput = {
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  budget: InputMaybe<Scalars['Float']['input']>;
  clientId: InputMaybe<Scalars['ID']['input']>;
  currency: InputMaybe<Scalars['String']['input']>;
  enquirySource: InputMaybe<Scalars['String']['input']>;
  estimatedEndDate: InputMaybe<Scalars['String']['input']>;
  estimatedStartDate: InputMaybe<Scalars['String']['input']>;
  location: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  priority: InputMaybe<Scalars['String']['input']>;
  projectScope: InputMaybe<Scalars['String']['input']>;
  projectType: InputMaybe<Scalars['String']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
};

export type CreateSalesOrderInput = {
  customerId: Scalars['ID']['input'];
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId: InputMaybe<Scalars['ID']['input']>;
  quotationId: InputMaybe<Scalars['ID']['input']>;
  quotationStatus: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateSalesQuotationInput = {
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  clientId: Scalars['ID']['input'];
  currency: InputMaybe<Scalars['String']['input']>;
  deliveryTerms: InputMaybe<Scalars['String']['input']>;
  enquiryId: InputMaybe<Scalars['ID']['input']>;
  items: Array<QuotationItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  paymentTerms: InputMaybe<Scalars['String']['input']>;
  quotationDate: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  termsAndConditions: InputMaybe<Scalars['String']['input']>;
  validUntil: Scalars['String']['input'];
};

export type CreateStockAdjustmentInput = {
  adjDate: Scalars['String']['input'];
  adjustmentType: Scalars['String']['input'];
  lineItems: Array<SaLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
  warehouseId: InputMaybe<Scalars['ID']['input']>;
  warehouseName: InputMaybe<Scalars['String']['input']>;
};

export type CreateStockTransferInput = {
  fromWarehouseId: InputMaybe<Scalars['ID']['input']>;
  fromWarehouseName: InputMaybe<Scalars['String']['input']>;
  lineItems: Array<StLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  toWarehouseId: InputMaybe<Scalars['ID']['input']>;
  toWarehouseName: InputMaybe<Scalars['String']['input']>;
  transferDate: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  password: InputMaybe<Scalars['String']['input']>;
  roles: InputMaybe<Array<Scalars['String']['input']>>;
  userType: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorBillInput = {
  billDate: Scalars['String']['input'];
  discountAmount: InputMaybe<Scalars['Float']['input']>;
  dueDate: Scalars['String']['input'];
  lineItems: Array<VendorBillLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId: InputMaybe<Scalars['ID']['input']>;
  subtotal: Scalars['Float']['input'];
  taxAmount: InputMaybe<Scalars['Float']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorCreditInput = {
  creditDate: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentTerms: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  taxNumber: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorPaymentInput = {
  allocations: Array<VendorPaymentAllocationInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentDate: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  referenceNumber: InputMaybe<Scalars['String']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorPrepaymentInput = {
  amount: Scalars['Float']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  paymentMethod: Scalars['String']['input'];
  prepaymentDate: Scalars['String']['input'];
  referenceNumber: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type Customer = {
  __typename?: 'Customer';
  address: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  contactPerson: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceBillable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  paymentTerms: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  taxNumber: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  zipCode: Maybe<Scalars['String']['output']>;
};

export type CustomerDeposit = {
  __typename?: 'CustomerDeposit';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  depositDate: Scalars['String']['output'];
  depositMethod: Scalars['String']['output'];
  depositNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  referenceNumber: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CustomerInvoice = {
  __typename?: 'CustomerInvoice';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  dueDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  outstandingAmount: Scalars['Float']['output'];
  paidAmount: Maybe<Scalars['Float']['output']>;
  salesOrderId: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type CustomerPayment = {
  __typename?: 'CustomerPayment';
  allocations: Array<CustomerPaymentAllocation>;
  createdAt: Scalars['String']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentDate: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  paymentNumber: Scalars['String']['output'];
  referenceNumber: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CustomerPaymentAllocation = {
  __typename?: 'CustomerPaymentAllocation';
  amount: Scalars['Float']['output'];
  invoiceId: Scalars['ID']['output'];
  invoiceNumber: Maybe<Scalars['String']['output']>;
};

export type CustomerPaymentAllocationInput = {
  amount: Scalars['Float']['input'];
  invoiceId: Scalars['ID']['input'];
};

export type CustomerRefund = {
  __typename?: 'CustomerRefund';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  customerInvoiceId: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  invoice: Maybe<CustomerInvoice>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  referenceNumber: Maybe<Scalars['String']['output']>;
  refundDate: Scalars['String']['output'];
  refundMethod: Scalars['String']['output'];
  refundNumber: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CustomerStatement = {
  __typename?: 'CustomerStatement';
  currentBalance: Scalars['Float']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  dateFrom: Scalars['String']['output'];
  dateTo: Scalars['String']['output'];
  lines: Array<CustomerStatementLine>;
  periodInvoicesTotal: Scalars['Float']['output'];
  periodPaymentsTotal: Scalars['Float']['output'];
};

export type CustomerStatementLine = {
  __typename?: 'CustomerStatementLine';
  credit: Maybe<Scalars['Float']['output']>;
  date: Scalars['String']['output'];
  debit: Maybe<Scalars['Float']['output']>;
  description: Maybe<Scalars['String']['output']>;
  kind: Scalars['String']['output'];
  reference: Scalars['String']['output'];
};

export type Dvs = {
  __typename?: 'DVS';
  applicantId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  documentName: Scalars['String']['output'];
  documentNumber: Maybe<Scalars['String']['output']>;
  documentType: Scalars['String']['output'];
  documentUrl: Maybe<Scalars['String']['output']>;
  expiryDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  issueDate: Maybe<Scalars['String']['output']>;
  issuingAuthority: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  verificationDate: Maybe<Scalars['String']['output']>;
  verificationNotes: Maybe<Scalars['String']['output']>;
  verificationStatus: Scalars['String']['output'];
  verifiedBy: Maybe<Scalars['String']['output']>;
};

export type DvsInput = {
  applicantId: Scalars['String']['input'];
  documentName: Scalars['String']['input'];
  documentNumber: InputMaybe<Scalars['String']['input']>;
  documentType: Scalars['String']['input'];
  documentUrl: InputMaybe<Scalars['String']['input']>;
  expiryDate: InputMaybe<Scalars['String']['input']>;
  issueDate: InputMaybe<Scalars['String']['input']>;
  issuingAuthority: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  verificationNotes: InputMaybe<Scalars['String']['input']>;
  verificationStatus: InputMaybe<Scalars['String']['input']>;
};

export type DeliveryChallan = {
  __typename?: 'DeliveryChallan';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type DeliveryChallanInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type DraftFinanceChargeAssessmentInput = {
  annualRatePercent: Scalars['Float']['input'];
  asOfDate: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type Epm = {
  __typename?: 'EPM';
  areasOfImprovement: Maybe<Scalars['String']['output']>;
  comments: Maybe<Scalars['String']['output']>;
  competencies: Array<Competency>;
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  goals: Array<Goal>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  overallRating: Scalars['Float']['output'];
  reviewDate: Scalars['String']['output'];
  reviewPeriod: Scalars['String']['output'];
  reviewType: Scalars['String']['output'];
  reviewYear: Scalars['Int']['output'];
  reviewerId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  strengths: Maybe<Scalars['String']['output']>;
  trainingRecommendations: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type EpmInput = {
  areasOfImprovement: InputMaybe<Scalars['String']['input']>;
  comments: InputMaybe<Scalars['String']['input']>;
  competencies: Array<CompetencyInput>;
  employeeId: Scalars['String']['input'];
  goals: Array<GoalInput>;
  organizationId: Scalars['String']['input'];
  overallRating: Scalars['Float']['input'];
  reviewDate: Scalars['String']['input'];
  reviewPeriod: Scalars['String']['input'];
  reviewType: Scalars['String']['input'];
  reviewYear: Scalars['Int']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  strengths: InputMaybe<Scalars['String']['input']>;
  trainingRecommendations: InputMaybe<Scalars['String']['input']>;
};

export type Education = {
  __typename?: 'Education';
  degree: Scalars['String']['output'];
  grade: Maybe<Scalars['String']['output']>;
  institution: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type EducationInput = {
  degree: Scalars['String']['input'];
  grade: InputMaybe<Scalars['String']['input']>;
  institution: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type ExciseInvoice = {
  __typename?: 'ExciseInvoice';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ExciseInvoiceInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type Experience = {
  __typename?: 'Experience';
  company: Scalars['String']['output'];
  current: Scalars['Boolean']['output'];
  from: Scalars['String']['output'];
  position: Scalars['String']['output'];
  to: Maybe<Scalars['String']['output']>;
};

export type ExperienceInput = {
  company: Scalars['String']['input'];
  current: InputMaybe<Scalars['Boolean']['input']>;
  from: Scalars['String']['input'];
  position: Scalars['String']['input'];
  to: InputMaybe<Scalars['String']['input']>;
};

export type Extraction = {
  __typename?: 'Extraction';
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  destinationLocation: Maybe<Scalars['String']['output']>;
  extractionDate: Scalars['String']['output'];
  extractionNumber: Scalars['String']['output'];
  extractionType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  productionOrderId: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  rawMaterialId: Scalars['String']['output'];
  rawMaterialName: Scalars['String']['output'];
  requisitionId: Maybe<Scalars['String']['output']>;
  sourceLocation: Scalars['String']['output'];
  status: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ExtractionInput = {
  destinationLocation: InputMaybe<Scalars['String']['input']>;
  extractionDate: Scalars['String']['input'];
  extractionNumber: Scalars['String']['input'];
  extractionType: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  productionOrderId: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  rawMaterialId: Scalars['String']['input'];
  rawMaterialName: Scalars['String']['input'];
  requisitionId: InputMaybe<Scalars['String']['input']>;
  sourceLocation: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  unit: Scalars['String']['input'];
};

export type FinanceChargeAssessment = {
  __typename?: 'FinanceChargeAssessment';
  annualRatePercent: Scalars['Float']['output'];
  asOfDate: Scalars['String']['output'];
  assessmentNumber: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<FinanceChargeLine>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  postedAt: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalChargeAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FinanceChargeLine = {
  __typename?: 'FinanceChargeLine';
  chargeAmount: Scalars['Float']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  daysOverdue: Scalars['Int']['output'];
  invoiceId: Scalars['ID']['output'];
  invoiceNumber: Maybe<Scalars['String']['output']>;
  outstandingBefore: Scalars['Float']['output'];
};

export type Grn = {
  __typename?: 'GRN';
  createdAt: Maybe<Scalars['String']['output']>;
  grnNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lineItems: Array<GrnLineItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseOrderId: Maybe<Scalars['ID']['output']>;
  receivedDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  vendorId: Maybe<Scalars['ID']['output']>;
  vendorName: Maybe<Scalars['String']['output']>;
};

export type GrnLineItem = {
  __typename?: 'GRNLineItem';
  itemDescription: Scalars['String']['output'];
  orderedQty: Scalars['Float']['output'];
  receivedQty: Scalars['Float']['output'];
  unitPrice: Maybe<Scalars['Float']['output']>;
};

export type GrnLineItemInput = {
  itemDescription: Scalars['String']['input'];
  orderedQty: Scalars['Float']['input'];
  receivedQty: Scalars['Float']['input'];
  unitPrice: InputMaybe<Scalars['Float']['input']>;
};

export type GeneralLedger = {
  __typename?: 'GeneralLedger';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  creditAccount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  debitAccount: Scalars['String']['output'];
  description: Scalars['String']['output'];
  fiscalPeriod: Scalars['String']['output'];
  fiscalYear: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  referenceId: Scalars['String']['output'];
  referenceModule: Scalars['String']['output'];
  status: Scalars['String']['output'];
  transactionDate: Scalars['String']['output'];
  transactionNumber: Scalars['String']['output'];
  transactionType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type GeneralLedgerInput = {
  amount: Scalars['Float']['input'];
  creditAccount: Scalars['String']['input'];
  currency: InputMaybe<Scalars['String']['input']>;
  debitAccount: Scalars['String']['input'];
  description: Scalars['String']['input'];
  fiscalPeriod: Scalars['String']['input'];
  fiscalYear: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  referenceId: Scalars['String']['input'];
  referenceModule: Scalars['String']['input'];
  transactionDate: Scalars['String']['input'];
  transactionType: Scalars['String']['input'];
};

export type GeneratePriceListInput = {
  category: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  title: InputMaybe<Scalars['String']['input']>;
};

export type Goal = {
  __typename?: 'Goal';
  achievement: Maybe<Scalars['Float']['output']>;
  goal: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
};

export type GoalInput = {
  achievement: InputMaybe<Scalars['Float']['input']>;
  goal: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
};

export type GoodsReceipt = {
  __typename?: 'GoodsReceipt';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type GoodsReceiptInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type IpInspection = {
  __typename?: 'IPInspection';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type IpInspectionInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type IndividualPriceList = {
  __typename?: 'IndividualPriceList';
  createdAt: Scalars['String']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lines: Array<IndividualPriceListLine>;
  listNumber: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IndividualPriceListLine = {
  __typename?: 'IndividualPriceListLine';
  category: Maybe<Scalars['String']['output']>;
  customerRate: Maybe<Scalars['Float']['output']>;
  itemId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  seqNo: Maybe<Scalars['String']['output']>;
  standardRate: Maybe<Scalars['Float']['output']>;
  unit: Maybe<Scalars['String']['output']>;
};

export type IndividualPriceListLineInput = {
  category: InputMaybe<Scalars['String']['input']>;
  customerRate: InputMaybe<Scalars['Float']['input']>;
  itemId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  seqNo: InputMaybe<Scalars['String']['input']>;
  standardRate: InputMaybe<Scalars['Float']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type InternalOrder = {
  __typename?: 'InternalOrder';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type InternalOrderInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type InventoryControl = {
  __typename?: 'InventoryControl';
  binLocation: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemId: Scalars['String']['output'];
  itemName: Scalars['String']['output'];
  lastStockDate: Scalars['String']['output'];
  maxStockLevel: Scalars['Float']['output'];
  minStockLevel: Scalars['Float']['output'];
  organizationId: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  reorderPoint: Scalars['Float']['output'];
  stockStatus: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  warehouseId: Scalars['String']['output'];
};

export type InventoryControlInput = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  itemName: Scalars['String']['input'];
  maxStockLevel: InputMaybe<Scalars['Float']['input']>;
  minStockLevel: InputMaybe<Scalars['Float']['input']>;
  organizationId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reorderPoint: InputMaybe<Scalars['Float']['input']>;
  unit: Scalars['String']['input'];
  warehouseId: Scalars['String']['input'];
};

export type InventoryReturn = {
  __typename?: 'InventoryReturn';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type InventoryReturnInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type Item = {
  __typename?: 'Item';
  category: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  rate: Maybe<Scalars['Float']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  unit: Maybe<Scalars['String']['output']>;
};

export type LeaveApplication = {
  __typename?: 'LeaveApplication';
  approvedAt: Maybe<Scalars['String']['output']>;
  approvedBy: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  leaveTypeId: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  reason: Maybe<Scalars['String']['output']>;
  rejectedReason: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalDays: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type LeaveEnrollment = {
  __typename?: 'LeaveEnrollment';
  calendarYear: Scalars['Int']['output'];
  carriedForward: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  entitledDays: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  leaveTypeId: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  usedDays: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
};

export type LeaveReinstatement = {
  __typename?: 'LeaveReinstatement';
  calendarYear: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  daysRestored: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  leaveApplicationId: Maybe<Scalars['ID']['output']>;
  leaveTypeId: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  reviewNotes: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['String']['output']>;
  reviewedBy: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type LeaveType = {
  __typename?: 'LeaveType';
  active: Scalars['Boolean']['output'];
  allowCarryForward: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  defaultDaysPerYear: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  maxCarryForwardDays: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  paid: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LoanRepayment = {
  __typename?: 'LoanRepayment';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  employeeName: Maybe<Scalars['String']['output']>;
  employeeNo: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  loanReference: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  payPeriodEnd: Maybe<Scalars['String']['output']>;
  payPeriodStart: Maybe<Scalars['String']['output']>;
  remarks: Maybe<Scalars['String']['output']>;
  repaymentAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type LoanRepaymentInput = {
  docDate: Scalars['String']['input'];
  employeeName: InputMaybe<Scalars['String']['input']>;
  employeeNo: InputMaybe<Scalars['String']['input']>;
  loanReference: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  payPeriodEnd: InputMaybe<Scalars['String']['input']>;
  payPeriodStart: InputMaybe<Scalars['String']['input']>;
  remarks: InputMaybe<Scalars['String']['input']>;
  repaymentAmount: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MrnLineItem = {
  __typename?: 'MRNLineItem';
  itemDescription: Scalars['String']['output'];
  itemId: Maybe<Scalars['ID']['output']>;
  lineTotal: Scalars['Float']['output'];
  orderedQty: Scalars['Float']['output'];
  receivedQty: Scalars['Float']['output'];
  rejectedQty: Maybe<Scalars['Float']['output']>;
  unit: Maybe<Scalars['String']['output']>;
  unitPrice: Scalars['Float']['output'];
};

export type MrnLineItemInput = {
  itemDescription: Scalars['String']['input'];
  itemId: InputMaybe<Scalars['ID']['input']>;
  lineTotal: Scalars['Float']['input'];
  orderedQty: Scalars['Float']['input'];
  receivedQty: Scalars['Float']['input'];
  rejectedQty: InputMaybe<Scalars['Float']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type MaterialReceipt = {
  __typename?: 'MaterialReceipt';
  createdAt: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<MrnLineItem>;
  mrnNumber: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseOrderId: Maybe<Scalars['ID']['output']>;
  purchaseOrderNumber: Maybe<Scalars['String']['output']>;
  receiptDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  vendorId: Maybe<Scalars['ID']['output']>;
  vendorName: Maybe<Scalars['String']['output']>;
  warehouseId: Maybe<Scalars['ID']['output']>;
  warehouseName: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adjustStock: InventoryControl;
  approveLeaveApplication: LeaveApplication;
  approveLeaveReinstatement: LeaveReinstatement;
  approvePurchaseOrder: PurchaseOrder;
  approveReturnAuthorization: ReturnAuthorization;
  approveVendorBill: VendorBill;
  billPurchaseOrder: VendorBill;
  cancelCustomerDeposit: CustomerDeposit;
  cancelCustomerRefund: CustomerRefund;
  cancelFinanceChargeAssessment: FinanceChargeAssessment;
  cancelMaterialReceipt: MaterialReceipt;
  cancelReturnAuthorization: ReturnAuthorization;
  cancelStockAdjustment: StockAdjustment;
  cancelStockTransfer: StockTransfer;
  confirmMaterialReceipt: MaterialReceipt;
  confirmStockAdjustment: StockAdjustment;
  confirmStockTransfer: StockTransfer;
  createApplicant: Applicant;
  createAsset: Asset;
  createAttendance: Attendance;
  createBankAccount: BankAccount;
  createBankStatementLine: BankStatementLine;
  createCareer: Career;
  createCashBank: CashBank;
  createChartOfAccount: ChartOfAccounts;
  createClient: Client;
  createCustomer: Customer;
  createCustomerDeposit: CustomerDeposit;
  createCustomerInvoice: CustomerInvoice;
  createCustomerPayment: CustomerPayment;
  createCustomerRefund: CustomerRefund;
  createDVS: Dvs;
  createDeliveryChallan: DeliveryChallan;
  createEPM: Epm;
  createExciseInvoice: ExciseInvoice;
  createExtraction: Extraction;
  createGRN: Grn;
  createGeneralLedger: GeneralLedger;
  createGoodsReceipt: GoodsReceipt;
  createIPInspection: IpInspection;
  createInternalOrder: InternalOrder;
  createInventoryControl: InventoryControl;
  createInventoryReturn: InventoryReturn;
  createItem: Item;
  createLeaveApplication: LeaveApplication;
  createLeaveEnrollment: LeaveEnrollment;
  createLeaveReinstatement: LeaveReinstatement;
  createLeaveType: LeaveType;
  createLoanRepayment: LoanRepayment;
  createMaterialReceipt: MaterialReceipt;
  createOrganization: Organization;
  createOrganizationWithOrgAdmin: Organization;
  createPayrollManagement: PayrollManagement;
  createProduct: Product;
  createProductionPlanning: ProductionPlanning;
  createProject: Project;
  createPurchaseOrder: PurchaseOrder;
  createQuotation: Quotation;
  createRawMaterialRequisition: RawMaterialRequisition;
  createReconciliationRule: ReconciliationRule;
  createRecruitment: Recruitment;
  createReturnAuthorization: ReturnAuthorization;
  createRole: Role;
  createSalaryProcessing: SalaryProcessing;
  createSalesEnquiry: SalesEnquiry;
  createSalesOrder: SalesOrder;
  createSalesQuotation: SalesQuotation;
  createSalesReturn: SalesReturn;
  createStockAdjustment: StockAdjustment;
  createStockMovement: StockMovement;
  createStockTransfer: StockTransfer;
  createUser: User;
  createVendor: Vendor;
  createVendorBill: VendorBill;
  createVendorCredit: VendorCredit;
  createVendorPayment: VendorPayment;
  createVendorPrepayment: VendorPrepayment;
  createWarehouse: Warehouse;
  createWarehouseBin: WarehouseBin;
  createWorkOrder: WorkOrder;
  deleteApplicant: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteAttendance: Attendance;
  deleteBankStatementLine: Scalars['Boolean']['output'];
  deleteCareer: Scalars['Boolean']['output'];
  deleteChartOfAccount: Scalars['Boolean']['output'];
  deleteClient: Scalars['Boolean']['output'];
  deleteCustomer: Scalars['Boolean']['output'];
  deleteCustomerInvoice: CustomerInvoice;
  deleteCustomerPayment: Scalars['Boolean']['output'];
  deleteDVS: Scalars['Boolean']['output'];
  deleteDeliveryChallan: Scalars['Boolean']['output'];
  deleteEPM: Scalars['Boolean']['output'];
  deleteExciseInvoice: Scalars['Boolean']['output'];
  deleteExtraction: Scalars['Boolean']['output'];
  deleteFinanceChargeAssessment: Scalars['Boolean']['output'];
  deleteGRN: Scalars['Boolean']['output'];
  deleteGoodsReceipt: Scalars['Boolean']['output'];
  deleteIPInspection: Scalars['Boolean']['output'];
  deleteIndividualPriceList: Scalars['Boolean']['output'];
  deleteInternalOrder: Scalars['Boolean']['output'];
  deleteInventoryReturn: Scalars['Boolean']['output'];
  deleteItem: Item;
  deleteLeaveApplication: LeaveApplication;
  deleteLeaveEnrollment: LeaveEnrollment;
  deleteLeaveReinstatement: LeaveReinstatement;
  deleteLeaveType: LeaveType;
  deleteLoanRepayment: Scalars['Boolean']['output'];
  deleteMaterialReceipt: Scalars['Boolean']['output'];
  deleteOrganization: Organization;
  deletePayrollManagement: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductionPlanning: Scalars['Boolean']['output'];
  deleteProject: Project;
  deletePurchaseOrder: Scalars['Boolean']['output'];
  deleteQuotation: Scalars['Boolean']['output'];
  deleteReconciliationRule: Scalars['Boolean']['output'];
  deleteReturnAuthorization: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteSalaryProcessing: Scalars['Boolean']['output'];
  deleteSalesEnquiry: SalesEnquiry;
  deleteSalesOrder: SalesOrder;
  deleteSalesQuotation: SalesQuotation;
  deleteSalesReturn: Scalars['Boolean']['output'];
  deleteStockAdjustment: Scalars['Boolean']['output'];
  deleteStockTransfer: Scalars['Boolean']['output'];
  deleteUser: User;
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorBill: Scalars['Boolean']['output'];
  deleteVendorCredit: Scalars['Boolean']['output'];
  deleteVendorPayment: Scalars['Boolean']['output'];
  deleteVendorPrepayment: Scalars['Boolean']['output'];
  deleteWorkOrder: Scalars['Boolean']['output'];
  draftFinanceChargeAssessment: FinanceChargeAssessment;
  generatePriceList: PriceList;
  login: AuthPayload;
  matchBankStatementLineToBook: BankStatementLine;
  postFinanceChargeAssessment: FinanceChargeAssessment;
  receivePurchaseOrder: PurchaseOrder;
  receiveReturnAuthorizationGoods: ReturnAuthorization;
  reconcileCashBank: CashBank;
  refundCashSale: SalesOrder;
  register: AuthPayload;
  rejectLeaveApplication: LeaveApplication;
  rejectLeaveReinstatement: LeaveReinstatement;
  rejectReturnAuthorization: ReturnAuthorization;
  seedIndividualPriceListFromCatalog: IndividualPriceList;
  seedSystemRoles: Array<Role>;
  sendQuotation: SendQuotationResult;
  submitPurchaseOrder: PurchaseOrder;
  transferBankFunds: BankTransferResult;
  updateApplicant: Applicant;
  updateAsset: Asset;
  updateAttendance: Attendance;
  updateBankAccount: BankAccount;
  updateCareer: Career;
  updateChartOfAccount: ChartOfAccounts;
  updateClient: Client;
  updateCustomer: Customer;
  updateCustomerInvoice: CustomerInvoice;
  updateCustomerPayment: CustomerPayment;
  updateDVS: Dvs;
  updateDeliveryChallan: DeliveryChallan;
  updateEPM: Epm;
  updateExciseInvoice: ExciseInvoice;
  updateExtraction: Extraction;
  updateGoodsReceipt: GoodsReceipt;
  updateIPInspection: IpInspection;
  updateInternalOrder: InternalOrder;
  updateInventoryControl: InventoryControl;
  updateInventoryReturn: InventoryReturn;
  updateItem: Item;
  updateLeaveApplication: LeaveApplication;
  updateLeaveEnrollment: LeaveEnrollment;
  updateLeaveReinstatement: LeaveReinstatement;
  updateLeaveType: LeaveType;
  updateLoanRepayment: LoanRepayment;
  updateMaterialReceipt: MaterialReceipt;
  updateOrganization: Organization;
  updatePayrollManagement: PayrollManagement;
  updateProduct: Product;
  updateProductionPlanning: ProductionPlanning;
  updateProject: Project;
  updatePurchaseOrder: PurchaseOrder;
  updateQuotation: Quotation;
  updateRawMaterialRequisition: RawMaterialRequisition;
  updateReconciliationRule: ReconciliationRule;
  updateRecruitment: Recruitment;
  updateRole: Role;
  updateSalaryProcessing: SalaryProcessing;
  updateSalesEnquiry: SalesEnquiry;
  updateSalesOrder: SalesOrder;
  updateSalesQuotation: SalesQuotation;
  updateSalesReturn: SalesReturn;
  updateStockAdjustment: StockAdjustment;
  updateStockTransfer: StockTransfer;
  updateUser: User;
  updateVendor: Vendor;
  updateVendorBill: VendorBill;
  updateVendorCredit: VendorCredit;
  updateVendorPayment: VendorPayment;
  updateVendorPrepayment: VendorPrepayment;
  updateWarehouse: Warehouse;
  updateWarehouseBin: WarehouseBin;
  updateWorkOrder: WorkOrder;
  upsertIndividualPriceList: IndividualPriceList;
};


export type MutationAdjustStockArgs = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
};


export type MutationApproveLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApprovePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBillPurchaseOrderArgs = {
  billDate: Scalars['String']['input'];
  dueDate: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationCancelCustomerDepositArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelCustomerRefundArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateApplicantArgs = {
  input: ApplicantInput;
};


export type MutationCreateAssetArgs = {
  input: AssetInput;
};


export type MutationCreateAttendanceArgs = {
  input: CreateAttendanceInput;
};


export type MutationCreateBankAccountArgs = {
  input: BankAccountInput;
};


export type MutationCreateBankStatementLineArgs = {
  input: BankStatementLineInput;
};


export type MutationCreateCareerArgs = {
  input: CareerInput;
};


export type MutationCreateCashBankArgs = {
  input: CashBankInput;
};


export type MutationCreateChartOfAccountArgs = {
  input: ChartOfAccountsInput;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateCustomerDepositArgs = {
  input: CreateCustomerDepositInput;
};


export type MutationCreateCustomerInvoiceArgs = {
  input: CreateCustomerInvoiceInput;
};


export type MutationCreateCustomerPaymentArgs = {
  input: CreateCustomerPaymentInput;
};


export type MutationCreateCustomerRefundArgs = {
  input: CreateCustomerRefundInput;
};


export type MutationCreateDvsArgs = {
  input: DvsInput;
};


export type MutationCreateDeliveryChallanArgs = {
  input: DeliveryChallanInput;
};


export type MutationCreateEpmArgs = {
  input: EpmInput;
};


export type MutationCreateExciseInvoiceArgs = {
  input: ExciseInvoiceInput;
};


export type MutationCreateExtractionArgs = {
  input: ExtractionInput;
};


export type MutationCreateGrnArgs = {
  input: CreateGrnInput;
};


export type MutationCreateGeneralLedgerArgs = {
  input: GeneralLedgerInput;
};


export type MutationCreateGoodsReceiptArgs = {
  input: GoodsReceiptInput;
};


export type MutationCreateIpInspectionArgs = {
  input: IpInspectionInput;
};


export type MutationCreateInternalOrderArgs = {
  input: InternalOrderInput;
};


export type MutationCreateInventoryControlArgs = {
  input: InventoryControlInput;
};


export type MutationCreateInventoryReturnArgs = {
  input: InventoryReturnInput;
};


export type MutationCreateItemArgs = {
  input: CreateItemInput;
};


export type MutationCreateLeaveApplicationArgs = {
  input: CreateLeaveApplicationInput;
};


export type MutationCreateLeaveEnrollmentArgs = {
  input: CreateLeaveEnrollmentInput;
};


export type MutationCreateLeaveReinstatementArgs = {
  input: CreateLeaveReinstatementInput;
};


export type MutationCreateLeaveTypeArgs = {
  input: CreateLeaveTypeInput;
};


export type MutationCreateLoanRepaymentArgs = {
  input: LoanRepaymentInput;
};


export type MutationCreateMaterialReceiptArgs = {
  input: CreateMaterialReceiptInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationCreateOrganizationWithOrgAdminArgs = {
  input: CreateOrganizationWithOrgAdminInput;
};


export type MutationCreatePayrollManagementArgs = {
  input: PayrollManagementInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductionPlanningArgs = {
  input: ProductionPlanningInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreatePurchaseOrderArgs = {
  input: CreatePurchaseOrderInput;
};


export type MutationCreateQuotationArgs = {
  input: CreateQuotationInput;
};


export type MutationCreateRawMaterialRequisitionArgs = {
  input: RawMaterialRequisitionInput;
};


export type MutationCreateReconciliationRuleArgs = {
  input: ReconciliationRuleInput;
};


export type MutationCreateRecruitmentArgs = {
  input: RecruitmentInput;
};


export type MutationCreateReturnAuthorizationArgs = {
  input: CreateReturnAuthorizationInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateSalaryProcessingArgs = {
  input: SalaryProcessingInput;
};


export type MutationCreateSalesEnquiryArgs = {
  input: CreateSalesEnquiryInput;
};


export type MutationCreateSalesOrderArgs = {
  input: CreateSalesOrderInput;
};


export type MutationCreateSalesQuotationArgs = {
  input: CreateSalesQuotationInput;
};


export type MutationCreateSalesReturnArgs = {
  input: SalesReturnInput;
};


export type MutationCreateStockAdjustmentArgs = {
  input: CreateStockAdjustmentInput;
};


export type MutationCreateStockMovementArgs = {
  input: StockMovementInput;
};


export type MutationCreateStockTransferArgs = {
  input: CreateStockTransferInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


export type MutationCreateVendorBillArgs = {
  input: CreateVendorBillInput;
};


export type MutationCreateVendorCreditArgs = {
  input: CreateVendorCreditInput;
};


export type MutationCreateVendorPaymentArgs = {
  input: CreateVendorPaymentInput;
};


export type MutationCreateVendorPrepaymentArgs = {
  input: CreateVendorPrepaymentInput;
};


export type MutationCreateWarehouseArgs = {
  input: WarehouseInput;
};


export type MutationCreateWarehouseBinArgs = {
  input: WarehouseBinInput;
};


export type MutationCreateWorkOrderArgs = {
  input: WorkOrderInput;
};


export type MutationDeleteApplicantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBankStatementLineArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCareerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChartOfAccountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDvsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeliveryChallanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEpmArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExciseInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExtractionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGrnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIpInspectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIndividualPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInternalOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInventoryReturnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveEnrollmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeaveTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLoanRepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollManagementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductionPlanningArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReconciliationRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalaryProcessingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesEnquiryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesReturnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorCreditArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorPrepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDraftFinanceChargeAssessmentArgs = {
  input: DraftFinanceChargeAssessmentInput;
};


export type MutationGeneratePriceListArgs = {
  input: GeneratePriceListInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMatchBankStatementLineToBookArgs = {
  bankStatementLineId: Scalars['ID']['input'];
  cashBankId: Scalars['ID']['input'];
};


export type MutationPostFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReceivePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReceiveReturnAuthorizationGoodsArgs = {
  input: ReceiveReturnAuthorizationGoodsInput;
};


export type MutationReconcileCashBankArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRefundCashSaleArgs = {
  input: RefundCashSaleInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRejectLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
  reviewNotes: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
};


export type MutationSeedIndividualPriceListFromCatalogArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTransferBankFundsArgs = {
  input: BankTransferInput;
};


export type MutationUpdateApplicantArgs = {
  id: Scalars['ID']['input'];
  input: ApplicantInput;
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID']['input'];
  input: AssetInput;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAttendanceInput;
};


export type MutationUpdateBankAccountArgs = {
  id: Scalars['ID']['input'];
  input: BankAccountInput;
};


export type MutationUpdateCareerArgs = {
  id: Scalars['ID']['input'];
  input: CareerInput;
};


export type MutationUpdateChartOfAccountArgs = {
  id: Scalars['ID']['input'];
  input: ChartOfAccountsInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID']['input'];
  input: UpdateClientInput;
};


export type MutationUpdateCustomerArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInput;
};


export type MutationUpdateCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInvoiceInput;
};


export type MutationUpdateCustomerPaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerPaymentInput;
};


export type MutationUpdateDvsArgs = {
  id: Scalars['ID']['input'];
  input: DvsInput;
};


export type MutationUpdateDeliveryChallanArgs = {
  id: Scalars['ID']['input'];
  input: DeliveryChallanInput;
};


export type MutationUpdateEpmArgs = {
  id: Scalars['ID']['input'];
  input: EpmInput;
};


export type MutationUpdateExciseInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: ExciseInvoiceInput;
};


export type MutationUpdateExtractionArgs = {
  id: Scalars['ID']['input'];
  input: ExtractionInput;
};


export type MutationUpdateGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
  input: GoodsReceiptInput;
};


export type MutationUpdateIpInspectionArgs = {
  id: Scalars['ID']['input'];
  input: IpInspectionInput;
};


export type MutationUpdateInternalOrderArgs = {
  id: Scalars['ID']['input'];
  input: InternalOrderInput;
};


export type MutationUpdateInventoryControlArgs = {
  id: Scalars['ID']['input'];
  input: InventoryControlInput;
};


export type MutationUpdateInventoryReturnArgs = {
  id: Scalars['ID']['input'];
  input: InventoryReturnInput;
};


export type MutationUpdateItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateItemInput;
};


export type MutationUpdateLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveApplicationInput;
};


export type MutationUpdateLeaveEnrollmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveEnrollmentInput;
};


export type MutationUpdateLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveReinstatementInput;
};


export type MutationUpdateLeaveTypeArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeaveTypeInput;
};


export type MutationUpdateLoanRepaymentArgs = {
  id: Scalars['ID']['input'];
  input: LoanRepaymentInput;
};


export type MutationUpdateMaterialReceiptArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMaterialReceiptInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
};


export type MutationUpdatePayrollManagementArgs = {
  id: Scalars['ID']['input'];
  input: PayrollManagementInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateProductionPlanningArgs = {
  id: Scalars['ID']['input'];
  input: ProductionPlanningInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};


export type MutationUpdatePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePurchaseOrderInput;
};


export type MutationUpdateQuotationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQuotationInput;
};


export type MutationUpdateRawMaterialRequisitionArgs = {
  id: Scalars['ID']['input'];
  input: RawMaterialRequisitionInput;
};


export type MutationUpdateReconciliationRuleArgs = {
  id: Scalars['ID']['input'];
  input: ReconciliationRulePatch;
};


export type MutationUpdateRecruitmentArgs = {
  id: Scalars['ID']['input'];
  input: RecruitmentInput;
};


export type MutationUpdateRoleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRoleInput;
};


export type MutationUpdateSalaryProcessingArgs = {
  id: Scalars['ID']['input'];
  input: SalaryProcessingInput;
};


export type MutationUpdateSalesEnquiryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesEnquiryInput;
};


export type MutationUpdateSalesOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesOrderInput;
};


export type MutationUpdateSalesQuotationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesQuotationInput;
};


export type MutationUpdateSalesReturnArgs = {
  id: Scalars['ID']['input'];
  input: SalesReturnInput;
};


export type MutationUpdateStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStockAdjustmentInput;
};


export type MutationUpdateStockTransferArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStockTransferInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateVendorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
};


export type MutationUpdateVendorBillArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorBillInput;
};


export type MutationUpdateVendorCreditArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorCreditInput;
};


export type MutationUpdateVendorPaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorPaymentInput;
};


export type MutationUpdateVendorPrepaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorPrepaymentInput;
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID']['input'];
  input: WarehouseInput;
};


export type MutationUpdateWarehouseBinArgs = {
  id: Scalars['ID']['input'];
  input: WarehouseBinInput;
};


export type MutationUpdateWorkOrderArgs = {
  id: Scalars['ID']['input'];
  input: WorkOrderInput;
};


export type MutationUpsertIndividualPriceListArgs = {
  input: UpsertIndividualPriceListInput;
};

export type Organization = {
  __typename?: 'Organization';
  address: Maybe<Scalars['String']['output']>;
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type PoLineItem = {
  __typename?: 'POLineItem';
  itemDescription: Maybe<Scalars['String']['output']>;
  itemId: Maybe<Scalars['ID']['output']>;
  lineTotal: Maybe<Scalars['Float']['output']>;
  quantity: Maybe<Scalars['Float']['output']>;
  unitPrice: Maybe<Scalars['Float']['output']>;
};

export type PoLineItemInput = {
  itemDescription: Scalars['String']['input'];
  itemId: InputMaybe<Scalars['ID']['input']>;
  lineTotal: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type PayrollManagement = {
  __typename?: 'PayrollManagement';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  payPeriodEnd: Maybe<Scalars['String']['output']>;
  payPeriodStart: Maybe<Scalars['String']['output']>;
  remarks: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type PayrollManagementInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  payPeriodEnd: InputMaybe<Scalars['String']['input']>;
  payPeriodStart: InputMaybe<Scalars['String']['input']>;
  remarks: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type Permission = {
  __typename?: 'Permission';
  actions: Array<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
};

export type PermissionInput = {
  actions: Array<Scalars['String']['input']>;
  resource: Scalars['String']['input'];
};

export type PriceList = {
  __typename?: 'PriceList';
  categoryFilter: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  generatedAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<PriceListLine>;
  listNumber: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PriceListLine = {
  __typename?: 'PriceListLine';
  category: Maybe<Scalars['String']['output']>;
  itemId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rate: Maybe<Scalars['Float']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  unit: Maybe<Scalars['String']['output']>;
};

export type Product = {
  __typename?: 'Product';
  barcode: Maybe<Scalars['String']['output']>;
  brand: Maybe<Scalars['String']['output']>;
  category: Maybe<Scalars['String']['output']>;
  costPrice: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  maxStockLevel: Maybe<Scalars['Float']['output']>;
  minStockLevel: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  reorderPoint: Maybe<Scalars['Float']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  sku: Scalars['String']['output'];
  status: Scalars['String']['output'];
  taxRate: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ProductionPlanning = {
  __typename?: 'ProductionPlanning';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ProductionPlanningInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type Project = {
  __typename?: 'Project';
  createdAt: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  seqNo: Maybe<Scalars['String']['output']>;
  startDate: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  createdAt: Maybe<Scalars['String']['output']>;
  deliveryDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Maybe<Array<PoLineItem>>;
  notes: Maybe<Scalars['String']['output']>;
  orderDate: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  projectId: Maybe<Scalars['ID']['output']>;
  projectName: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subtotal: Maybe<Scalars['Float']['output']>;
  taxAmount: Maybe<Scalars['Float']['output']>;
  totalAmount: Maybe<Scalars['Float']['output']>;
  updatedAt: Maybe<Scalars['String']['output']>;
  vendor: Maybe<Vendor>;
  vendorId: Maybe<Scalars['ID']['output']>;
  vendorName: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  applicant: Maybe<Applicant>;
  applicants: Array<Applicant>;
  asset: Maybe<Asset>;
  assets: Array<Asset>;
  attendance: Maybe<Attendance>;
  attendances: Array<Attendance>;
  availableVendorCredits: Array<VendorCredit>;
  availableVendorPrepayments: Array<VendorPrepayment>;
  bankAccount: Maybe<BankAccount>;
  bankAccounts: Array<BankAccount>;
  bankStatementLines: Array<BankStatementLine>;
  career: Maybe<Career>;
  careers: Array<Career>;
  cashBank: Maybe<CashBank>;
  cashBanks: Array<CashBank>;
  cashSalesRefundCandidates: Array<SalesOrder>;
  chartOfAccount: Maybe<ChartOfAccounts>;
  chartOfAccounts: Array<ChartOfAccounts>;
  client: Maybe<Client>;
  clients: Array<Client>;
  clientsByOrganization: Array<Client>;
  clientsByStatus: Array<Client>;
  customer: Maybe<Customer>;
  customerDeposit: Maybe<CustomerDeposit>;
  customerDeposits: Array<CustomerDeposit>;
  customerPayment: Maybe<CustomerPayment>;
  customerPayments: Array<CustomerPayment>;
  customerPaymentsByCustomer: Array<CustomerPayment>;
  customerRefund: Maybe<CustomerRefund>;
  customerRefunds: Array<CustomerRefund>;
  customerinvoice: Maybe<CustomerInvoice>;
  customerinvoices: Array<CustomerInvoice>;
  customers: Array<Customer>;
  deliverychallan: Maybe<DeliveryChallan>;
  deliverychallans: Array<DeliveryChallan>;
  dvs: Maybe<Dvs>;
  dvsRecords: Array<Dvs>;
  epm: Maybe<Epm>;
  epms: Array<Epm>;
  exciseinvoice: Maybe<ExciseInvoice>;
  exciseinvoices: Array<ExciseInvoice>;
  extraction: Maybe<Extraction>;
  extractions: Array<Extraction>;
  financeChargeAssessment: Maybe<FinanceChargeAssessment>;
  financeChargeAssessments: Array<FinanceChargeAssessment>;
  generalLedger: Maybe<GeneralLedger>;
  generalLedgers: Array<GeneralLedger>;
  generateCustomerStatement: CustomerStatement;
  goodsreceipt: Maybe<GoodsReceipt>;
  goodsreceipts: Array<GoodsReceipt>;
  grn: Maybe<Grn>;
  grns: Array<Grn>;
  grnsByPO: Array<Grn>;
  individualPriceList: Maybe<IndividualPriceList>;
  individualPriceListByCustomer: Maybe<IndividualPriceList>;
  individualPriceLists: Array<IndividualPriceList>;
  internalorder: Maybe<InternalOrder>;
  internalorders: Array<InternalOrder>;
  inventoryControl: Maybe<InventoryControl>;
  inventoryControls: Array<InventoryControl>;
  inventoryreturn: Maybe<InventoryReturn>;
  inventoryreturns: Array<InventoryReturn>;
  invoiceBillableCustomers: Array<Customer>;
  ipinspection: Maybe<IpInspection>;
  ipinspections: Array<IpInspection>;
  item: Maybe<Item>;
  items: Array<Item>;
  leaveApplication: Maybe<LeaveApplication>;
  leaveApplications: Array<LeaveApplication>;
  leaveEnrollment: Maybe<LeaveEnrollment>;
  leaveEnrollments: Array<LeaveEnrollment>;
  leaveReinstatement: Maybe<LeaveReinstatement>;
  leaveReinstatements: Array<LeaveReinstatement>;
  leaveType: Maybe<LeaveType>;
  leaveTypes: Array<LeaveType>;
  loanrepayment: Maybe<LoanRepayment>;
  loanrepayments: Array<LoanRepayment>;
  lowStockItems: Array<InventoryControl>;
  materialreceipt: Maybe<MaterialReceipt>;
  materialreceipts: Array<MaterialReceipt>;
  materialreceiptsByPO: Array<MaterialReceipt>;
  me: Maybe<User>;
  organization: Maybe<Organization>;
  organizations: Array<Organization>;
  outstandingVendorBills: Array<VendorBill>;
  payrollmanagement: Maybe<PayrollManagement>;
  payrollmanagements: Array<PayrollManagement>;
  priceList: Maybe<PriceList>;
  priceLists: Array<PriceList>;
  product: Maybe<Product>;
  productionplanning: Maybe<ProductionPlanning>;
  productionplannings: Array<ProductionPlanning>;
  products: Array<Product>;
  productsByCategory: Array<Product>;
  productsByOrganization: Array<Product>;
  productsByStatus: Array<Product>;
  project: Maybe<Project>;
  projects: Array<Project>;
  purchaseorder: Maybe<PurchaseOrder>;
  purchaseorders: Array<PurchaseOrder>;
  quotation: Maybe<Quotation>;
  quotations: Array<Quotation>;
  quotationsByClient: Array<Quotation>;
  quotationsByOrganization: Array<Quotation>;
  quotationsByStatus: Array<Quotation>;
  rawMaterialRequisition: Maybe<RawMaterialRequisition>;
  rawMaterialRequisitions: Array<RawMaterialRequisition>;
  reconciliationRules: Array<ReconciliationRule>;
  recruitment: Maybe<Recruitment>;
  recruitments: Array<Recruitment>;
  returnAuthorization: Maybe<ReturnAuthorization>;
  returnAuthorizations: Array<ReturnAuthorization>;
  role: Maybe<Role>;
  roles: Array<Role>;
  rolesByOrganization: Array<Role>;
  salaryprocessing: Maybe<SalaryProcessing>;
  salaryprocessings: Array<SalaryProcessing>;
  salesEnquiries: Array<SalesEnquiry>;
  salesEnquiriesByAssignedTo: Array<SalesEnquiry>;
  salesEnquiriesByClient: Array<SalesEnquiry>;
  salesEnquiriesByStatus: Array<SalesEnquiry>;
  salesEnquiry: Maybe<SalesEnquiry>;
  salesQuotation: Maybe<SalesQuotation>;
  salesQuotations: Array<SalesQuotation>;
  salesQuotationsByClient: Array<SalesQuotation>;
  salesQuotationsByEnquiry: Array<SalesQuotation>;
  salesQuotationsByStatus: Array<SalesQuotation>;
  salesorder: Maybe<SalesOrder>;
  salesorders: Array<SalesOrder>;
  salesreturn: Maybe<SalesReturn>;
  salesreturns: Array<SalesReturn>;
  stockMovement: Maybe<StockMovement>;
  stockMovements: Array<StockMovement>;
  stockadjustment: Maybe<StockAdjustment>;
  stockadjustments: Array<StockAdjustment>;
  stocktransfer: Maybe<StockTransfer>;
  stocktransfers: Array<StockTransfer>;
  systemRoles: Array<Role>;
  user: Maybe<User>;
  userByEmail: Maybe<User>;
  usersByOrganization: UserList;
  usersByRole: Array<User>;
  vendor: Maybe<Vendor>;
  vendorBill: Maybe<VendorBill>;
  vendorBills: Array<VendorBill>;
  vendorBillsByVendor: Array<VendorBill>;
  vendorCredit: Maybe<VendorCredit>;
  vendorCredits: Array<VendorCredit>;
  vendorPayment: Maybe<VendorPayment>;
  vendorPayments: Array<VendorPayment>;
  vendorPaymentsByVendor: Array<VendorPayment>;
  vendorPrepayment: Maybe<VendorPrepayment>;
  vendorPrepayments: Array<VendorPrepayment>;
  vendors: Array<Vendor>;
  warehouse: Maybe<Warehouse>;
  warehouseBin: Maybe<WarehouseBin>;
  warehouseBins: Array<WarehouseBin>;
  warehouses: Array<Warehouse>;
  workorder: Maybe<WorkOrder>;
  workorders: Array<WorkOrder>;
};


export type QueryApplicantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApplicantsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAttendancesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  userId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAvailableVendorCreditsArgs = {
  organizationId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};


export type QueryAvailableVendorPrepaymentsArgs = {
  organizationId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};


export type QueryBankAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBankAccountsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBankStatementLinesArgs = {
  bankAccount: Scalars['String']['input'];
  onlyUnmatched: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryCareerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCareersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryCashBankArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCashBanksArgs = {
  bankAccount: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  reconciliationStatus: InputMaybe<Scalars['String']['input']>;
};


export type QueryCashSalesRefundCandidatesArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryChartOfAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChartOfAccountsArgs = {
  accountType: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryClientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClientsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryClientsByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryClientsByStatusArgs = {
  organizationId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerDepositArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerDepositsArgs = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerPaymentsArgs = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerPaymentsByCustomerArgs = {
  customerId: Scalars['ID']['input'];
};


export type QueryCustomerRefundArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerRefundsArgs = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerinvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerinvoicesArgs = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryCustomersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryDeliverychallanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliverychallansArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDvsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDvsRecordsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryEpmArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEpmsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryExciseinvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExciseinvoicesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryExtractionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExtractionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFinanceChargeAssessmentsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryGeneralLedgerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGeneralLedgersArgs = {
  fiscalYear: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryGenerateCustomerStatementArgs = {
  customerId: Scalars['ID']['input'];
  dateFrom: Scalars['String']['input'];
  dateTo: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


export type QueryGoodsreceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGoodsreceiptsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGrnArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGrnsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGrnsByPoArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type QueryIndividualPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIndividualPriceListByCustomerArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type QueryIndividualPriceListsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInternalorderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInternalordersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInventoryControlArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInventoryControlsArgs = {
  organizationId: Scalars['String']['input'];
  stockStatus: InputMaybe<Scalars['String']['input']>;
  warehouseId: InputMaybe<Scalars['String']['input']>;
};


export type QueryInventoryreturnArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInventoryreturnsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInvoiceBillableCustomersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIpinspectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIpinspectionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryLeaveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveApplicationsArgs = {
  organizationId: Scalars['ID']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeaveEnrollmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveEnrollmentsArgs = {
  calendarYear: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  userId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeaveReinstatementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveReinstatementsArgs = {
  organizationId: Scalars['ID']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLeaveTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeaveTypesArgs = {
  activeOnly: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
};


export type QueryLoanrepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLoanrepaymentsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryLowStockItemsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryMaterialreceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaterialreceiptsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryMaterialreceiptsByPoArgs = {
  purchaseOrderId: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryOutstandingVendorBillsArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryPayrollmanagementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPayrollmanagementsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPriceListsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductionplanningArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductionplanningsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductsByCategoryArgs = {
  category: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};


export type QueryProductsByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryProductsByStatusArgs = {
  organizationId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};


export type QueryPurchaseorderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPurchaseordersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuotationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuotationsByClientArgs = {
  clientId: Scalars['ID']['input'];
};


export type QueryQuotationsByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryQuotationsByStatusArgs = {
  organizationId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueryRawMaterialRequisitionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRawMaterialRequisitionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryReconciliationRulesArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryRecruitmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecruitmentsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryReturnAuthorizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReturnAuthorizationsArgs = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  receiptComplete: InputMaybe<Scalars['Boolean']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRolesByOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QuerySalaryprocessingArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalaryprocessingsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySalesEnquiriesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesEnquiriesByAssignedToArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerySalesEnquiriesByClientArgs = {
  clientId: Scalars['ID']['input'];
};


export type QuerySalesEnquiriesByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QuerySalesEnquiryArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesQuotationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesQuotationsByClientArgs = {
  clientId: Scalars['ID']['input'];
};


export type QuerySalesQuotationsByEnquiryArgs = {
  enquiryId: Scalars['ID']['input'];
};


export type QuerySalesQuotationsByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QuerySalesorderArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesordersArgs = {
  cashSale: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesreturnArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesreturnsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStockMovementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockMovementsArgs = {
  itemId: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryStockadjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockadjustmentsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStocktransferArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStocktransfersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUsersByOrganizationArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  type: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersByRoleArgs = {
  role: Scalars['String']['input'];
};


export type QueryVendorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorBillArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorBillsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorBillsByVendorArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryVendorCreditArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorCreditsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorPaymentsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorPaymentsByVendorArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryVendorPrepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorPrepaymentsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryVendorsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryWarehouseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarehouseBinArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarehouseBinsArgs = {
  organizationId: Scalars['String']['input'];
  warehouseId: InputMaybe<Scalars['String']['input']>;
};


export type QueryWarehousesArgs = {
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryWorkorderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWorkordersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};

export type Quotation = {
  __typename?: 'Quotation';
  clientId: ClientRef;
  createdAt: Scalars['String']['output'];
  createdBy: Maybe<Scalars['ID']['output']>;
  discountAmount: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<QuotationLineItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  quotationDate: Scalars['String']['output'];
  quotationNumber: Scalars['String']['output'];
  sentAt: Maybe<Scalars['String']['output']>;
  sentBy: Maybe<Scalars['ID']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  taxAmount: Maybe<Scalars['Float']['output']>;
  terms: Maybe<Scalars['String']['output']>;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  validUntil: Scalars['String']['output'];
};

export type QuotationItem = {
  __typename?: 'QuotationItem';
  amount: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
  discount: Scalars['Float']['output'];
  itemName: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type QuotationItemInput = {
  amount: Scalars['Float']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  discount: InputMaybe<Scalars['Float']['input']>;
  itemName: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  tax: InputMaybe<Scalars['Float']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type QuotationLineItem = {
  __typename?: 'QuotationLineItem';
  description: Scalars['String']['output'];
  discount: Maybe<Scalars['Float']['output']>;
  itemId: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Float']['output'];
  tax: Maybe<Scalars['Float']['output']>;
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type QuotationLineItemInput = {
  description: Scalars['String']['input'];
  discount: InputMaybe<Scalars['Float']['input']>;
  itemId: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Float']['input'];
  tax: InputMaybe<Scalars['Float']['input']>;
  total: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type RawMaterialRequisition = {
  __typename?: 'RawMaterialRequisition';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  purpose: Scalars['String']['output'];
  rawMaterialId: Scalars['String']['output'];
  requestedBy: Scalars['String']['output'];
  requestedQuantity: Scalars['Float']['output'];
  requiredDate: Scalars['String']['output'];
  requisitionDate: Scalars['String']['output'];
  requisitionNumber: Scalars['String']['output'];
  status: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type RawMaterialRequisitionInput = {
  organizationId: Scalars['String']['input'];
  purpose: Scalars['String']['input'];
  rawMaterialId: Scalars['String']['input'];
  requestedQuantity: Scalars['Float']['input'];
  requiredDate: Scalars['String']['input'];
  requisitionDate: Scalars['String']['input'];
  requisitionNumber: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  unit: Scalars['String']['input'];
};

export type ReceiveReturnAuthorizationGoodsInput = {
  lines: Array<ReceiveReturnGoodsLineInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  receivedDate: Scalars['String']['input'];
  returnAuthorizationId: Scalars['ID']['input'];
};

export type ReceiveReturnGoodsLineInput = {
  lineId: Scalars['ID']['input'];
  quantityReceived: Scalars['Float']['input'];
};

export type ReconciliationRule = {
  __typename?: 'ReconciliationRule';
  amountTolerance: Scalars['Float']['output'];
  bankAccount: Maybe<Scalars['String']['output']>;
  bankLineTextContains: Scalars['String']['output'];
  bookLineTextContains: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
};

export type ReconciliationRuleInput = {
  amountTolerance: InputMaybe<Scalars['Float']['input']>;
  bankAccount: InputMaybe<Scalars['String']['input']>;
  bankLineTextContains: InputMaybe<Scalars['String']['input']>;
  bookLineTextContains: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  priority: InputMaybe<Scalars['Int']['input']>;
};

export type ReconciliationRulePatch = {
  amountTolerance: InputMaybe<Scalars['Float']['input']>;
  bankAccount: InputMaybe<Scalars['String']['input']>;
  bankLineTextContains: InputMaybe<Scalars['String']['input']>;
  bookLineTextContains: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  priority: InputMaybe<Scalars['Int']['input']>;
};

export type Recruitment = {
  __typename?: 'Recruitment';
  applicantId: Scalars['String']['output'];
  applicationDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  feedback: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interviewDate: Maybe<Scalars['String']['output']>;
  interviewers: Maybe<Array<Scalars['String']['output']>>;
  jobId: Scalars['String']['output'];
  joiningDate: Maybe<Scalars['String']['output']>;
  offerAmount: Maybe<Scalars['Float']['output']>;
  organizationId: Scalars['String']['output'];
  source: Scalars['String']['output'];
  stage: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type RecruitmentInput = {
  applicantId: Scalars['String']['input'];
  applicationDate: Scalars['String']['input'];
  feedback: InputMaybe<Scalars['String']['input']>;
  interviewDate: InputMaybe<Scalars['String']['input']>;
  interviewers: InputMaybe<Array<Scalars['String']['input']>>;
  jobId: Scalars['String']['input'];
  joiningDate: InputMaybe<Scalars['String']['input']>;
  offerAmount: InputMaybe<Scalars['Float']['input']>;
  organizationId: Scalars['String']['input'];
  source: Scalars['String']['input'];
  stage: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type RefundCashSaleInput = {
  amount: Scalars['Float']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  referenceNumber: InputMaybe<Scalars['String']['input']>;
  refundDate: Scalars['String']['input'];
  refundMethod: Scalars['String']['input'];
  salesOrderId: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
  password: Scalars['String']['input'];
};

export type ReturnAuthorization = {
  __typename?: 'ReturnAuthorization';
  approvedAt: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customer: Maybe<Customer>;
  customerId: Scalars['ID']['output'];
  goodsReceivedAt: Maybe<Scalars['String']['output']>;
  goodsReceivedBy: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  lines: Array<ReturnAuthorizationLine>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  raNumber: Scalars['String']['output'];
  reason: Maybe<Scalars['String']['output']>;
  receiptComplete: Scalars['Boolean']['output'];
  receiptNotes: Maybe<Scalars['String']['output']>;
  rejectionReason: Maybe<Scalars['String']['output']>;
  requestedDate: Scalars['String']['output'];
  salesOrderId: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ReturnAuthorizationLine = {
  __typename?: 'ReturnAuthorizationLine';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemId: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Float']['output'];
  quantityReceived: Scalars['Float']['output'];
};

export type ReturnAuthorizationLineInput = {
  description: Scalars['String']['input'];
  itemId: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Float']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSystemRole: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Maybe<Scalars['ID']['output']>;
  permissions: Array<Permission>;
  updatedAt: Scalars['String']['output'];
};

export type SaLineItem = {
  __typename?: 'SALineItem';
  adjustedQty: Scalars['Float']['output'];
  currentQty: Scalars['Float']['output'];
  difference: Scalars['Float']['output'];
  itemDescription: Scalars['String']['output'];
  itemId: Maybe<Scalars['ID']['output']>;
  unit: Maybe<Scalars['String']['output']>;
};

export type SaLineItemInput = {
  adjustedQty: Scalars['Float']['input'];
  currentQty: Scalars['Float']['input'];
  difference: Scalars['Float']['input'];
  itemDescription: Scalars['String']['input'];
  itemId: InputMaybe<Scalars['ID']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type StLineItem = {
  __typename?: 'STLineItem';
  itemDescription: Scalars['String']['output'];
  itemId: Maybe<Scalars['ID']['output']>;
  qty: Scalars['Float']['output'];
  unit: Maybe<Scalars['String']['output']>;
};

export type StLineItemInput = {
  itemDescription: Scalars['String']['input'];
  itemId: InputMaybe<Scalars['ID']['input']>;
  qty: Scalars['Float']['input'];
  unit: InputMaybe<Scalars['String']['input']>;
};

export type SalaryProcessing = {
  __typename?: 'SalaryProcessing';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  payPeriodEnd: Maybe<Scalars['String']['output']>;
  payPeriodStart: Maybe<Scalars['String']['output']>;
  remarks: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type SalaryProcessingInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  payPeriodEnd: InputMaybe<Scalars['String']['input']>;
  payPeriodStart: InputMaybe<Scalars['String']['input']>;
  remarks: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

export type SalaryRange = {
  __typename?: 'SalaryRange';
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type SalaryRangeInput = {
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
};

export type SalesEnquiry = {
  __typename?: 'SalesEnquiry';
  assignedTo: Maybe<Scalars['ID']['output']>;
  budget: Maybe<Scalars['Float']['output']>;
  clientId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Maybe<Scalars['ID']['output']>;
  currency: Maybe<Scalars['String']['output']>;
  enquiryNumber: Scalars['String']['output'];
  enquirySource: Maybe<Scalars['String']['output']>;
  estimatedEndDate: Maybe<Scalars['String']['output']>;
  estimatedStartDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  location: Maybe<Scalars['String']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  priority: Scalars['String']['output'];
  projectScope: Maybe<Scalars['String']['output']>;
  projectType: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type SalesOrder = {
  __typename?: 'SalesOrder';
  cashSale: Scalars['Boolean']['output'];
  clientId: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  orderDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  projectId: Maybe<Scalars['ID']['output']>;
  quotationId: Maybe<Scalars['ID']['output']>;
  quotationStatus: Maybe<Scalars['String']['output']>;
  refundAmount: Maybe<Scalars['Float']['output']>;
  refundMethod: Maybe<Scalars['String']['output']>;
  refundNotes: Maybe<Scalars['String']['output']>;
  refundReferenceNumber: Maybe<Scalars['String']['output']>;
  refundedAt: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type SalesQuotation = {
  __typename?: 'SalesQuotation';
  assignedTo: Maybe<Scalars['ID']['output']>;
  clientId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['ID']['output'];
  currency: Scalars['String']['output'];
  deliveryTerms: Maybe<Scalars['String']['output']>;
  enquiryId: Maybe<Scalars['ID']['output']>;
  grandTotal: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  items: Array<QuotationItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentTerms: Maybe<Scalars['String']['output']>;
  quotationDate: Scalars['String']['output'];
  quotationNumber: Scalars['String']['output'];
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  termsAndConditions: Maybe<Scalars['String']['output']>;
  totalDiscount: Scalars['Float']['output'];
  totalTax: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  validUntil: Scalars['String']['output'];
};

export type SalesReturn = {
  __typename?: 'SalesReturn';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type SalesReturnInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type SendQuotationResult = {
  __typename?: 'SendQuotationResult';
  emailSent: Scalars['Boolean']['output'];
  quotation: Quotation;
};

export type StockAdjustment = {
  __typename?: 'StockAdjustment';
  adjDate: Scalars['String']['output'];
  adjNumber: Scalars['String']['output'];
  adjustmentType: Scalars['String']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<SaLineItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  reason: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  warehouseId: Maybe<Scalars['ID']['output']>;
  warehouseName: Maybe<Scalars['String']['output']>;
};

export type StockMovement = {
  __typename?: 'StockMovement';
  createdAt: Scalars['String']['output'];
  fromLocation: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemId: Scalars['String']['output'];
  movementDate: Scalars['String']['output'];
  movementType: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  referenceId: Scalars['String']['output'];
  referenceModule: Scalars['String']['output'];
  toLocation: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type StockMovementInput = {
  fromLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  referenceId: Scalars['String']['input'];
  referenceModule: Scalars['String']['input'];
  toLocation: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type StockTransfer = {
  __typename?: 'StockTransfer';
  createdAt: Maybe<Scalars['String']['output']>;
  fromWarehouseId: Maybe<Scalars['ID']['output']>;
  fromWarehouseName: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<StLineItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  toWarehouseId: Maybe<Scalars['ID']['output']>;
  toWarehouseName: Maybe<Scalars['String']['output']>;
  transferDate: Scalars['String']['output'];
  transferNumber: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
};

export type UpdateAttendanceInput = {
  checkIn: InputMaybe<Scalars['String']['input']>;
  checkOut: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClientInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  company: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  industry: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  website: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  invoiceBillable: InputMaybe<Scalars['Boolean']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  paymentTerms: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  taxNumber: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInvoiceInput = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  dueDate: InputMaybe<Scalars['String']['input']>;
  invoiceDate: InputMaybe<Scalars['String']['input']>;
  paidAmount: InputMaybe<Scalars['Float']['input']>;
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateCustomerPaymentInput = {
  notes: InputMaybe<Scalars['String']['input']>;
  paymentDate: InputMaybe<Scalars['String']['input']>;
  paymentMethod: InputMaybe<Scalars['String']['input']>;
  referenceNumber: InputMaybe<Scalars['String']['input']>;
};

export type UpdateItemInput = {
  category: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  rate: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeaveApplicationInput = {
  endDate: InputMaybe<Scalars['String']['input']>;
  reason: InputMaybe<Scalars['String']['input']>;
  rejectedReason: InputMaybe<Scalars['String']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  totalDays: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLeaveEnrollmentInput = {
  carriedForward: InputMaybe<Scalars['Float']['input']>;
  entitledDays: InputMaybe<Scalars['Float']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  usedDays: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLeaveReinstatementInput = {
  reviewNotes: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeaveTypeInput = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  allowCarryForward: InputMaybe<Scalars['Boolean']['input']>;
  code: InputMaybe<Scalars['String']['input']>;
  defaultDaysPerYear: InputMaybe<Scalars['Float']['input']>;
  maxCarryForwardDays: InputMaybe<Scalars['Float']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  paid: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMaterialReceiptInput = {
  lineItems: InputMaybe<Array<MrnLineItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  receiptDate: InputMaybe<Scalars['String']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
  vendorName: InputMaybe<Scalars['String']['input']>;
  warehouseId: InputMaybe<Scalars['ID']['input']>;
  warehouseName: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationInput = {
  address: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  barcode: InputMaybe<Scalars['String']['input']>;
  brand: InputMaybe<Scalars['String']['input']>;
  category: InputMaybe<Scalars['String']['input']>;
  costPrice: InputMaybe<Scalars['Float']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  images: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maxStockLevel: InputMaybe<Scalars['Float']['input']>;
  minStockLevel: InputMaybe<Scalars['Float']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  price: InputMaybe<Scalars['Float']['input']>;
  reorderPoint: InputMaybe<Scalars['Float']['input']>;
  sku: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  taxRate: InputMaybe<Scalars['Float']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  description: InputMaybe<Scalars['String']['input']>;
  endDate: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePurchaseOrderInput = {
  deliveryDate: InputMaybe<Scalars['String']['input']>;
  items: InputMaybe<Array<PoLineItemInput>>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  subtotal: InputMaybe<Scalars['Float']['input']>;
  taxAmount: InputMaybe<Scalars['Float']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateQuotationInput = {
  clientId: InputMaybe<Scalars['ID']['input']>;
  discountAmount: InputMaybe<Scalars['Float']['input']>;
  lineItems: InputMaybe<Array<QuotationLineItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  quotationDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
  subtotal: InputMaybe<Scalars['Float']['input']>;
  taxAmount: InputMaybe<Scalars['Float']['input']>;
  terms: InputMaybe<Scalars['String']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
  validUntil: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description: InputMaybe<Scalars['String']['input']>;
  displayName: InputMaybe<Scalars['String']['input']>;
  permissions: InputMaybe<Array<PermissionInput>>;
};

export type UpdateSalesEnquiryInput = {
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  budget: InputMaybe<Scalars['Float']['input']>;
  clientId: InputMaybe<Scalars['ID']['input']>;
  currency: InputMaybe<Scalars['String']['input']>;
  enquirySource: InputMaybe<Scalars['String']['input']>;
  estimatedEndDate: InputMaybe<Scalars['String']['input']>;
  estimatedStartDate: InputMaybe<Scalars['String']['input']>;
  location: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  priority: InputMaybe<Scalars['String']['input']>;
  projectScope: InputMaybe<Scalars['String']['input']>;
  projectType: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSalesOrderInput = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateSalesQuotationInput = {
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  clientId: InputMaybe<Scalars['ID']['input']>;
  currency: InputMaybe<Scalars['String']['input']>;
  deliveryTerms: InputMaybe<Scalars['String']['input']>;
  enquiryId: InputMaybe<Scalars['ID']['input']>;
  items: InputMaybe<Array<QuotationItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  paymentTerms: InputMaybe<Scalars['String']['input']>;
  quotationDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
  termsAndConditions: InputMaybe<Scalars['String']['input']>;
  validUntil: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStockAdjustmentInput = {
  adjDate: InputMaybe<Scalars['String']['input']>;
  adjustmentType: InputMaybe<Scalars['String']['input']>;
  lineItems: InputMaybe<Array<SaLineItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  reason: InputMaybe<Scalars['String']['input']>;
  warehouseId: InputMaybe<Scalars['ID']['input']>;
  warehouseName: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStockTransferInput = {
  fromWarehouseId: InputMaybe<Scalars['ID']['input']>;
  fromWarehouseName: InputMaybe<Scalars['String']['input']>;
  lineItems: InputMaybe<Array<StLineItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  toWarehouseId: InputMaybe<Scalars['ID']['input']>;
  toWarehouseName: InputMaybe<Scalars['String']['input']>;
  transferDate: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  roles: InputMaybe<Array<Scalars['String']['input']>>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorBillInput = {
  billDate: InputMaybe<Scalars['String']['input']>;
  discountAmount: InputMaybe<Scalars['Float']['input']>;
  dueDate: InputMaybe<Scalars['String']['input']>;
  lineItems: InputMaybe<Array<VendorBillLineItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  purchaseOrderId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  subtotal: InputMaybe<Scalars['Float']['input']>;
  taxAmount: InputMaybe<Scalars['Float']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateVendorCreditInput = {
  creditDate: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  reason: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  paymentTerms: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  taxNumber: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorPaymentInput = {
  notes: InputMaybe<Scalars['String']['input']>;
  paymentDate: InputMaybe<Scalars['String']['input']>;
  paymentMethod: InputMaybe<Scalars['String']['input']>;
  referenceNumber: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorPrepaymentInput = {
  notes: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpsertIndividualPriceListInput = {
  customerId: Scalars['ID']['input'];
  lines: Array<IndividualPriceListLineInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  title: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  organizationId: Maybe<Scalars['ID']['output']>;
  roles: Maybe<Array<Scalars['String']['output']>>;
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  userType: Maybe<Scalars['String']['output']>;
};

export type UserList = {
  __typename?: 'UserList';
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  users: Array<User>;
};

export type Vendor = {
  __typename?: 'Vendor';
  address: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  contactPerson: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentTerms: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  taxNumber: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  zipCode: Maybe<Scalars['String']['output']>;
};

export type VendorBill = {
  __typename?: 'VendorBill';
  billDate: Scalars['String']['output'];
  billNumber: Scalars['String']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  discountAmount: Maybe<Scalars['Float']['output']>;
  dueDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lineItems: Array<VendorBillLineItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  outstandingAmount: Scalars['Float']['output'];
  paidAmount: Scalars['Float']['output'];
  purchaseOrderId: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  taxAmount: Maybe<Scalars['Float']['output']>;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  vendor: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorBillLineItem = {
  __typename?: 'VendorBillLineItem';
  description: Scalars['String']['output'];
  discount: Maybe<Scalars['Float']['output']>;
  quantity: Scalars['Float']['output'];
  tax: Maybe<Scalars['Float']['output']>;
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type VendorBillLineItemInput = {
  description: Scalars['String']['input'];
  discount: InputMaybe<Scalars['Float']['input']>;
  quantity: Scalars['Float']['input'];
  tax: InputMaybe<Scalars['Float']['input']>;
  total: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type VendorCredit = {
  __typename?: 'VendorCredit';
  appliedAmount: Scalars['Float']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  creditDate: Scalars['String']['output'];
  creditNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  reason: Maybe<Scalars['String']['output']>;
  remainingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  vendor: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorPayment = {
  __typename?: 'VendorPayment';
  allocations: Array<VendorPaymentAllocation>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentDate: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  paymentNumber: Scalars['String']['output'];
  referenceNumber: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  vendor: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorPaymentAllocation = {
  __typename?: 'VendorPaymentAllocation';
  amount: Scalars['Float']['output'];
  billId: Scalars['ID']['output'];
  billNumber: Maybe<Scalars['String']['output']>;
};

export type VendorPaymentAllocationInput = {
  amount: Scalars['Float']['input'];
  billId: Scalars['ID']['input'];
};

export type VendorPrepayment = {
  __typename?: 'VendorPrepayment';
  amount: Scalars['Float']['output'];
  appliedAmount: Scalars['Float']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paymentMethod: Scalars['String']['output'];
  prepaymentDate: Scalars['String']['output'];
  prepaymentNumber: Scalars['String']['output'];
  referenceNumber: Maybe<Scalars['String']['output']>;
  remainingAmount: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
  vendor: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type Warehouse = {
  __typename?: 'Warehouse';
  address: Scalars['String']['output'];
  capacity: Scalars['Float']['output'];
  contactNumber: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentUtilization: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  managerName: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  warehouseCode: Scalars['String']['output'];
  warehouseName: Scalars['String']['output'];
  warehouseType: Scalars['String']['output'];
};

export type WarehouseBin = {
  __typename?: 'WarehouseBin';
  binCode: Scalars['String']['output'];
  binLocation: Scalars['String']['output'];
  binType: Scalars['String']['output'];
  capacity: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  currentStock: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isAvailable: Scalars['Boolean']['output'];
  organizationId: Scalars['String']['output'];
  warehouseId: Scalars['String']['output'];
};

export type WarehouseBinInput = {
  binCode: Scalars['String']['input'];
  binLocation: Scalars['String']['input'];
  binType: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  organizationId: Scalars['String']['input'];
  warehouseId: Scalars['String']['input'];
};

export type WarehouseInput = {
  address: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  contactNumber: Scalars['String']['input'];
  location: Scalars['String']['input'];
  managerName: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  warehouseCode: Scalars['String']['input'];
  warehouseName: Scalars['String']['input'];
  warehouseType: Scalars['String']['input'];
};

export type WorkOrder = {
  __typename?: 'WorkOrder';
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type WorkOrderInput = {
  docDate: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Address: ResolverTypeWrapper<Partial<Address>>;
  AddressInput: ResolverTypeWrapper<Partial<AddressInput>>;
  Applicant: ResolverTypeWrapper<Partial<Applicant>>;
  ApplicantInput: ResolverTypeWrapper<Partial<ApplicantInput>>;
  Asset: ResolverTypeWrapper<Partial<Asset>>;
  AssetInput: ResolverTypeWrapper<Partial<AssetInput>>;
  Attendance: ResolverTypeWrapper<Partial<Attendance>>;
  AuthPayload: ResolverTypeWrapper<Partial<AuthPayload>>;
  BankAccount: ResolverTypeWrapper<Partial<BankAccount>>;
  BankAccountInput: ResolverTypeWrapper<Partial<BankAccountInput>>;
  BankStatementLine: ResolverTypeWrapper<Partial<BankStatementLine>>;
  BankStatementLineInput: ResolverTypeWrapper<Partial<BankStatementLineInput>>;
  BankTransferInput: ResolverTypeWrapper<Partial<BankTransferInput>>;
  BankTransferResult: ResolverTypeWrapper<Partial<BankTransferResult>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Career: ResolverTypeWrapper<Partial<Career>>;
  CareerInput: ResolverTypeWrapper<Partial<CareerInput>>;
  CashBank: ResolverTypeWrapper<Partial<CashBank>>;
  CashBankInput: ResolverTypeWrapper<Partial<CashBankInput>>;
  ChartOfAccounts: ResolverTypeWrapper<Partial<ChartOfAccounts>>;
  ChartOfAccountsInput: ResolverTypeWrapper<Partial<ChartOfAccountsInput>>;
  Client: ResolverTypeWrapper<Partial<Client>>;
  ClientRef: ResolverTypeWrapper<Partial<ClientRef>>;
  Competency: ResolverTypeWrapper<Partial<Competency>>;
  CompetencyInput: ResolverTypeWrapper<Partial<CompetencyInput>>;
  CreateAttendanceInput: ResolverTypeWrapper<Partial<CreateAttendanceInput>>;
  CreateClientInput: ResolverTypeWrapper<Partial<CreateClientInput>>;
  CreateCustomerDepositInput: ResolverTypeWrapper<Partial<CreateCustomerDepositInput>>;
  CreateCustomerInput: ResolverTypeWrapper<Partial<CreateCustomerInput>>;
  CreateCustomerInvoiceInput: ResolverTypeWrapper<Partial<CreateCustomerInvoiceInput>>;
  CreateCustomerPaymentInput: ResolverTypeWrapper<Partial<CreateCustomerPaymentInput>>;
  CreateCustomerRefundInput: ResolverTypeWrapper<Partial<CreateCustomerRefundInput>>;
  CreateGRNInput: ResolverTypeWrapper<Partial<CreateGrnInput>>;
  CreateItemInput: ResolverTypeWrapper<Partial<CreateItemInput>>;
  CreateLeaveApplicationInput: ResolverTypeWrapper<Partial<CreateLeaveApplicationInput>>;
  CreateLeaveEnrollmentInput: ResolverTypeWrapper<Partial<CreateLeaveEnrollmentInput>>;
  CreateLeaveReinstatementInput: ResolverTypeWrapper<Partial<CreateLeaveReinstatementInput>>;
  CreateLeaveTypeInput: ResolverTypeWrapper<Partial<CreateLeaveTypeInput>>;
  CreateMaterialReceiptInput: ResolverTypeWrapper<Partial<CreateMaterialReceiptInput>>;
  CreateOrgAdminUserInput: ResolverTypeWrapper<Partial<CreateOrgAdminUserInput>>;
  CreateOrganizationInput: ResolverTypeWrapper<Partial<CreateOrganizationInput>>;
  CreateOrganizationWithOrgAdminInput: ResolverTypeWrapper<Partial<CreateOrganizationWithOrgAdminInput>>;
  CreateProductInput: ResolverTypeWrapper<Partial<CreateProductInput>>;
  CreateProjectInput: ResolverTypeWrapper<Partial<CreateProjectInput>>;
  CreatePurchaseOrderInput: ResolverTypeWrapper<Partial<CreatePurchaseOrderInput>>;
  CreateQuotationInput: ResolverTypeWrapper<Partial<CreateQuotationInput>>;
  CreateReturnAuthorizationInput: ResolverTypeWrapper<Partial<CreateReturnAuthorizationInput>>;
  CreateRoleInput: ResolverTypeWrapper<Partial<CreateRoleInput>>;
  CreateSalesEnquiryInput: ResolverTypeWrapper<Partial<CreateSalesEnquiryInput>>;
  CreateSalesOrderInput: ResolverTypeWrapper<Partial<CreateSalesOrderInput>>;
  CreateSalesQuotationInput: ResolverTypeWrapper<Partial<CreateSalesQuotationInput>>;
  CreateStockAdjustmentInput: ResolverTypeWrapper<Partial<CreateStockAdjustmentInput>>;
  CreateStockTransferInput: ResolverTypeWrapper<Partial<CreateStockTransferInput>>;
  CreateUserInput: ResolverTypeWrapper<Partial<CreateUserInput>>;
  CreateVendorBillInput: ResolverTypeWrapper<Partial<CreateVendorBillInput>>;
  CreateVendorCreditInput: ResolverTypeWrapper<Partial<CreateVendorCreditInput>>;
  CreateVendorInput: ResolverTypeWrapper<Partial<CreateVendorInput>>;
  CreateVendorPaymentInput: ResolverTypeWrapper<Partial<CreateVendorPaymentInput>>;
  CreateVendorPrepaymentInput: ResolverTypeWrapper<Partial<CreateVendorPrepaymentInput>>;
  Customer: ResolverTypeWrapper<Partial<Customer>>;
  CustomerDeposit: ResolverTypeWrapper<Partial<CustomerDeposit>>;
  CustomerInvoice: ResolverTypeWrapper<Partial<CustomerInvoice>>;
  CustomerPayment: ResolverTypeWrapper<Partial<CustomerPayment>>;
  CustomerPaymentAllocation: ResolverTypeWrapper<Partial<CustomerPaymentAllocation>>;
  CustomerPaymentAllocationInput: ResolverTypeWrapper<Partial<CustomerPaymentAllocationInput>>;
  CustomerRefund: ResolverTypeWrapper<Partial<CustomerRefund>>;
  CustomerStatement: ResolverTypeWrapper<Partial<CustomerStatement>>;
  CustomerStatementLine: ResolverTypeWrapper<Partial<CustomerStatementLine>>;
  DVS: ResolverTypeWrapper<Partial<Dvs>>;
  DVSInput: ResolverTypeWrapper<Partial<DvsInput>>;
  DeliveryChallan: ResolverTypeWrapper<Partial<DeliveryChallan>>;
  DeliveryChallanInput: ResolverTypeWrapper<Partial<DeliveryChallanInput>>;
  DraftFinanceChargeAssessmentInput: ResolverTypeWrapper<Partial<DraftFinanceChargeAssessmentInput>>;
  EPM: ResolverTypeWrapper<Partial<Epm>>;
  EPMInput: ResolverTypeWrapper<Partial<EpmInput>>;
  Education: ResolverTypeWrapper<Partial<Education>>;
  EducationInput: ResolverTypeWrapper<Partial<EducationInput>>;
  ExciseInvoice: ResolverTypeWrapper<Partial<ExciseInvoice>>;
  ExciseInvoiceInput: ResolverTypeWrapper<Partial<ExciseInvoiceInput>>;
  Experience: ResolverTypeWrapper<Partial<Experience>>;
  ExperienceInput: ResolverTypeWrapper<Partial<ExperienceInput>>;
  Extraction: ResolverTypeWrapper<Partial<Extraction>>;
  ExtractionInput: ResolverTypeWrapper<Partial<ExtractionInput>>;
  FinanceChargeAssessment: ResolverTypeWrapper<Partial<FinanceChargeAssessment>>;
  FinanceChargeLine: ResolverTypeWrapper<Partial<FinanceChargeLine>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  GRN: ResolverTypeWrapper<Partial<Grn>>;
  GRNLineItem: ResolverTypeWrapper<Partial<GrnLineItem>>;
  GRNLineItemInput: ResolverTypeWrapper<Partial<GrnLineItemInput>>;
  GeneralLedger: ResolverTypeWrapper<Partial<GeneralLedger>>;
  GeneralLedgerInput: ResolverTypeWrapper<Partial<GeneralLedgerInput>>;
  GeneratePriceListInput: ResolverTypeWrapper<Partial<GeneratePriceListInput>>;
  Goal: ResolverTypeWrapper<Partial<Goal>>;
  GoalInput: ResolverTypeWrapper<Partial<GoalInput>>;
  GoodsReceipt: ResolverTypeWrapper<Partial<GoodsReceipt>>;
  GoodsReceiptInput: ResolverTypeWrapper<Partial<GoodsReceiptInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  IPInspection: ResolverTypeWrapper<Partial<IpInspection>>;
  IPInspectionInput: ResolverTypeWrapper<Partial<IpInspectionInput>>;
  IndividualPriceList: ResolverTypeWrapper<Partial<IndividualPriceList>>;
  IndividualPriceListLine: ResolverTypeWrapper<Partial<IndividualPriceListLine>>;
  IndividualPriceListLineInput: ResolverTypeWrapper<Partial<IndividualPriceListLineInput>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  InternalOrder: ResolverTypeWrapper<Partial<InternalOrder>>;
  InternalOrderInput: ResolverTypeWrapper<Partial<InternalOrderInput>>;
  InventoryControl: ResolverTypeWrapper<Partial<InventoryControl>>;
  InventoryControlInput: ResolverTypeWrapper<Partial<InventoryControlInput>>;
  InventoryReturn: ResolverTypeWrapper<Partial<InventoryReturn>>;
  InventoryReturnInput: ResolverTypeWrapper<Partial<InventoryReturnInput>>;
  Item: ResolverTypeWrapper<Partial<Item>>;
  LeaveApplication: ResolverTypeWrapper<Partial<LeaveApplication>>;
  LeaveEnrollment: ResolverTypeWrapper<Partial<LeaveEnrollment>>;
  LeaveReinstatement: ResolverTypeWrapper<Partial<LeaveReinstatement>>;
  LeaveType: ResolverTypeWrapper<Partial<LeaveType>>;
  LoanRepayment: ResolverTypeWrapper<Partial<LoanRepayment>>;
  LoanRepaymentInput: ResolverTypeWrapper<Partial<LoanRepaymentInput>>;
  LoginInput: ResolverTypeWrapper<Partial<LoginInput>>;
  MRNLineItem: ResolverTypeWrapper<Partial<MrnLineItem>>;
  MRNLineItemInput: ResolverTypeWrapper<Partial<MrnLineItemInput>>;
  MaterialReceipt: ResolverTypeWrapper<Partial<MaterialReceipt>>;
  Mutation: ResolverTypeWrapper<{}>;
  Organization: ResolverTypeWrapper<Partial<Organization>>;
  POLineItem: ResolverTypeWrapper<Partial<PoLineItem>>;
  POLineItemInput: ResolverTypeWrapper<Partial<PoLineItemInput>>;
  PayrollManagement: ResolverTypeWrapper<Partial<PayrollManagement>>;
  PayrollManagementInput: ResolverTypeWrapper<Partial<PayrollManagementInput>>;
  Permission: ResolverTypeWrapper<Partial<Permission>>;
  PermissionInput: ResolverTypeWrapper<Partial<PermissionInput>>;
  PriceList: ResolverTypeWrapper<Partial<PriceList>>;
  PriceListLine: ResolverTypeWrapper<Partial<PriceListLine>>;
  Product: ResolverTypeWrapper<Partial<Product>>;
  ProductionPlanning: ResolverTypeWrapper<Partial<ProductionPlanning>>;
  ProductionPlanningInput: ResolverTypeWrapper<Partial<ProductionPlanningInput>>;
  Project: ResolverTypeWrapper<Partial<Project>>;
  PurchaseOrder: ResolverTypeWrapper<Partial<PurchaseOrder>>;
  Query: ResolverTypeWrapper<{}>;
  Quotation: ResolverTypeWrapper<Partial<Quotation>>;
  QuotationItem: ResolverTypeWrapper<Partial<QuotationItem>>;
  QuotationItemInput: ResolverTypeWrapper<Partial<QuotationItemInput>>;
  QuotationLineItem: ResolverTypeWrapper<Partial<QuotationLineItem>>;
  QuotationLineItemInput: ResolverTypeWrapper<Partial<QuotationLineItemInput>>;
  RawMaterialRequisition: ResolverTypeWrapper<Partial<RawMaterialRequisition>>;
  RawMaterialRequisitionInput: ResolverTypeWrapper<Partial<RawMaterialRequisitionInput>>;
  ReceiveReturnAuthorizationGoodsInput: ResolverTypeWrapper<Partial<ReceiveReturnAuthorizationGoodsInput>>;
  ReceiveReturnGoodsLineInput: ResolverTypeWrapper<Partial<ReceiveReturnGoodsLineInput>>;
  ReconciliationRule: ResolverTypeWrapper<Partial<ReconciliationRule>>;
  ReconciliationRuleInput: ResolverTypeWrapper<Partial<ReconciliationRuleInput>>;
  ReconciliationRulePatch: ResolverTypeWrapper<Partial<ReconciliationRulePatch>>;
  Recruitment: ResolverTypeWrapper<Partial<Recruitment>>;
  RecruitmentInput: ResolverTypeWrapper<Partial<RecruitmentInput>>;
  RefundCashSaleInput: ResolverTypeWrapper<Partial<RefundCashSaleInput>>;
  RegisterInput: ResolverTypeWrapper<Partial<RegisterInput>>;
  ReturnAuthorization: ResolverTypeWrapper<Partial<ReturnAuthorization>>;
  ReturnAuthorizationLine: ResolverTypeWrapper<Partial<ReturnAuthorizationLine>>;
  ReturnAuthorizationLineInput: ResolverTypeWrapper<Partial<ReturnAuthorizationLineInput>>;
  Role: ResolverTypeWrapper<Partial<Role>>;
  SALineItem: ResolverTypeWrapper<Partial<SaLineItem>>;
  SALineItemInput: ResolverTypeWrapper<Partial<SaLineItemInput>>;
  STLineItem: ResolverTypeWrapper<Partial<StLineItem>>;
  STLineItemInput: ResolverTypeWrapper<Partial<StLineItemInput>>;
  SalaryProcessing: ResolverTypeWrapper<Partial<SalaryProcessing>>;
  SalaryProcessingInput: ResolverTypeWrapper<Partial<SalaryProcessingInput>>;
  SalaryRange: ResolverTypeWrapper<Partial<SalaryRange>>;
  SalaryRangeInput: ResolverTypeWrapper<Partial<SalaryRangeInput>>;
  SalesEnquiry: ResolverTypeWrapper<Partial<SalesEnquiry>>;
  SalesOrder: ResolverTypeWrapper<Partial<SalesOrder>>;
  SalesQuotation: ResolverTypeWrapper<Partial<SalesQuotation>>;
  SalesReturn: ResolverTypeWrapper<Partial<SalesReturn>>;
  SalesReturnInput: ResolverTypeWrapper<Partial<SalesReturnInput>>;
  SendQuotationResult: ResolverTypeWrapper<Partial<SendQuotationResult>>;
  StockAdjustment: ResolverTypeWrapper<Partial<StockAdjustment>>;
  StockMovement: ResolverTypeWrapper<Partial<StockMovement>>;
  StockMovementInput: ResolverTypeWrapper<Partial<StockMovementInput>>;
  StockTransfer: ResolverTypeWrapper<Partial<StockTransfer>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  UpdateAttendanceInput: ResolverTypeWrapper<Partial<UpdateAttendanceInput>>;
  UpdateClientInput: ResolverTypeWrapper<Partial<UpdateClientInput>>;
  UpdateCustomerInput: ResolverTypeWrapper<Partial<UpdateCustomerInput>>;
  UpdateCustomerInvoiceInput: ResolverTypeWrapper<Partial<UpdateCustomerInvoiceInput>>;
  UpdateCustomerPaymentInput: ResolverTypeWrapper<Partial<UpdateCustomerPaymentInput>>;
  UpdateItemInput: ResolverTypeWrapper<Partial<UpdateItemInput>>;
  UpdateLeaveApplicationInput: ResolverTypeWrapper<Partial<UpdateLeaveApplicationInput>>;
  UpdateLeaveEnrollmentInput: ResolverTypeWrapper<Partial<UpdateLeaveEnrollmentInput>>;
  UpdateLeaveReinstatementInput: ResolverTypeWrapper<Partial<UpdateLeaveReinstatementInput>>;
  UpdateLeaveTypeInput: ResolverTypeWrapper<Partial<UpdateLeaveTypeInput>>;
  UpdateMaterialReceiptInput: ResolverTypeWrapper<Partial<UpdateMaterialReceiptInput>>;
  UpdateOrganizationInput: ResolverTypeWrapper<Partial<UpdateOrganizationInput>>;
  UpdateProductInput: ResolverTypeWrapper<Partial<UpdateProductInput>>;
  UpdateProjectInput: ResolverTypeWrapper<Partial<UpdateProjectInput>>;
  UpdatePurchaseOrderInput: ResolverTypeWrapper<Partial<UpdatePurchaseOrderInput>>;
  UpdateQuotationInput: ResolverTypeWrapper<Partial<UpdateQuotationInput>>;
  UpdateRoleInput: ResolverTypeWrapper<Partial<UpdateRoleInput>>;
  UpdateSalesEnquiryInput: ResolverTypeWrapper<Partial<UpdateSalesEnquiryInput>>;
  UpdateSalesOrderInput: ResolverTypeWrapper<Partial<UpdateSalesOrderInput>>;
  UpdateSalesQuotationInput: ResolverTypeWrapper<Partial<UpdateSalesQuotationInput>>;
  UpdateStockAdjustmentInput: ResolverTypeWrapper<Partial<UpdateStockAdjustmentInput>>;
  UpdateStockTransferInput: ResolverTypeWrapper<Partial<UpdateStockTransferInput>>;
  UpdateUserInput: ResolverTypeWrapper<Partial<UpdateUserInput>>;
  UpdateVendorBillInput: ResolverTypeWrapper<Partial<UpdateVendorBillInput>>;
  UpdateVendorCreditInput: ResolverTypeWrapper<Partial<UpdateVendorCreditInput>>;
  UpdateVendorInput: ResolverTypeWrapper<Partial<UpdateVendorInput>>;
  UpdateVendorPaymentInput: ResolverTypeWrapper<Partial<UpdateVendorPaymentInput>>;
  UpdateVendorPrepaymentInput: ResolverTypeWrapper<Partial<UpdateVendorPrepaymentInput>>;
  UpsertIndividualPriceListInput: ResolverTypeWrapper<Partial<UpsertIndividualPriceListInput>>;
  User: ResolverTypeWrapper<Partial<User>>;
  UserList: ResolverTypeWrapper<Partial<UserList>>;
  Vendor: ResolverTypeWrapper<Partial<Vendor>>;
  VendorBill: ResolverTypeWrapper<Partial<VendorBill>>;
  VendorBillLineItem: ResolverTypeWrapper<Partial<VendorBillLineItem>>;
  VendorBillLineItemInput: ResolverTypeWrapper<Partial<VendorBillLineItemInput>>;
  VendorCredit: ResolverTypeWrapper<Partial<VendorCredit>>;
  VendorPayment: ResolverTypeWrapper<Partial<VendorPayment>>;
  VendorPaymentAllocation: ResolverTypeWrapper<Partial<VendorPaymentAllocation>>;
  VendorPaymentAllocationInput: ResolverTypeWrapper<Partial<VendorPaymentAllocationInput>>;
  VendorPrepayment: ResolverTypeWrapper<Partial<VendorPrepayment>>;
  Warehouse: ResolverTypeWrapper<Partial<Warehouse>>;
  WarehouseBin: ResolverTypeWrapper<Partial<WarehouseBin>>;
  WarehouseBinInput: ResolverTypeWrapper<Partial<WarehouseBinInput>>;
  WarehouseInput: ResolverTypeWrapper<Partial<WarehouseInput>>;
  WorkOrder: ResolverTypeWrapper<Partial<WorkOrder>>;
  WorkOrderInput: ResolverTypeWrapper<Partial<WorkOrderInput>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Address: Partial<Address>;
  AddressInput: Partial<AddressInput>;
  Applicant: Partial<Applicant>;
  ApplicantInput: Partial<ApplicantInput>;
  Asset: Partial<Asset>;
  AssetInput: Partial<AssetInput>;
  Attendance: Partial<Attendance>;
  AuthPayload: Partial<AuthPayload>;
  BankAccount: Partial<BankAccount>;
  BankAccountInput: Partial<BankAccountInput>;
  BankStatementLine: Partial<BankStatementLine>;
  BankStatementLineInput: Partial<BankStatementLineInput>;
  BankTransferInput: Partial<BankTransferInput>;
  BankTransferResult: Partial<BankTransferResult>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Career: Partial<Career>;
  CareerInput: Partial<CareerInput>;
  CashBank: Partial<CashBank>;
  CashBankInput: Partial<CashBankInput>;
  ChartOfAccounts: Partial<ChartOfAccounts>;
  ChartOfAccountsInput: Partial<ChartOfAccountsInput>;
  Client: Partial<Client>;
  ClientRef: Partial<ClientRef>;
  Competency: Partial<Competency>;
  CompetencyInput: Partial<CompetencyInput>;
  CreateAttendanceInput: Partial<CreateAttendanceInput>;
  CreateClientInput: Partial<CreateClientInput>;
  CreateCustomerDepositInput: Partial<CreateCustomerDepositInput>;
  CreateCustomerInput: Partial<CreateCustomerInput>;
  CreateCustomerInvoiceInput: Partial<CreateCustomerInvoiceInput>;
  CreateCustomerPaymentInput: Partial<CreateCustomerPaymentInput>;
  CreateCustomerRefundInput: Partial<CreateCustomerRefundInput>;
  CreateGRNInput: Partial<CreateGrnInput>;
  CreateItemInput: Partial<CreateItemInput>;
  CreateLeaveApplicationInput: Partial<CreateLeaveApplicationInput>;
  CreateLeaveEnrollmentInput: Partial<CreateLeaveEnrollmentInput>;
  CreateLeaveReinstatementInput: Partial<CreateLeaveReinstatementInput>;
  CreateLeaveTypeInput: Partial<CreateLeaveTypeInput>;
  CreateMaterialReceiptInput: Partial<CreateMaterialReceiptInput>;
  CreateOrgAdminUserInput: Partial<CreateOrgAdminUserInput>;
  CreateOrganizationInput: Partial<CreateOrganizationInput>;
  CreateOrganizationWithOrgAdminInput: Partial<CreateOrganizationWithOrgAdminInput>;
  CreateProductInput: Partial<CreateProductInput>;
  CreateProjectInput: Partial<CreateProjectInput>;
  CreatePurchaseOrderInput: Partial<CreatePurchaseOrderInput>;
  CreateQuotationInput: Partial<CreateQuotationInput>;
  CreateReturnAuthorizationInput: Partial<CreateReturnAuthorizationInput>;
  CreateRoleInput: Partial<CreateRoleInput>;
  CreateSalesEnquiryInput: Partial<CreateSalesEnquiryInput>;
  CreateSalesOrderInput: Partial<CreateSalesOrderInput>;
  CreateSalesQuotationInput: Partial<CreateSalesQuotationInput>;
  CreateStockAdjustmentInput: Partial<CreateStockAdjustmentInput>;
  CreateStockTransferInput: Partial<CreateStockTransferInput>;
  CreateUserInput: Partial<CreateUserInput>;
  CreateVendorBillInput: Partial<CreateVendorBillInput>;
  CreateVendorCreditInput: Partial<CreateVendorCreditInput>;
  CreateVendorInput: Partial<CreateVendorInput>;
  CreateVendorPaymentInput: Partial<CreateVendorPaymentInput>;
  CreateVendorPrepaymentInput: Partial<CreateVendorPrepaymentInput>;
  Customer: Partial<Customer>;
  CustomerDeposit: Partial<CustomerDeposit>;
  CustomerInvoice: Partial<CustomerInvoice>;
  CustomerPayment: Partial<CustomerPayment>;
  CustomerPaymentAllocation: Partial<CustomerPaymentAllocation>;
  CustomerPaymentAllocationInput: Partial<CustomerPaymentAllocationInput>;
  CustomerRefund: Partial<CustomerRefund>;
  CustomerStatement: Partial<CustomerStatement>;
  CustomerStatementLine: Partial<CustomerStatementLine>;
  DVS: Partial<Dvs>;
  DVSInput: Partial<DvsInput>;
  DeliveryChallan: Partial<DeliveryChallan>;
  DeliveryChallanInput: Partial<DeliveryChallanInput>;
  DraftFinanceChargeAssessmentInput: Partial<DraftFinanceChargeAssessmentInput>;
  EPM: Partial<Epm>;
  EPMInput: Partial<EpmInput>;
  Education: Partial<Education>;
  EducationInput: Partial<EducationInput>;
  ExciseInvoice: Partial<ExciseInvoice>;
  ExciseInvoiceInput: Partial<ExciseInvoiceInput>;
  Experience: Partial<Experience>;
  ExperienceInput: Partial<ExperienceInput>;
  Extraction: Partial<Extraction>;
  ExtractionInput: Partial<ExtractionInput>;
  FinanceChargeAssessment: Partial<FinanceChargeAssessment>;
  FinanceChargeLine: Partial<FinanceChargeLine>;
  Float: Partial<Scalars['Float']['output']>;
  GRN: Partial<Grn>;
  GRNLineItem: Partial<GrnLineItem>;
  GRNLineItemInput: Partial<GrnLineItemInput>;
  GeneralLedger: Partial<GeneralLedger>;
  GeneralLedgerInput: Partial<GeneralLedgerInput>;
  GeneratePriceListInput: Partial<GeneratePriceListInput>;
  Goal: Partial<Goal>;
  GoalInput: Partial<GoalInput>;
  GoodsReceipt: Partial<GoodsReceipt>;
  GoodsReceiptInput: Partial<GoodsReceiptInput>;
  ID: Partial<Scalars['ID']['output']>;
  IPInspection: Partial<IpInspection>;
  IPInspectionInput: Partial<IpInspectionInput>;
  IndividualPriceList: Partial<IndividualPriceList>;
  IndividualPriceListLine: Partial<IndividualPriceListLine>;
  IndividualPriceListLineInput: Partial<IndividualPriceListLineInput>;
  Int: Partial<Scalars['Int']['output']>;
  InternalOrder: Partial<InternalOrder>;
  InternalOrderInput: Partial<InternalOrderInput>;
  InventoryControl: Partial<InventoryControl>;
  InventoryControlInput: Partial<InventoryControlInput>;
  InventoryReturn: Partial<InventoryReturn>;
  InventoryReturnInput: Partial<InventoryReturnInput>;
  Item: Partial<Item>;
  LeaveApplication: Partial<LeaveApplication>;
  LeaveEnrollment: Partial<LeaveEnrollment>;
  LeaveReinstatement: Partial<LeaveReinstatement>;
  LeaveType: Partial<LeaveType>;
  LoanRepayment: Partial<LoanRepayment>;
  LoanRepaymentInput: Partial<LoanRepaymentInput>;
  LoginInput: Partial<LoginInput>;
  MRNLineItem: Partial<MrnLineItem>;
  MRNLineItemInput: Partial<MrnLineItemInput>;
  MaterialReceipt: Partial<MaterialReceipt>;
  Mutation: {};
  Organization: Partial<Organization>;
  POLineItem: Partial<PoLineItem>;
  POLineItemInput: Partial<PoLineItemInput>;
  PayrollManagement: Partial<PayrollManagement>;
  PayrollManagementInput: Partial<PayrollManagementInput>;
  Permission: Partial<Permission>;
  PermissionInput: Partial<PermissionInput>;
  PriceList: Partial<PriceList>;
  PriceListLine: Partial<PriceListLine>;
  Product: Partial<Product>;
  ProductionPlanning: Partial<ProductionPlanning>;
  ProductionPlanningInput: Partial<ProductionPlanningInput>;
  Project: Partial<Project>;
  PurchaseOrder: Partial<PurchaseOrder>;
  Query: {};
  Quotation: Partial<Quotation>;
  QuotationItem: Partial<QuotationItem>;
  QuotationItemInput: Partial<QuotationItemInput>;
  QuotationLineItem: Partial<QuotationLineItem>;
  QuotationLineItemInput: Partial<QuotationLineItemInput>;
  RawMaterialRequisition: Partial<RawMaterialRequisition>;
  RawMaterialRequisitionInput: Partial<RawMaterialRequisitionInput>;
  ReceiveReturnAuthorizationGoodsInput: Partial<ReceiveReturnAuthorizationGoodsInput>;
  ReceiveReturnGoodsLineInput: Partial<ReceiveReturnGoodsLineInput>;
  ReconciliationRule: Partial<ReconciliationRule>;
  ReconciliationRuleInput: Partial<ReconciliationRuleInput>;
  ReconciliationRulePatch: Partial<ReconciliationRulePatch>;
  Recruitment: Partial<Recruitment>;
  RecruitmentInput: Partial<RecruitmentInput>;
  RefundCashSaleInput: Partial<RefundCashSaleInput>;
  RegisterInput: Partial<RegisterInput>;
  ReturnAuthorization: Partial<ReturnAuthorization>;
  ReturnAuthorizationLine: Partial<ReturnAuthorizationLine>;
  ReturnAuthorizationLineInput: Partial<ReturnAuthorizationLineInput>;
  Role: Partial<Role>;
  SALineItem: Partial<SaLineItem>;
  SALineItemInput: Partial<SaLineItemInput>;
  STLineItem: Partial<StLineItem>;
  STLineItemInput: Partial<StLineItemInput>;
  SalaryProcessing: Partial<SalaryProcessing>;
  SalaryProcessingInput: Partial<SalaryProcessingInput>;
  SalaryRange: Partial<SalaryRange>;
  SalaryRangeInput: Partial<SalaryRangeInput>;
  SalesEnquiry: Partial<SalesEnquiry>;
  SalesOrder: Partial<SalesOrder>;
  SalesQuotation: Partial<SalesQuotation>;
  SalesReturn: Partial<SalesReturn>;
  SalesReturnInput: Partial<SalesReturnInput>;
  SendQuotationResult: Partial<SendQuotationResult>;
  StockAdjustment: Partial<StockAdjustment>;
  StockMovement: Partial<StockMovement>;
  StockMovementInput: Partial<StockMovementInput>;
  StockTransfer: Partial<StockTransfer>;
  String: Partial<Scalars['String']['output']>;
  UpdateAttendanceInput: Partial<UpdateAttendanceInput>;
  UpdateClientInput: Partial<UpdateClientInput>;
  UpdateCustomerInput: Partial<UpdateCustomerInput>;
  UpdateCustomerInvoiceInput: Partial<UpdateCustomerInvoiceInput>;
  UpdateCustomerPaymentInput: Partial<UpdateCustomerPaymentInput>;
  UpdateItemInput: Partial<UpdateItemInput>;
  UpdateLeaveApplicationInput: Partial<UpdateLeaveApplicationInput>;
  UpdateLeaveEnrollmentInput: Partial<UpdateLeaveEnrollmentInput>;
  UpdateLeaveReinstatementInput: Partial<UpdateLeaveReinstatementInput>;
  UpdateLeaveTypeInput: Partial<UpdateLeaveTypeInput>;
  UpdateMaterialReceiptInput: Partial<UpdateMaterialReceiptInput>;
  UpdateOrganizationInput: Partial<UpdateOrganizationInput>;
  UpdateProductInput: Partial<UpdateProductInput>;
  UpdateProjectInput: Partial<UpdateProjectInput>;
  UpdatePurchaseOrderInput: Partial<UpdatePurchaseOrderInput>;
  UpdateQuotationInput: Partial<UpdateQuotationInput>;
  UpdateRoleInput: Partial<UpdateRoleInput>;
  UpdateSalesEnquiryInput: Partial<UpdateSalesEnquiryInput>;
  UpdateSalesOrderInput: Partial<UpdateSalesOrderInput>;
  UpdateSalesQuotationInput: Partial<UpdateSalesQuotationInput>;
  UpdateStockAdjustmentInput: Partial<UpdateStockAdjustmentInput>;
  UpdateStockTransferInput: Partial<UpdateStockTransferInput>;
  UpdateUserInput: Partial<UpdateUserInput>;
  UpdateVendorBillInput: Partial<UpdateVendorBillInput>;
  UpdateVendorCreditInput: Partial<UpdateVendorCreditInput>;
  UpdateVendorInput: Partial<UpdateVendorInput>;
  UpdateVendorPaymentInput: Partial<UpdateVendorPaymentInput>;
  UpdateVendorPrepaymentInput: Partial<UpdateVendorPrepaymentInput>;
  UpsertIndividualPriceListInput: Partial<UpsertIndividualPriceListInput>;
  User: Partial<User>;
  UserList: Partial<UserList>;
  Vendor: Partial<Vendor>;
  VendorBill: Partial<VendorBill>;
  VendorBillLineItem: Partial<VendorBillLineItem>;
  VendorBillLineItemInput: Partial<VendorBillLineItemInput>;
  VendorCredit: Partial<VendorCredit>;
  VendorPayment: Partial<VendorPayment>;
  VendorPaymentAllocation: Partial<VendorPaymentAllocation>;
  VendorPaymentAllocationInput: Partial<VendorPaymentAllocationInput>;
  VendorPrepayment: Partial<VendorPrepayment>;
  Warehouse: Partial<Warehouse>;
  WarehouseBin: Partial<WarehouseBin>;
  WarehouseBinInput: Partial<WarehouseBinInput>;
  WarehouseInput: Partial<WarehouseInput>;
  WorkOrder: Partial<WorkOrder>;
  WorkOrderInput: Partial<WorkOrderInput>;
}>;

export type AddressResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  city: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApplicantResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Applicant'] = ResolversParentTypes['Applicant']> = ResolversObject<{
  address: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  alternatePhone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  applicantNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  applicationStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coverLetterUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfBirth: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  education: Resolver<Array<ResolversTypes['Education']>, ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  experience: Resolver<Maybe<Array<ResolversTypes['Experience']>>, ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nationality: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resumeUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skills: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  source: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AssetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = ResolversObject<{
  assetName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assetNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assetType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignedTo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentValue: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  depreciationMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  manufacturer: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purchaseDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purchasePrice: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  serialNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usefulLife: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  warrantyExpiry: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AttendanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Attendance'] = ResolversParentTypes['Attendance']> = ResolversObject<{
  checkIn: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  checkOut: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  token: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BankAccountResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BankAccount'] = ResolversParentTypes['BankAccount']> = ResolversObject<{
  accountHolder: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  accountName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bankName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  branchName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentBalance: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BankStatementLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BankStatementLine'] = ResolversParentTypes['BankStatementLine']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bankAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bankReference: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isMatched: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lineDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lineKind: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matchedCashBankId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BankTransferResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BankTransferResult'] = ResolversParentTypes['BankTransferResult']> = ResolversObject<{
  fromCashBankId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromTransactionNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toCashBankId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toTransactionNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transferId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CareerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Career'] = ResolversParentTypes['Career']> = ResolversObject<{
  closingDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  department: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  experienceRequired: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jobTitle: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  openings: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postedDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  qualifications: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  responsibilities: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salaryRange: Resolver<ResolversTypes['SalaryRange'], ParentType, ContextType>;
  skills: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CashBankResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CashBank'] = ResolversParentTypes['CashBank']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bankAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chequeNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reconciliationDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reconciliationStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceModule: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChartOfAccountsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChartOfAccounts'] = ResolversParentTypes['ChartOfAccounts']> = ResolversObject<{
  accountCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  level: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentAccount: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  industry: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  website: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientRefResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClientRef'] = ResolversParentTypes['ClientRef']> = ResolversObject<{
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompetencyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Competency'] = ResolversParentTypes['Competency']> = ResolversObject<{
  competency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactPerson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceBillable: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentTerms: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerDepositResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerDeposit'] = ResolversParentTypes['CustomerDeposit']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  depositDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  depositMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  depositNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  referenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerInvoiceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerInvoice'] = ResolversParentTypes['CustomerInvoice']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  dueDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outstandingAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  paidAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  salesOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerPaymentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerPayment'] = ResolversParentTypes['CustomerPayment']> = ResolversObject<{
  allocations: Resolver<Array<ResolversTypes['CustomerPaymentAllocation']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerPaymentAllocationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerPaymentAllocation'] = ResolversParentTypes['CustomerPaymentAllocation']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  invoiceId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerRefundResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerRefund'] = ResolversParentTypes['CustomerRefund']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  customerInvoiceId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoice: Resolver<Maybe<ResolversTypes['CustomerInvoice']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  referenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refundDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refundMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refundNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerStatementResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerStatement'] = ResolversParentTypes['CustomerStatement']> = ResolversObject<{
  currentBalance: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  dateFrom: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateTo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['CustomerStatementLine']>, ParentType, ContextType>;
  periodInvoicesTotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  periodPaymentsTotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerStatementLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerStatementLine'] = ResolversParentTypes['CustomerStatementLine']> = ResolversObject<{
  credit: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  date: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  debit: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kind: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reference: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DvsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DVS'] = ResolversParentTypes['DVS']> = ResolversObject<{
  applicantId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiryDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issueDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  issuingAuthority: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationNotes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verifiedBy: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeliveryChallanResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryChallan'] = ResolversParentTypes['DeliveryChallan']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EpmResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EPM'] = ResolversParentTypes['EPM']> = ResolversObject<{
  areasOfImprovement: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comments: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  competencies: Resolver<Array<ResolversTypes['Competency']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goals: Resolver<Array<ResolversTypes['Goal']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  overallRating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewPeriod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewYear: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reviewerId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  strengths: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trainingRecommendations: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EducationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Education'] = ResolversParentTypes['Education']> = ResolversObject<{
  degree: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  grade: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  institution: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExciseInvoiceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ExciseInvoice'] = ResolversParentTypes['ExciseInvoice']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExperienceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Experience'] = ResolversParentTypes['Experience']> = ResolversObject<{
  company: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  current: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  from: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  to: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExtractionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Extraction'] = ResolversParentTypes['Extraction']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  destinationLocation: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  extractionDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extractionNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extractionType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productionOrderId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rawMaterialId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rawMaterialName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requisitionId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceLocation: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FinanceChargeAssessmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FinanceChargeAssessment'] = ResolversParentTypes['FinanceChargeAssessment']> = ResolversObject<{
  annualRatePercent: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  asOfDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assessmentNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['FinanceChargeLine']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalChargeAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FinanceChargeLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FinanceChargeLine'] = ResolversParentTypes['FinanceChargeLine']> = ResolversObject<{
  chargeAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  daysOverdue: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  invoiceId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  outstandingBefore: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GrnResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GRN'] = ResolversParentTypes['GRN']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  grnNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['GRNLineItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  purchaseOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  receivedDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  vendorName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GrnLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GRNLineItem'] = ResolversParentTypes['GRNLineItem']> = ResolversObject<{
  itemDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderedQty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  receivedQty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeneralLedgerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GeneralLedger'] = ResolversParentTypes['GeneralLedger']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creditAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  debitAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fiscalPeriod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fiscalYear: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceModule: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GoalResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Goal'] = ResolversParentTypes['Goal']> = ResolversObject<{
  achievement: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  goal: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weight: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GoodsReceiptResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GoodsReceipt'] = ResolversParentTypes['GoodsReceipt']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IpInspectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IPInspection'] = ResolversParentTypes['IPInspection']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IndividualPriceListResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IndividualPriceList'] = ResolversParentTypes['IndividualPriceList']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['IndividualPriceListLine']>, ParentType, ContextType>;
  listNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IndividualPriceListLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IndividualPriceListLine'] = ResolversParentTypes['IndividualPriceListLine']> = ResolversObject<{
  category: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerRate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  itemId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  standardRate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InternalOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InternalOrder'] = ResolversParentTypes['InternalOrder']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InventoryControlResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InventoryControl'] = ResolversParentTypes['InventoryControl']> = ResolversObject<{
  binLocation: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  itemId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  itemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastStockDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxStockLevel: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minStockLevel: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reorderPoint: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stockStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  warehouseId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InventoryReturnResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InventoryReturn'] = ResolversParentTypes['InventoryReturn']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = ResolversObject<{
  category: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeaveApplicationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LeaveApplication'] = ResolversParentTypes['LeaveApplication']> = ResolversObject<{
  approvedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leaveTypeId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rejectedReason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalDays: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeaveEnrollmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LeaveEnrollment'] = ResolversParentTypes['LeaveEnrollment']> = ResolversObject<{
  calendarYear: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  carriedForward: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entitledDays: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leaveTypeId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedDays: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeaveReinstatementResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LeaveReinstatement'] = ResolversParentTypes['LeaveReinstatement']> = ResolversObject<{
  calendarYear: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  daysRestored: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leaveApplicationId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  leaveTypeId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reviewNotes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewedBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeaveTypeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LeaveType'] = ResolversParentTypes['LeaveType']> = ResolversObject<{
  active: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  allowCarryForward: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  defaultDaysPerYear: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maxCarryForwardDays: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paid: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoanRepaymentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LoanRepayment'] = ResolversParentTypes['LoanRepayment']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employeeNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loanReference: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payPeriodEnd: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payPeriodStart: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remarks: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repaymentAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MrnLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MRNLineItem'] = ResolversParentTypes['MRNLineItem']> = ResolversObject<{
  itemDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lineTotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  orderedQty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  receivedQty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rejectedQty: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unitPrice: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MaterialReceiptResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MaterialReceipt'] = ResolversParentTypes['MaterialReceipt']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['MRNLineItem']>, ParentType, ContextType>;
  mrnNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  purchaseOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  purchaseOrderNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  receiptDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendorId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  vendorName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  warehouseId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  warehouseName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  adjustStock: Resolver<ResolversTypes['InventoryControl'], ParentType, ContextType, RequireFields<MutationAdjustStockArgs, 'binLocation' | 'itemId' | 'quantity' | 'reason'>>;
  approveLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationApproveLeaveApplicationArgs, 'id'>>;
  approveLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationApproveLeaveReinstatementArgs, 'id'>>;
  approvePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationApprovePurchaseOrderArgs, 'id'>>;
  approveReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationApproveReturnAuthorizationArgs, 'id'>>;
  approveVendorBill: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationApproveVendorBillArgs, 'id'>>;
  billPurchaseOrder: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationBillPurchaseOrderArgs, 'billDate' | 'dueDate' | 'id'>>;
  cancelCustomerDeposit: Resolver<ResolversTypes['CustomerDeposit'], ParentType, ContextType, RequireFields<MutationCancelCustomerDepositArgs, 'id'>>;
  cancelCustomerRefund: Resolver<ResolversTypes['CustomerRefund'], ParentType, ContextType, RequireFields<MutationCancelCustomerRefundArgs, 'id'>>;
  cancelFinanceChargeAssessment: Resolver<ResolversTypes['FinanceChargeAssessment'], ParentType, ContextType, RequireFields<MutationCancelFinanceChargeAssessmentArgs, 'id'>>;
  cancelMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationCancelMaterialReceiptArgs, 'id'>>;
  cancelReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationCancelReturnAuthorizationArgs, 'id'>>;
  cancelStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationCancelStockAdjustmentArgs, 'id'>>;
  cancelStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationCancelStockTransferArgs, 'id'>>;
  confirmMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationConfirmMaterialReceiptArgs, 'id'>>;
  confirmStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationConfirmStockAdjustmentArgs, 'id'>>;
  confirmStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationConfirmStockTransferArgs, 'id'>>;
  createApplicant: Resolver<ResolversTypes['Applicant'], ParentType, ContextType, RequireFields<MutationCreateApplicantArgs, 'input'>>;
  createAsset: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationCreateAssetArgs, 'input'>>;
  createAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationCreateAttendanceArgs, 'input'>>;
  createBankAccount: Resolver<ResolversTypes['BankAccount'], ParentType, ContextType, RequireFields<MutationCreateBankAccountArgs, 'input'>>;
  createBankStatementLine: Resolver<ResolversTypes['BankStatementLine'], ParentType, ContextType, RequireFields<MutationCreateBankStatementLineArgs, 'input'>>;
  createCareer: Resolver<ResolversTypes['Career'], ParentType, ContextType, RequireFields<MutationCreateCareerArgs, 'input'>>;
  createCashBank: Resolver<ResolversTypes['CashBank'], ParentType, ContextType, RequireFields<MutationCreateCashBankArgs, 'input'>>;
  createChartOfAccount: Resolver<ResolversTypes['ChartOfAccounts'], ParentType, ContextType, RequireFields<MutationCreateChartOfAccountArgs, 'input'>>;
  createClient: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createCustomer: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'input'>>;
  createCustomerDeposit: Resolver<ResolversTypes['CustomerDeposit'], ParentType, ContextType, RequireFields<MutationCreateCustomerDepositArgs, 'input'>>;
  createCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationCreateCustomerInvoiceArgs, 'input'>>;
  createCustomerPayment: Resolver<ResolversTypes['CustomerPayment'], ParentType, ContextType, RequireFields<MutationCreateCustomerPaymentArgs, 'input'>>;
  createCustomerRefund: Resolver<ResolversTypes['CustomerRefund'], ParentType, ContextType, RequireFields<MutationCreateCustomerRefundArgs, 'input'>>;
  createDVS: Resolver<ResolversTypes['DVS'], ParentType, ContextType, RequireFields<MutationCreateDvsArgs, 'input'>>;
  createDeliveryChallan: Resolver<ResolversTypes['DeliveryChallan'], ParentType, ContextType, RequireFields<MutationCreateDeliveryChallanArgs, 'input'>>;
  createEPM: Resolver<ResolversTypes['EPM'], ParentType, ContextType, RequireFields<MutationCreateEpmArgs, 'input'>>;
  createExciseInvoice: Resolver<ResolversTypes['ExciseInvoice'], ParentType, ContextType, RequireFields<MutationCreateExciseInvoiceArgs, 'input'>>;
  createExtraction: Resolver<ResolversTypes['Extraction'], ParentType, ContextType, RequireFields<MutationCreateExtractionArgs, 'input'>>;
  createGRN: Resolver<ResolversTypes['GRN'], ParentType, ContextType, RequireFields<MutationCreateGrnArgs, 'input'>>;
  createGeneralLedger: Resolver<ResolversTypes['GeneralLedger'], ParentType, ContextType, RequireFields<MutationCreateGeneralLedgerArgs, 'input'>>;
  createGoodsReceipt: Resolver<ResolversTypes['GoodsReceipt'], ParentType, ContextType, RequireFields<MutationCreateGoodsReceiptArgs, 'input'>>;
  createIPInspection: Resolver<ResolversTypes['IPInspection'], ParentType, ContextType, RequireFields<MutationCreateIpInspectionArgs, 'input'>>;
  createInternalOrder: Resolver<ResolversTypes['InternalOrder'], ParentType, ContextType, RequireFields<MutationCreateInternalOrderArgs, 'input'>>;
  createInventoryControl: Resolver<ResolversTypes['InventoryControl'], ParentType, ContextType, RequireFields<MutationCreateInventoryControlArgs, 'input'>>;
  createInventoryReturn: Resolver<ResolversTypes['InventoryReturn'], ParentType, ContextType, RequireFields<MutationCreateInventoryReturnArgs, 'input'>>;
  createItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationCreateItemArgs, 'input'>>;
  createLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationCreateLeaveApplicationArgs, 'input'>>;
  createLeaveEnrollment: Resolver<ResolversTypes['LeaveEnrollment'], ParentType, ContextType, RequireFields<MutationCreateLeaveEnrollmentArgs, 'input'>>;
  createLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationCreateLeaveReinstatementArgs, 'input'>>;
  createLeaveType: Resolver<ResolversTypes['LeaveType'], ParentType, ContextType, RequireFields<MutationCreateLeaveTypeArgs, 'input'>>;
  createLoanRepayment: Resolver<ResolversTypes['LoanRepayment'], ParentType, ContextType, RequireFields<MutationCreateLoanRepaymentArgs, 'input'>>;
  createMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationCreateMaterialReceiptArgs, 'input'>>;
  createOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'input'>>;
  createOrganizationWithOrgAdmin: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationCreateOrganizationWithOrgAdminArgs, 'input'>>;
  createPayrollManagement: Resolver<ResolversTypes['PayrollManagement'], ParentType, ContextType, RequireFields<MutationCreatePayrollManagementArgs, 'input'>>;
  createProduct: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createProductionPlanning: Resolver<ResolversTypes['ProductionPlanning'], ParentType, ContextType, RequireFields<MutationCreateProductionPlanningArgs, 'input'>>;
  createProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  createPurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationCreatePurchaseOrderArgs, 'input'>>;
  createQuotation: Resolver<ResolversTypes['Quotation'], ParentType, ContextType, RequireFields<MutationCreateQuotationArgs, 'input'>>;
  createRawMaterialRequisition: Resolver<ResolversTypes['RawMaterialRequisition'], ParentType, ContextType, RequireFields<MutationCreateRawMaterialRequisitionArgs, 'input'>>;
  createReconciliationRule: Resolver<ResolversTypes['ReconciliationRule'], ParentType, ContextType, RequireFields<MutationCreateReconciliationRuleArgs, 'input'>>;
  createRecruitment: Resolver<ResolversTypes['Recruitment'], ParentType, ContextType, RequireFields<MutationCreateRecruitmentArgs, 'input'>>;
  createReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationCreateReturnAuthorizationArgs, 'input'>>;
  createRole: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'input'>>;
  createSalaryProcessing: Resolver<ResolversTypes['SalaryProcessing'], ParentType, ContextType, RequireFields<MutationCreateSalaryProcessingArgs, 'input'>>;
  createSalesEnquiry: Resolver<ResolversTypes['SalesEnquiry'], ParentType, ContextType, RequireFields<MutationCreateSalesEnquiryArgs, 'input'>>;
  createSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationCreateSalesOrderArgs, 'input'>>;
  createSalesQuotation: Resolver<ResolversTypes['SalesQuotation'], ParentType, ContextType, RequireFields<MutationCreateSalesQuotationArgs, 'input'>>;
  createSalesReturn: Resolver<ResolversTypes['SalesReturn'], ParentType, ContextType, RequireFields<MutationCreateSalesReturnArgs, 'input'>>;
  createStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationCreateStockAdjustmentArgs, 'input'>>;
  createStockMovement: Resolver<ResolversTypes['StockMovement'], ParentType, ContextType, RequireFields<MutationCreateStockMovementArgs, 'input'>>;
  createStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationCreateStockTransferArgs, 'input'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVendor: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'input'>>;
  createVendorBill: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationCreateVendorBillArgs, 'input'>>;
  createVendorCredit: Resolver<ResolversTypes['VendorCredit'], ParentType, ContextType, RequireFields<MutationCreateVendorCreditArgs, 'input'>>;
  createVendorPayment: Resolver<ResolversTypes['VendorPayment'], ParentType, ContextType, RequireFields<MutationCreateVendorPaymentArgs, 'input'>>;
  createVendorPrepayment: Resolver<ResolversTypes['VendorPrepayment'], ParentType, ContextType, RequireFields<MutationCreateVendorPrepaymentArgs, 'input'>>;
  createWarehouse: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationCreateWarehouseArgs, 'input'>>;
  createWarehouseBin: Resolver<ResolversTypes['WarehouseBin'], ParentType, ContextType, RequireFields<MutationCreateWarehouseBinArgs, 'input'>>;
  createWorkOrder: Resolver<ResolversTypes['WorkOrder'], ParentType, ContextType, RequireFields<MutationCreateWorkOrderArgs, 'input'>>;
  deleteApplicant: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteApplicantArgs, 'id'>>;
  deleteAsset: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'id'>>;
  deleteAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationDeleteAttendanceArgs, 'id'>>;
  deleteBankStatementLine: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBankStatementLineArgs, 'id'>>;
  deleteCareer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCareerArgs, 'id'>>;
  deleteChartOfAccount: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteChartOfAccountArgs, 'id'>>;
  deleteClient: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'id'>>;
  deleteCustomer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'id'>>;
  deleteCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationDeleteCustomerInvoiceArgs, 'id'>>;
  deleteCustomerPayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCustomerPaymentArgs, 'id'>>;
  deleteDVS: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDvsArgs, 'id'>>;
  deleteDeliveryChallan: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDeliveryChallanArgs, 'id'>>;
  deleteEPM: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEpmArgs, 'id'>>;
  deleteExciseInvoice: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteExciseInvoiceArgs, 'id'>>;
  deleteExtraction: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteExtractionArgs, 'id'>>;
  deleteFinanceChargeAssessment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteFinanceChargeAssessmentArgs, 'id'>>;
  deleteGRN: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteGrnArgs, 'id'>>;
  deleteGoodsReceipt: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteGoodsReceiptArgs, 'id'>>;
  deleteIPInspection: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteIpInspectionArgs, 'id'>>;
  deleteIndividualPriceList: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteIndividualPriceListArgs, 'id'>>;
  deleteInternalOrder: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteInternalOrderArgs, 'id'>>;
  deleteInventoryReturn: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteInventoryReturnArgs, 'id'>>;
  deleteItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationDeleteItemArgs, 'id'>>;
  deleteLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationDeleteLeaveApplicationArgs, 'id'>>;
  deleteLeaveEnrollment: Resolver<ResolversTypes['LeaveEnrollment'], ParentType, ContextType, RequireFields<MutationDeleteLeaveEnrollmentArgs, 'id'>>;
  deleteLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationDeleteLeaveReinstatementArgs, 'id'>>;
  deleteLeaveType: Resolver<ResolversTypes['LeaveType'], ParentType, ContextType, RequireFields<MutationDeleteLeaveTypeArgs, 'id'>>;
  deleteLoanRepayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteLoanRepaymentArgs, 'id'>>;
  deleteMaterialReceipt: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMaterialReceiptArgs, 'id'>>;
  deleteOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'id'>>;
  deletePayrollManagement: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePayrollManagementArgs, 'id'>>;
  deleteProduct: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteProductionPlanning: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductionPlanningArgs, 'id'>>;
  deleteProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deletePurchaseOrder: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePurchaseOrderArgs, 'id'>>;
  deleteQuotation: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteQuotationArgs, 'id'>>;
  deleteReconciliationRule: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteReconciliationRuleArgs, 'id'>>;
  deleteReturnAuthorization: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteReturnAuthorizationArgs, 'id'>>;
  deleteRole: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteSalaryProcessing: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSalaryProcessingArgs, 'id'>>;
  deleteSalesEnquiry: Resolver<ResolversTypes['SalesEnquiry'], ParentType, ContextType, RequireFields<MutationDeleteSalesEnquiryArgs, 'id'>>;
  deleteSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationDeleteSalesOrderArgs, 'id'>>;
  deleteSalesQuotation: Resolver<ResolversTypes['SalesQuotation'], ParentType, ContextType, RequireFields<MutationDeleteSalesQuotationArgs, 'id'>>;
  deleteSalesReturn: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSalesReturnArgs, 'id'>>;
  deleteStockAdjustment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStockAdjustmentArgs, 'id'>>;
  deleteStockTransfer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStockTransferArgs, 'id'>>;
  deleteUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteVendor: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorArgs, 'id'>>;
  deleteVendorBill: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorBillArgs, 'id'>>;
  deleteVendorCredit: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorCreditArgs, 'id'>>;
  deleteVendorPayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorPaymentArgs, 'id'>>;
  deleteVendorPrepayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorPrepaymentArgs, 'id'>>;
  deleteWorkOrder: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteWorkOrderArgs, 'id'>>;
  draftFinanceChargeAssessment: Resolver<ResolversTypes['FinanceChargeAssessment'], ParentType, ContextType, RequireFields<MutationDraftFinanceChargeAssessmentArgs, 'input'>>;
  generatePriceList: Resolver<ResolversTypes['PriceList'], ParentType, ContextType, RequireFields<MutationGeneratePriceListArgs, 'input'>>;
  login: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  matchBankStatementLineToBook: Resolver<ResolversTypes['BankStatementLine'], ParentType, ContextType, RequireFields<MutationMatchBankStatementLineToBookArgs, 'bankStatementLineId' | 'cashBankId'>>;
  postFinanceChargeAssessment: Resolver<ResolversTypes['FinanceChargeAssessment'], ParentType, ContextType, RequireFields<MutationPostFinanceChargeAssessmentArgs, 'id'>>;
  receivePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationReceivePurchaseOrderArgs, 'id'>>;
  receiveReturnAuthorizationGoods: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationReceiveReturnAuthorizationGoodsArgs, 'input'>>;
  reconcileCashBank: Resolver<ResolversTypes['CashBank'], ParentType, ContextType, RequireFields<MutationReconcileCashBankArgs, 'id'>>;
  refundCashSale: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationRefundCashSaleArgs, 'input'>>;
  register: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  rejectLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationRejectLeaveApplicationArgs, 'id' | 'reason'>>;
  rejectLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationRejectLeaveReinstatementArgs, 'id'>>;
  rejectReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationRejectReturnAuthorizationArgs, 'id'>>;
  seedIndividualPriceListFromCatalog: Resolver<ResolversTypes['IndividualPriceList'], ParentType, ContextType, RequireFields<MutationSeedIndividualPriceListFromCatalogArgs, 'customerId' | 'organizationId'>>;
  seedSystemRoles: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  sendQuotation: Resolver<ResolversTypes['SendQuotationResult'], ParentType, ContextType, RequireFields<MutationSendQuotationArgs, 'id'>>;
  submitPurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationSubmitPurchaseOrderArgs, 'id'>>;
  transferBankFunds: Resolver<ResolversTypes['BankTransferResult'], ParentType, ContextType, RequireFields<MutationTransferBankFundsArgs, 'input'>>;
  updateApplicant: Resolver<ResolversTypes['Applicant'], ParentType, ContextType, RequireFields<MutationUpdateApplicantArgs, 'id' | 'input'>>;
  updateAsset: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationUpdateAssetArgs, 'id' | 'input'>>;
  updateAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationUpdateAttendanceArgs, 'id' | 'input'>>;
  updateBankAccount: Resolver<ResolversTypes['BankAccount'], ParentType, ContextType, RequireFields<MutationUpdateBankAccountArgs, 'id' | 'input'>>;
  updateCareer: Resolver<ResolversTypes['Career'], ParentType, ContextType, RequireFields<MutationUpdateCareerArgs, 'id' | 'input'>>;
  updateChartOfAccount: Resolver<ResolversTypes['ChartOfAccounts'], ParentType, ContextType, RequireFields<MutationUpdateChartOfAccountArgs, 'id' | 'input'>>;
  updateClient: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  updateCustomer: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'id' | 'input'>>;
  updateCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationUpdateCustomerInvoiceArgs, 'id' | 'input'>>;
  updateCustomerPayment: Resolver<ResolversTypes['CustomerPayment'], ParentType, ContextType, RequireFields<MutationUpdateCustomerPaymentArgs, 'id' | 'input'>>;
  updateDVS: Resolver<ResolversTypes['DVS'], ParentType, ContextType, RequireFields<MutationUpdateDvsArgs, 'id' | 'input'>>;
  updateDeliveryChallan: Resolver<ResolversTypes['DeliveryChallan'], ParentType, ContextType, RequireFields<MutationUpdateDeliveryChallanArgs, 'id' | 'input'>>;
  updateEPM: Resolver<ResolversTypes['EPM'], ParentType, ContextType, RequireFields<MutationUpdateEpmArgs, 'id' | 'input'>>;
  updateExciseInvoice: Resolver<ResolversTypes['ExciseInvoice'], ParentType, ContextType, RequireFields<MutationUpdateExciseInvoiceArgs, 'id' | 'input'>>;
  updateExtraction: Resolver<ResolversTypes['Extraction'], ParentType, ContextType, RequireFields<MutationUpdateExtractionArgs, 'id' | 'input'>>;
  updateGoodsReceipt: Resolver<ResolversTypes['GoodsReceipt'], ParentType, ContextType, RequireFields<MutationUpdateGoodsReceiptArgs, 'id' | 'input'>>;
  updateIPInspection: Resolver<ResolversTypes['IPInspection'], ParentType, ContextType, RequireFields<MutationUpdateIpInspectionArgs, 'id' | 'input'>>;
  updateInternalOrder: Resolver<ResolversTypes['InternalOrder'], ParentType, ContextType, RequireFields<MutationUpdateInternalOrderArgs, 'id' | 'input'>>;
  updateInventoryControl: Resolver<ResolversTypes['InventoryControl'], ParentType, ContextType, RequireFields<MutationUpdateInventoryControlArgs, 'id' | 'input'>>;
  updateInventoryReturn: Resolver<ResolversTypes['InventoryReturn'], ParentType, ContextType, RequireFields<MutationUpdateInventoryReturnArgs, 'id' | 'input'>>;
  updateItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationUpdateItemArgs, 'id' | 'input'>>;
  updateLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationUpdateLeaveApplicationArgs, 'id' | 'input'>>;
  updateLeaveEnrollment: Resolver<ResolversTypes['LeaveEnrollment'], ParentType, ContextType, RequireFields<MutationUpdateLeaveEnrollmentArgs, 'id' | 'input'>>;
  updateLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationUpdateLeaveReinstatementArgs, 'id' | 'input'>>;
  updateLeaveType: Resolver<ResolversTypes['LeaveType'], ParentType, ContextType, RequireFields<MutationUpdateLeaveTypeArgs, 'id' | 'input'>>;
  updateLoanRepayment: Resolver<ResolversTypes['LoanRepayment'], ParentType, ContextType, RequireFields<MutationUpdateLoanRepaymentArgs, 'id' | 'input'>>;
  updateMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationUpdateMaterialReceiptArgs, 'id' | 'input'>>;
  updateOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationArgs, 'id' | 'input'>>;
  updatePayrollManagement: Resolver<ResolversTypes['PayrollManagement'], ParentType, ContextType, RequireFields<MutationUpdatePayrollManagementArgs, 'id' | 'input'>>;
  updateProduct: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'id' | 'input'>>;
  updateProductionPlanning: Resolver<ResolversTypes['ProductionPlanning'], ParentType, ContextType, RequireFields<MutationUpdateProductionPlanningArgs, 'id' | 'input'>>;
  updateProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'id' | 'input'>>;
  updatePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationUpdatePurchaseOrderArgs, 'id' | 'input'>>;
  updateQuotation: Resolver<ResolversTypes['Quotation'], ParentType, ContextType, RequireFields<MutationUpdateQuotationArgs, 'id' | 'input'>>;
  updateRawMaterialRequisition: Resolver<ResolversTypes['RawMaterialRequisition'], ParentType, ContextType, RequireFields<MutationUpdateRawMaterialRequisitionArgs, 'id' | 'input'>>;
  updateReconciliationRule: Resolver<ResolversTypes['ReconciliationRule'], ParentType, ContextType, RequireFields<MutationUpdateReconciliationRuleArgs, 'id' | 'input'>>;
  updateRecruitment: Resolver<ResolversTypes['Recruitment'], ParentType, ContextType, RequireFields<MutationUpdateRecruitmentArgs, 'id' | 'input'>>;
  updateRole: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'id' | 'input'>>;
  updateSalaryProcessing: Resolver<ResolversTypes['SalaryProcessing'], ParentType, ContextType, RequireFields<MutationUpdateSalaryProcessingArgs, 'id' | 'input'>>;
  updateSalesEnquiry: Resolver<ResolversTypes['SalesEnquiry'], ParentType, ContextType, RequireFields<MutationUpdateSalesEnquiryArgs, 'id' | 'input'>>;
  updateSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationUpdateSalesOrderArgs, 'id' | 'input'>>;
  updateSalesQuotation: Resolver<ResolversTypes['SalesQuotation'], ParentType, ContextType, RequireFields<MutationUpdateSalesQuotationArgs, 'id' | 'input'>>;
  updateSalesReturn: Resolver<ResolversTypes['SalesReturn'], ParentType, ContextType, RequireFields<MutationUpdateSalesReturnArgs, 'id' | 'input'>>;
  updateStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationUpdateStockAdjustmentArgs, 'id' | 'input'>>;
  updateStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationUpdateStockTransferArgs, 'id' | 'input'>>;
  updateUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
  updateVendor: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationUpdateVendorArgs, 'id' | 'input'>>;
  updateVendorBill: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationUpdateVendorBillArgs, 'id' | 'input'>>;
  updateVendorCredit: Resolver<ResolversTypes['VendorCredit'], ParentType, ContextType, RequireFields<MutationUpdateVendorCreditArgs, 'id' | 'input'>>;
  updateVendorPayment: Resolver<ResolversTypes['VendorPayment'], ParentType, ContextType, RequireFields<MutationUpdateVendorPaymentArgs, 'id' | 'input'>>;
  updateVendorPrepayment: Resolver<ResolversTypes['VendorPrepayment'], ParentType, ContextType, RequireFields<MutationUpdateVendorPrepaymentArgs, 'id' | 'input'>>;
  updateWarehouse: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationUpdateWarehouseArgs, 'id' | 'input'>>;
  updateWarehouseBin: Resolver<ResolversTypes['WarehouseBin'], ParentType, ContextType, RequireFields<MutationUpdateWarehouseBinArgs, 'id' | 'input'>>;
  updateWorkOrder: Resolver<ResolversTypes['WorkOrder'], ParentType, ContextType, RequireFields<MutationUpdateWorkOrderArgs, 'id' | 'input'>>;
  upsertIndividualPriceList: Resolver<ResolversTypes['IndividualPriceList'], ParentType, ContextType, RequireFields<MutationUpsertIndividualPriceListArgs, 'input'>>;
}>;

export type OrganizationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PoLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['POLineItem'] = ResolversParentTypes['POLineItem']> = ResolversObject<{
  itemDescription: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lineTotal: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  quantity: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  unitPrice: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PayrollManagementResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PayrollManagement'] = ResolversParentTypes['PayrollManagement']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payPeriodEnd: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payPeriodStart: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remarks: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PermissionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = ResolversObject<{
  actions: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  resource: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PriceListResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PriceList'] = ResolversParentTypes['PriceList']> = ResolversObject<{
  categoryFilter: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['PriceListLine']>, ParentType, ContextType>;
  listNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PriceListLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PriceListLine'] = ResolversParentTypes['PriceListLine']> = ResolversObject<{
  category: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  itemId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  barcode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brand: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  costPrice: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  maxStockLevel: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  minStockLevel: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reorderPoint: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sku: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxRate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductionPlanningResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductionPlanning'] = ResolversParentTypes['ProductionPlanning']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurchaseOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PurchaseOrder'] = ResolversParentTypes['PurchaseOrder']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveryDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items: Resolver<Maybe<Array<ResolversTypes['POLineItem']>>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  projectName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtotal: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  taxAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  vendorName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  applicant: Resolver<Maybe<ResolversTypes['Applicant']>, ParentType, ContextType, RequireFields<QueryApplicantArgs, 'id'>>;
  applicants: Resolver<Array<ResolversTypes['Applicant']>, ParentType, ContextType, RequireFields<QueryApplicantsArgs, 'organizationId'>>;
  asset: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetArgs, 'id'>>;
  assets: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetsArgs, 'organizationId'>>;
  attendance: Resolver<Maybe<ResolversTypes['Attendance']>, ParentType, ContextType, RequireFields<QueryAttendanceArgs, 'id'>>;
  attendances: Resolver<Array<ResolversTypes['Attendance']>, ParentType, ContextType, RequireFields<QueryAttendancesArgs, 'organizationId'>>;
  availableVendorCredits: Resolver<Array<ResolversTypes['VendorCredit']>, ParentType, ContextType, RequireFields<QueryAvailableVendorCreditsArgs, 'organizationId' | 'vendorId'>>;
  availableVendorPrepayments: Resolver<Array<ResolversTypes['VendorPrepayment']>, ParentType, ContextType, RequireFields<QueryAvailableVendorPrepaymentsArgs, 'organizationId' | 'vendorId'>>;
  bankAccount: Resolver<Maybe<ResolversTypes['BankAccount']>, ParentType, ContextType, RequireFields<QueryBankAccountArgs, 'id'>>;
  bankAccounts: Resolver<Array<ResolversTypes['BankAccount']>, ParentType, ContextType, RequireFields<QueryBankAccountsArgs, 'organizationId'>>;
  bankStatementLines: Resolver<Array<ResolversTypes['BankStatementLine']>, ParentType, ContextType, RequireFields<QueryBankStatementLinesArgs, 'bankAccount' | 'organizationId'>>;
  career: Resolver<Maybe<ResolversTypes['Career']>, ParentType, ContextType, RequireFields<QueryCareerArgs, 'id'>>;
  careers: Resolver<Array<ResolversTypes['Career']>, ParentType, ContextType, RequireFields<QueryCareersArgs, 'organizationId'>>;
  cashBank: Resolver<Maybe<ResolversTypes['CashBank']>, ParentType, ContextType, RequireFields<QueryCashBankArgs, 'id'>>;
  cashBanks: Resolver<Array<ResolversTypes['CashBank']>, ParentType, ContextType, RequireFields<QueryCashBanksArgs, 'organizationId'>>;
  cashSalesRefundCandidates: Resolver<Array<ResolversTypes['SalesOrder']>, ParentType, ContextType, RequireFields<QueryCashSalesRefundCandidatesArgs, 'organizationId'>>;
  chartOfAccount: Resolver<Maybe<ResolversTypes['ChartOfAccounts']>, ParentType, ContextType, RequireFields<QueryChartOfAccountArgs, 'id'>>;
  chartOfAccounts: Resolver<Array<ResolversTypes['ChartOfAccounts']>, ParentType, ContextType, RequireFields<QueryChartOfAccountsArgs, 'organizationId'>>;
  client: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientArgs, 'id'>>;
  clients: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, QueryClientsArgs>;
  clientsByOrganization: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientsByOrganizationArgs, 'organizationId'>>;
  clientsByStatus: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientsByStatusArgs, 'organizationId' | 'status'>>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  customerDeposit: Resolver<Maybe<ResolversTypes['CustomerDeposit']>, ParentType, ContextType, RequireFields<QueryCustomerDepositArgs, 'id'>>;
  customerDeposits: Resolver<Array<ResolversTypes['CustomerDeposit']>, ParentType, ContextType, RequireFields<QueryCustomerDepositsArgs, 'organizationId'>>;
  customerPayment: Resolver<Maybe<ResolversTypes['CustomerPayment']>, ParentType, ContextType, RequireFields<QueryCustomerPaymentArgs, 'id'>>;
  customerPayments: Resolver<Array<ResolversTypes['CustomerPayment']>, ParentType, ContextType, RequireFields<QueryCustomerPaymentsArgs, 'organizationId'>>;
  customerPaymentsByCustomer: Resolver<Array<ResolversTypes['CustomerPayment']>, ParentType, ContextType, RequireFields<QueryCustomerPaymentsByCustomerArgs, 'customerId'>>;
  customerRefund: Resolver<Maybe<ResolversTypes['CustomerRefund']>, ParentType, ContextType, RequireFields<QueryCustomerRefundArgs, 'id'>>;
  customerRefunds: Resolver<Array<ResolversTypes['CustomerRefund']>, ParentType, ContextType, RequireFields<QueryCustomerRefundsArgs, 'organizationId'>>;
  customerinvoice: Resolver<Maybe<ResolversTypes['CustomerInvoice']>, ParentType, ContextType, RequireFields<QueryCustomerinvoiceArgs, 'id'>>;
  customerinvoices: Resolver<Array<ResolversTypes['CustomerInvoice']>, ParentType, ContextType, RequireFields<QueryCustomerinvoicesArgs, 'organizationId'>>;
  customers: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomersArgs, 'organizationId'>>;
  deliverychallan: Resolver<Maybe<ResolversTypes['DeliveryChallan']>, ParentType, ContextType, RequireFields<QueryDeliverychallanArgs, 'id'>>;
  deliverychallans: Resolver<Array<ResolversTypes['DeliveryChallan']>, ParentType, ContextType, RequireFields<QueryDeliverychallansArgs, 'organizationId'>>;
  dvs: Resolver<Maybe<ResolversTypes['DVS']>, ParentType, ContextType, RequireFields<QueryDvsArgs, 'id'>>;
  dvsRecords: Resolver<Array<ResolversTypes['DVS']>, ParentType, ContextType, RequireFields<QueryDvsRecordsArgs, 'organizationId'>>;
  epm: Resolver<Maybe<ResolversTypes['EPM']>, ParentType, ContextType, RequireFields<QueryEpmArgs, 'id'>>;
  epms: Resolver<Array<ResolversTypes['EPM']>, ParentType, ContextType, RequireFields<QueryEpmsArgs, 'organizationId'>>;
  exciseinvoice: Resolver<Maybe<ResolversTypes['ExciseInvoice']>, ParentType, ContextType, RequireFields<QueryExciseinvoiceArgs, 'id'>>;
  exciseinvoices: Resolver<Array<ResolversTypes['ExciseInvoice']>, ParentType, ContextType, RequireFields<QueryExciseinvoicesArgs, 'organizationId'>>;
  extraction: Resolver<Maybe<ResolversTypes['Extraction']>, ParentType, ContextType, RequireFields<QueryExtractionArgs, 'id'>>;
  extractions: Resolver<Array<ResolversTypes['Extraction']>, ParentType, ContextType, RequireFields<QueryExtractionsArgs, 'organizationId'>>;
  financeChargeAssessment: Resolver<Maybe<ResolversTypes['FinanceChargeAssessment']>, ParentType, ContextType, RequireFields<QueryFinanceChargeAssessmentArgs, 'id'>>;
  financeChargeAssessments: Resolver<Array<ResolversTypes['FinanceChargeAssessment']>, ParentType, ContextType, RequireFields<QueryFinanceChargeAssessmentsArgs, 'organizationId'>>;
  generalLedger: Resolver<Maybe<ResolversTypes['GeneralLedger']>, ParentType, ContextType, RequireFields<QueryGeneralLedgerArgs, 'id'>>;
  generalLedgers: Resolver<Array<ResolversTypes['GeneralLedger']>, ParentType, ContextType, RequireFields<QueryGeneralLedgersArgs, 'organizationId'>>;
  generateCustomerStatement: Resolver<ResolversTypes['CustomerStatement'], ParentType, ContextType, RequireFields<QueryGenerateCustomerStatementArgs, 'customerId' | 'dateFrom' | 'dateTo' | 'organizationId'>>;
  goodsreceipt: Resolver<Maybe<ResolversTypes['GoodsReceipt']>, ParentType, ContextType, RequireFields<QueryGoodsreceiptArgs, 'id'>>;
  goodsreceipts: Resolver<Array<ResolversTypes['GoodsReceipt']>, ParentType, ContextType, RequireFields<QueryGoodsreceiptsArgs, 'organizationId'>>;
  grn: Resolver<Maybe<ResolversTypes['GRN']>, ParentType, ContextType, RequireFields<QueryGrnArgs, 'id'>>;
  grns: Resolver<Array<ResolversTypes['GRN']>, ParentType, ContextType, RequireFields<QueryGrnsArgs, 'organizationId'>>;
  grnsByPO: Resolver<Array<ResolversTypes['GRN']>, ParentType, ContextType, RequireFields<QueryGrnsByPoArgs, 'purchaseOrderId'>>;
  individualPriceList: Resolver<Maybe<ResolversTypes['IndividualPriceList']>, ParentType, ContextType, RequireFields<QueryIndividualPriceListArgs, 'id'>>;
  individualPriceListByCustomer: Resolver<Maybe<ResolversTypes['IndividualPriceList']>, ParentType, ContextType, RequireFields<QueryIndividualPriceListByCustomerArgs, 'customerId' | 'organizationId'>>;
  individualPriceLists: Resolver<Array<ResolversTypes['IndividualPriceList']>, ParentType, ContextType, RequireFields<QueryIndividualPriceListsArgs, 'organizationId'>>;
  internalorder: Resolver<Maybe<ResolversTypes['InternalOrder']>, ParentType, ContextType, RequireFields<QueryInternalorderArgs, 'id'>>;
  internalorders: Resolver<Array<ResolversTypes['InternalOrder']>, ParentType, ContextType, RequireFields<QueryInternalordersArgs, 'organizationId'>>;
  inventoryControl: Resolver<Maybe<ResolversTypes['InventoryControl']>, ParentType, ContextType, RequireFields<QueryInventoryControlArgs, 'id'>>;
  inventoryControls: Resolver<Array<ResolversTypes['InventoryControl']>, ParentType, ContextType, RequireFields<QueryInventoryControlsArgs, 'organizationId'>>;
  inventoryreturn: Resolver<Maybe<ResolversTypes['InventoryReturn']>, ParentType, ContextType, RequireFields<QueryInventoryreturnArgs, 'id'>>;
  inventoryreturns: Resolver<Array<ResolversTypes['InventoryReturn']>, ParentType, ContextType, RequireFields<QueryInventoryreturnsArgs, 'organizationId'>>;
  invoiceBillableCustomers: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryInvoiceBillableCustomersArgs, 'organizationId'>>;
  ipinspection: Resolver<Maybe<ResolversTypes['IPInspection']>, ParentType, ContextType, RequireFields<QueryIpinspectionArgs, 'id'>>;
  ipinspections: Resolver<Array<ResolversTypes['IPInspection']>, ParentType, ContextType, RequireFields<QueryIpinspectionsArgs, 'organizationId'>>;
  item: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemArgs, 'id'>>;
  items: Resolver<Array<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemsArgs, 'organizationId'>>;
  leaveApplication: Resolver<Maybe<ResolversTypes['LeaveApplication']>, ParentType, ContextType, RequireFields<QueryLeaveApplicationArgs, 'id'>>;
  leaveApplications: Resolver<Array<ResolversTypes['LeaveApplication']>, ParentType, ContextType, RequireFields<QueryLeaveApplicationsArgs, 'organizationId'>>;
  leaveEnrollment: Resolver<Maybe<ResolversTypes['LeaveEnrollment']>, ParentType, ContextType, RequireFields<QueryLeaveEnrollmentArgs, 'id'>>;
  leaveEnrollments: Resolver<Array<ResolversTypes['LeaveEnrollment']>, ParentType, ContextType, RequireFields<QueryLeaveEnrollmentsArgs, 'organizationId'>>;
  leaveReinstatement: Resolver<Maybe<ResolversTypes['LeaveReinstatement']>, ParentType, ContextType, RequireFields<QueryLeaveReinstatementArgs, 'id'>>;
  leaveReinstatements: Resolver<Array<ResolversTypes['LeaveReinstatement']>, ParentType, ContextType, RequireFields<QueryLeaveReinstatementsArgs, 'organizationId'>>;
  leaveType: Resolver<Maybe<ResolversTypes['LeaveType']>, ParentType, ContextType, RequireFields<QueryLeaveTypeArgs, 'id'>>;
  leaveTypes: Resolver<Array<ResolversTypes['LeaveType']>, ParentType, ContextType, RequireFields<QueryLeaveTypesArgs, 'organizationId'>>;
  loanrepayment: Resolver<Maybe<ResolversTypes['LoanRepayment']>, ParentType, ContextType, RequireFields<QueryLoanrepaymentArgs, 'id'>>;
  loanrepayments: Resolver<Array<ResolversTypes['LoanRepayment']>, ParentType, ContextType, RequireFields<QueryLoanrepaymentsArgs, 'organizationId'>>;
  lowStockItems: Resolver<Array<ResolversTypes['InventoryControl']>, ParentType, ContextType, RequireFields<QueryLowStockItemsArgs, 'organizationId'>>;
  materialreceipt: Resolver<Maybe<ResolversTypes['MaterialReceipt']>, ParentType, ContextType, RequireFields<QueryMaterialreceiptArgs, 'id'>>;
  materialreceipts: Resolver<Array<ResolversTypes['MaterialReceipt']>, ParentType, ContextType, RequireFields<QueryMaterialreceiptsArgs, 'organizationId'>>;
  materialreceiptsByPO: Resolver<Array<ResolversTypes['MaterialReceipt']>, ParentType, ContextType, RequireFields<QueryMaterialreceiptsByPoArgs, 'purchaseOrderId'>>;
  me: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  organization: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationArgs, 'id'>>;
  organizations: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType, QueryOrganizationsArgs>;
  outstandingVendorBills: Resolver<Array<ResolversTypes['VendorBill']>, ParentType, ContextType, RequireFields<QueryOutstandingVendorBillsArgs, 'organizationId'>>;
  payrollmanagement: Resolver<Maybe<ResolversTypes['PayrollManagement']>, ParentType, ContextType, RequireFields<QueryPayrollmanagementArgs, 'id'>>;
  payrollmanagements: Resolver<Array<ResolversTypes['PayrollManagement']>, ParentType, ContextType, RequireFields<QueryPayrollmanagementsArgs, 'organizationId'>>;
  priceList: Resolver<Maybe<ResolversTypes['PriceList']>, ParentType, ContextType, RequireFields<QueryPriceListArgs, 'id'>>;
  priceLists: Resolver<Array<ResolversTypes['PriceList']>, ParentType, ContextType, RequireFields<QueryPriceListsArgs, 'organizationId'>>;
  product: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  productionplanning: Resolver<Maybe<ResolversTypes['ProductionPlanning']>, ParentType, ContextType, RequireFields<QueryProductionplanningArgs, 'id'>>;
  productionplannings: Resolver<Array<ResolversTypes['ProductionPlanning']>, ParentType, ContextType, RequireFields<QueryProductionplanningsArgs, 'organizationId'>>;
  products: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  productsByCategory: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductsByCategoryArgs, 'category' | 'organizationId'>>;
  productsByOrganization: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductsByOrganizationArgs, 'organizationId'>>;
  productsByStatus: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductsByStatusArgs, 'organizationId' | 'status'>>;
  project: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>;
  projects: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectsArgs, 'organizationId'>>;
  purchaseorder: Resolver<Maybe<ResolversTypes['PurchaseOrder']>, ParentType, ContextType, RequireFields<QueryPurchaseorderArgs, 'id'>>;
  purchaseorders: Resolver<Array<ResolversTypes['PurchaseOrder']>, ParentType, ContextType, RequireFields<QueryPurchaseordersArgs, 'organizationId'>>;
  quotation: Resolver<Maybe<ResolversTypes['Quotation']>, ParentType, ContextType, RequireFields<QueryQuotationArgs, 'id'>>;
  quotations: Resolver<Array<ResolversTypes['Quotation']>, ParentType, ContextType, QueryQuotationsArgs>;
  quotationsByClient: Resolver<Array<ResolversTypes['Quotation']>, ParentType, ContextType, RequireFields<QueryQuotationsByClientArgs, 'clientId'>>;
  quotationsByOrganization: Resolver<Array<ResolversTypes['Quotation']>, ParentType, ContextType, RequireFields<QueryQuotationsByOrganizationArgs, 'organizationId'>>;
  quotationsByStatus: Resolver<Array<ResolversTypes['Quotation']>, ParentType, ContextType, RequireFields<QueryQuotationsByStatusArgs, 'organizationId' | 'status'>>;
  rawMaterialRequisition: Resolver<Maybe<ResolversTypes['RawMaterialRequisition']>, ParentType, ContextType, RequireFields<QueryRawMaterialRequisitionArgs, 'id'>>;
  rawMaterialRequisitions: Resolver<Array<ResolversTypes['RawMaterialRequisition']>, ParentType, ContextType, RequireFields<QueryRawMaterialRequisitionsArgs, 'organizationId'>>;
  reconciliationRules: Resolver<Array<ResolversTypes['ReconciliationRule']>, ParentType, ContextType, RequireFields<QueryReconciliationRulesArgs, 'organizationId'>>;
  recruitment: Resolver<Maybe<ResolversTypes['Recruitment']>, ParentType, ContextType, RequireFields<QueryRecruitmentArgs, 'id'>>;
  recruitments: Resolver<Array<ResolversTypes['Recruitment']>, ParentType, ContextType, RequireFields<QueryRecruitmentsArgs, 'organizationId'>>;
  returnAuthorization: Resolver<Maybe<ResolversTypes['ReturnAuthorization']>, ParentType, ContextType, RequireFields<QueryReturnAuthorizationArgs, 'id'>>;
  returnAuthorizations: Resolver<Array<ResolversTypes['ReturnAuthorization']>, ParentType, ContextType, RequireFields<QueryReturnAuthorizationsArgs, 'organizationId'>>;
  role: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryRoleArgs, 'id'>>;
  roles: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  rolesByOrganization: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryRolesByOrganizationArgs, 'organizationId'>>;
  salaryprocessing: Resolver<Maybe<ResolversTypes['SalaryProcessing']>, ParentType, ContextType, RequireFields<QuerySalaryprocessingArgs, 'id'>>;
  salaryprocessings: Resolver<Array<ResolversTypes['SalaryProcessing']>, ParentType, ContextType, RequireFields<QuerySalaryprocessingsArgs, 'organizationId'>>;
  salesEnquiries: Resolver<Array<ResolversTypes['SalesEnquiry']>, ParentType, ContextType, RequireFields<QuerySalesEnquiriesArgs, 'organizationId'>>;
  salesEnquiriesByAssignedTo: Resolver<Array<ResolversTypes['SalesEnquiry']>, ParentType, ContextType, RequireFields<QuerySalesEnquiriesByAssignedToArgs, 'userId'>>;
  salesEnquiriesByClient: Resolver<Array<ResolversTypes['SalesEnquiry']>, ParentType, ContextType, RequireFields<QuerySalesEnquiriesByClientArgs, 'clientId'>>;
  salesEnquiriesByStatus: Resolver<Array<ResolversTypes['SalesEnquiry']>, ParentType, ContextType, RequireFields<QuerySalesEnquiriesByStatusArgs, 'status'>>;
  salesEnquiry: Resolver<Maybe<ResolversTypes['SalesEnquiry']>, ParentType, ContextType, RequireFields<QuerySalesEnquiryArgs, 'id'>>;
  salesQuotation: Resolver<Maybe<ResolversTypes['SalesQuotation']>, ParentType, ContextType, RequireFields<QuerySalesQuotationArgs, 'id'>>;
  salesQuotations: Resolver<Array<ResolversTypes['SalesQuotation']>, ParentType, ContextType, RequireFields<QuerySalesQuotationsArgs, 'organizationId'>>;
  salesQuotationsByClient: Resolver<Array<ResolversTypes['SalesQuotation']>, ParentType, ContextType, RequireFields<QuerySalesQuotationsByClientArgs, 'clientId'>>;
  salesQuotationsByEnquiry: Resolver<Array<ResolversTypes['SalesQuotation']>, ParentType, ContextType, RequireFields<QuerySalesQuotationsByEnquiryArgs, 'enquiryId'>>;
  salesQuotationsByStatus: Resolver<Array<ResolversTypes['SalesQuotation']>, ParentType, ContextType, RequireFields<QuerySalesQuotationsByStatusArgs, 'status'>>;
  salesorder: Resolver<Maybe<ResolversTypes['SalesOrder']>, ParentType, ContextType, RequireFields<QuerySalesorderArgs, 'id'>>;
  salesorders: Resolver<Array<ResolversTypes['SalesOrder']>, ParentType, ContextType, RequireFields<QuerySalesordersArgs, 'organizationId'>>;
  salesreturn: Resolver<Maybe<ResolversTypes['SalesReturn']>, ParentType, ContextType, RequireFields<QuerySalesreturnArgs, 'id'>>;
  salesreturns: Resolver<Array<ResolversTypes['SalesReturn']>, ParentType, ContextType, RequireFields<QuerySalesreturnsArgs, 'organizationId'>>;
  stockMovement: Resolver<Maybe<ResolversTypes['StockMovement']>, ParentType, ContextType, RequireFields<QueryStockMovementArgs, 'id'>>;
  stockMovements: Resolver<Array<ResolversTypes['StockMovement']>, ParentType, ContextType, RequireFields<QueryStockMovementsArgs, 'organizationId'>>;
  stockadjustment: Resolver<Maybe<ResolversTypes['StockAdjustment']>, ParentType, ContextType, RequireFields<QueryStockadjustmentArgs, 'id'>>;
  stockadjustments: Resolver<Array<ResolversTypes['StockAdjustment']>, ParentType, ContextType, RequireFields<QueryStockadjustmentsArgs, 'organizationId'>>;
  stocktransfer: Resolver<Maybe<ResolversTypes['StockTransfer']>, ParentType, ContextType, RequireFields<QueryStocktransferArgs, 'id'>>;
  stocktransfers: Resolver<Array<ResolversTypes['StockTransfer']>, ParentType, ContextType, RequireFields<QueryStocktransfersArgs, 'organizationId'>>;
  systemRoles: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userByEmail: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>;
  usersByOrganization: Resolver<ResolversTypes['UserList'], ParentType, ContextType, RequireFields<QueryUsersByOrganizationArgs, 'organizationId'>>;
  usersByRole: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersByRoleArgs, 'role'>>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryVendorArgs, 'id'>>;
  vendorBill: Resolver<Maybe<ResolversTypes['VendorBill']>, ParentType, ContextType, RequireFields<QueryVendorBillArgs, 'id'>>;
  vendorBills: Resolver<Array<ResolversTypes['VendorBill']>, ParentType, ContextType, RequireFields<QueryVendorBillsArgs, 'organizationId'>>;
  vendorBillsByVendor: Resolver<Array<ResolversTypes['VendorBill']>, ParentType, ContextType, RequireFields<QueryVendorBillsByVendorArgs, 'vendorId'>>;
  vendorCredit: Resolver<Maybe<ResolversTypes['VendorCredit']>, ParentType, ContextType, RequireFields<QueryVendorCreditArgs, 'id'>>;
  vendorCredits: Resolver<Array<ResolversTypes['VendorCredit']>, ParentType, ContextType, RequireFields<QueryVendorCreditsArgs, 'organizationId'>>;
  vendorPayment: Resolver<Maybe<ResolversTypes['VendorPayment']>, ParentType, ContextType, RequireFields<QueryVendorPaymentArgs, 'id'>>;
  vendorPayments: Resolver<Array<ResolversTypes['VendorPayment']>, ParentType, ContextType, RequireFields<QueryVendorPaymentsArgs, 'organizationId'>>;
  vendorPaymentsByVendor: Resolver<Array<ResolversTypes['VendorPayment']>, ParentType, ContextType, RequireFields<QueryVendorPaymentsByVendorArgs, 'vendorId'>>;
  vendorPrepayment: Resolver<Maybe<ResolversTypes['VendorPrepayment']>, ParentType, ContextType, RequireFields<QueryVendorPrepaymentArgs, 'id'>>;
  vendorPrepayments: Resolver<Array<ResolversTypes['VendorPrepayment']>, ParentType, ContextType, RequireFields<QueryVendorPrepaymentsArgs, 'organizationId'>>;
  vendors: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryVendorsArgs, 'organizationId'>>;
  warehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType, RequireFields<QueryWarehouseArgs, 'id'>>;
  warehouseBin: Resolver<Maybe<ResolversTypes['WarehouseBin']>, ParentType, ContextType, RequireFields<QueryWarehouseBinArgs, 'id'>>;
  warehouseBins: Resolver<Array<ResolversTypes['WarehouseBin']>, ParentType, ContextType, RequireFields<QueryWarehouseBinsArgs, 'organizationId'>>;
  warehouses: Resolver<Array<ResolversTypes['Warehouse']>, ParentType, ContextType, RequireFields<QueryWarehousesArgs, 'organizationId'>>;
  workorder: Resolver<Maybe<ResolversTypes['WorkOrder']>, ParentType, ContextType, RequireFields<QueryWorkorderArgs, 'id'>>;
  workorders: Resolver<Array<ResolversTypes['WorkOrder']>, ParentType, ContextType, RequireFields<QueryWorkordersArgs, 'organizationId'>>;
}>;

export type QuotationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Quotation'] = ResolversParentTypes['Quotation']> = ResolversObject<{
  clientId: Resolver<ResolversTypes['ClientRef'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  discountAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['QuotationLineItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quotationDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quotationNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sentAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sentBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  terms: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  validUntil: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuotationItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QuotationItem'] = ResolversParentTypes['QuotationItem']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  itemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitPrice: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuotationLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QuotationLineItem'] = ResolversParentTypes['QuotationLineItem']> = ResolversObject<{
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RawMaterialRequisitionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RawMaterialRequisition'] = ResolversParentTypes['RawMaterialRequisition']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purpose: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rawMaterialId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestedBy: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestedQuantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  requiredDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requisitionDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requisitionNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReconciliationRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReconciliationRule'] = ResolversParentTypes['ReconciliationRule']> = ResolversObject<{
  amountTolerance: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bankAccount: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bankLineTextContains: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bookLineTextContains: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RecruitmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Recruitment'] = ResolversParentTypes['Recruitment']> = ResolversObject<{
  applicantId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  applicationDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  feedback: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interviewDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  interviewers: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  jobId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  joiningDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offerAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  source: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stage: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReturnAuthorizationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReturnAuthorization'] = ResolversParentTypes['ReturnAuthorization']> = ResolversObject<{
  approvedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  goodsReceivedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  goodsReceivedBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['ReturnAuthorizationLine']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  raNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  receiptComplete: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  receiptNotes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rejectionReason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requestedDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salesOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReturnAuthorizationLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReturnAuthorizationLine'] = ResolversParentTypes['ReturnAuthorizationLine']> = ResolversObject<{
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityReceived: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RoleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSystemRole: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  permissions: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SaLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SALineItem'] = ResolversParentTypes['SALineItem']> = ResolversObject<{
  adjustedQty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currentQty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  difference: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  itemDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['STLineItem'] = ResolversParentTypes['STLineItem']> = ResolversObject<{
  itemDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  qty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalaryProcessingResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalaryProcessing'] = ResolversParentTypes['SalaryProcessing']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payPeriodEnd: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payPeriodStart: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remarks: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalaryRangeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalaryRange'] = ResolversParentTypes['SalaryRange']> = ResolversObject<{
  max: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  min: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalesEnquiryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalesEnquiry'] = ResolversParentTypes['SalesEnquiry']> = ResolversObject<{
  assignedTo: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  budget: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  clientId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  currency: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  enquiryNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enquirySource: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedEndDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedStartDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priority: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectScope: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  projectType: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalesOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalesOrder'] = ResolversParentTypes['SalesOrder']> = ResolversObject<{
  cashSale: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  clientId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  quotationId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  quotationStatus: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refundAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  refundMethod: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refundNotes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refundReferenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refundedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalesQuotationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalesQuotation'] = ResolversParentTypes['SalesQuotation']> = ResolversObject<{
  assignedTo: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  clientId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  currency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deliveryTerms: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  enquiryId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  grandTotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items: Resolver<Array<ResolversTypes['QuotationItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentTerms: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quotationDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quotationNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  termsAndConditions: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalDiscount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalTax: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  validUntil: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalesReturnResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalesReturn'] = ResolversParentTypes['SalesReturn']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SendQuotationResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SendQuotationResult'] = ResolversParentTypes['SendQuotationResult']> = ResolversObject<{
  emailSent: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  quotation: Resolver<ResolversTypes['Quotation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StockAdjustmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StockAdjustment'] = ResolversParentTypes['StockAdjustment']> = ResolversObject<{
  adjDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  adjNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  adjustmentType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['SALineItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  warehouseId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  warehouseName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StockMovementResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StockMovement'] = ResolversParentTypes['StockMovement']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromLocation: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  itemId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  movementDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  movementType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  referenceId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceModule: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toLocation: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StockTransferResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StockTransfer'] = ResolversParentTypes['StockTransfer']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromWarehouseId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  fromWarehouseName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['STLineItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toWarehouseId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  toWarehouseName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transferDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transferNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  roles: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userType: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserListResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserList'] = ResolversParentTypes['UserList']> = ResolversObject<{
  limit: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  users: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Vendor'] = ResolversParentTypes['Vendor']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactPerson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentTerms: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorBillResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorBill'] = ResolversParentTypes['VendorBill']> = ResolversObject<{
  billDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  billNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discountAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  dueDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['VendorBillLineItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outstandingAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  paidAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  purchaseOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorBillLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorBillLineItem'] = ResolversParentTypes['VendorBillLineItem']> = ResolversObject<{
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorCreditResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorCredit'] = ResolversParentTypes['VendorCredit']> = ResolversObject<{
  appliedAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creditDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creditNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remainingAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorPaymentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorPayment'] = ResolversParentTypes['VendorPayment']> = ResolversObject<{
  allocations: Resolver<Array<ResolversTypes['VendorPaymentAllocation']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorPaymentAllocationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorPaymentAllocation'] = ResolversParentTypes['VendorPaymentAllocation']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  billId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  billNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorPrepaymentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorPrepayment'] = ResolversParentTypes['VendorPrepayment']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  appliedAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prepaymentDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prepaymentNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remainingAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WarehouseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Warehouse'] = ResolversParentTypes['Warehouse']> = ResolversObject<{
  address: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  capacity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  contactNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentUtilization: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  managerName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  warehouseCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  warehouseName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  warehouseType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WarehouseBinResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['WarehouseBin'] = ResolversParentTypes['WarehouseBin']> = ResolversObject<{
  binCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  binLocation: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  binType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  capacity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentStock: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isAvailable: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  warehouseId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['WorkOrder'] = ResolversParentTypes['WorkOrder']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Address: AddressResolvers<ContextType>;
  Applicant: ApplicantResolvers<ContextType>;
  Asset: AssetResolvers<ContextType>;
  Attendance: AttendanceResolvers<ContextType>;
  AuthPayload: AuthPayloadResolvers<ContextType>;
  BankAccount: BankAccountResolvers<ContextType>;
  BankStatementLine: BankStatementLineResolvers<ContextType>;
  BankTransferResult: BankTransferResultResolvers<ContextType>;
  Career: CareerResolvers<ContextType>;
  CashBank: CashBankResolvers<ContextType>;
  ChartOfAccounts: ChartOfAccountsResolvers<ContextType>;
  Client: ClientResolvers<ContextType>;
  ClientRef: ClientRefResolvers<ContextType>;
  Competency: CompetencyResolvers<ContextType>;
  Customer: CustomerResolvers<ContextType>;
  CustomerDeposit: CustomerDepositResolvers<ContextType>;
  CustomerInvoice: CustomerInvoiceResolvers<ContextType>;
  CustomerPayment: CustomerPaymentResolvers<ContextType>;
  CustomerPaymentAllocation: CustomerPaymentAllocationResolvers<ContextType>;
  CustomerRefund: CustomerRefundResolvers<ContextType>;
  CustomerStatement: CustomerStatementResolvers<ContextType>;
  CustomerStatementLine: CustomerStatementLineResolvers<ContextType>;
  DVS: DvsResolvers<ContextType>;
  DeliveryChallan: DeliveryChallanResolvers<ContextType>;
  EPM: EpmResolvers<ContextType>;
  Education: EducationResolvers<ContextType>;
  ExciseInvoice: ExciseInvoiceResolvers<ContextType>;
  Experience: ExperienceResolvers<ContextType>;
  Extraction: ExtractionResolvers<ContextType>;
  FinanceChargeAssessment: FinanceChargeAssessmentResolvers<ContextType>;
  FinanceChargeLine: FinanceChargeLineResolvers<ContextType>;
  GRN: GrnResolvers<ContextType>;
  GRNLineItem: GrnLineItemResolvers<ContextType>;
  GeneralLedger: GeneralLedgerResolvers<ContextType>;
  Goal: GoalResolvers<ContextType>;
  GoodsReceipt: GoodsReceiptResolvers<ContextType>;
  IPInspection: IpInspectionResolvers<ContextType>;
  IndividualPriceList: IndividualPriceListResolvers<ContextType>;
  IndividualPriceListLine: IndividualPriceListLineResolvers<ContextType>;
  InternalOrder: InternalOrderResolvers<ContextType>;
  InventoryControl: InventoryControlResolvers<ContextType>;
  InventoryReturn: InventoryReturnResolvers<ContextType>;
  Item: ItemResolvers<ContextType>;
  LeaveApplication: LeaveApplicationResolvers<ContextType>;
  LeaveEnrollment: LeaveEnrollmentResolvers<ContextType>;
  LeaveReinstatement: LeaveReinstatementResolvers<ContextType>;
  LeaveType: LeaveTypeResolvers<ContextType>;
  LoanRepayment: LoanRepaymentResolvers<ContextType>;
  MRNLineItem: MrnLineItemResolvers<ContextType>;
  MaterialReceipt: MaterialReceiptResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Organization: OrganizationResolvers<ContextType>;
  POLineItem: PoLineItemResolvers<ContextType>;
  PayrollManagement: PayrollManagementResolvers<ContextType>;
  Permission: PermissionResolvers<ContextType>;
  PriceList: PriceListResolvers<ContextType>;
  PriceListLine: PriceListLineResolvers<ContextType>;
  Product: ProductResolvers<ContextType>;
  ProductionPlanning: ProductionPlanningResolvers<ContextType>;
  Project: ProjectResolvers<ContextType>;
  PurchaseOrder: PurchaseOrderResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Quotation: QuotationResolvers<ContextType>;
  QuotationItem: QuotationItemResolvers<ContextType>;
  QuotationLineItem: QuotationLineItemResolvers<ContextType>;
  RawMaterialRequisition: RawMaterialRequisitionResolvers<ContextType>;
  ReconciliationRule: ReconciliationRuleResolvers<ContextType>;
  Recruitment: RecruitmentResolvers<ContextType>;
  ReturnAuthorization: ReturnAuthorizationResolvers<ContextType>;
  ReturnAuthorizationLine: ReturnAuthorizationLineResolvers<ContextType>;
  Role: RoleResolvers<ContextType>;
  SALineItem: SaLineItemResolvers<ContextType>;
  STLineItem: StLineItemResolvers<ContextType>;
  SalaryProcessing: SalaryProcessingResolvers<ContextType>;
  SalaryRange: SalaryRangeResolvers<ContextType>;
  SalesEnquiry: SalesEnquiryResolvers<ContextType>;
  SalesOrder: SalesOrderResolvers<ContextType>;
  SalesQuotation: SalesQuotationResolvers<ContextType>;
  SalesReturn: SalesReturnResolvers<ContextType>;
  SendQuotationResult: SendQuotationResultResolvers<ContextType>;
  StockAdjustment: StockAdjustmentResolvers<ContextType>;
  StockMovement: StockMovementResolvers<ContextType>;
  StockTransfer: StockTransferResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  UserList: UserListResolvers<ContextType>;
  Vendor: VendorResolvers<ContextType>;
  VendorBill: VendorBillResolvers<ContextType>;
  VendorBillLineItem: VendorBillLineItemResolvers<ContextType>;
  VendorCredit: VendorCreditResolvers<ContextType>;
  VendorPayment: VendorPaymentResolvers<ContextType>;
  VendorPaymentAllocation: VendorPaymentAllocationResolvers<ContextType>;
  VendorPrepayment: VendorPrepaymentResolvers<ContextType>;
  Warehouse: WarehouseResolvers<ContextType>;
  WarehouseBin: WarehouseBinResolvers<ContextType>;
  WorkOrder: WorkOrderResolvers<ContextType>;
}>;

