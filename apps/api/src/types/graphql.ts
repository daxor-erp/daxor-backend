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

export type AllocationLine = {
  __typename?: 'AllocationLine';
  amount: Scalars['Float']['output'];
  costCenter: Maybe<Scalars['String']['output']>;
  destinationAccount: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  percentage: Scalars['Float']['output'];
  targetOrganizationId: Scalars['ID']['output'];
  targetOrganizationName: Maybe<Scalars['String']['output']>;
};

export type AllocationLineInput = {
  amount: InputMaybe<Scalars['Float']['input']>;
  costCenter: InputMaybe<Scalars['String']['input']>;
  destinationAccount: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  percentage: Scalars['Float']['input'];
  targetOrganizationId: Scalars['ID']['input'];
  targetOrganizationName: InputMaybe<Scalars['String']['input']>;
};

export type AllocationSchedule = {
  __typename?: 'AllocationSchedule';
  allocationMethod: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lines: Array<AllocationLine>;
  organizationId: Scalars['String']['output'];
  scheduleName: Scalars['String']['output'];
  seqNo: Maybe<Scalars['String']['output']>;
  sourceAccount: Scalars['String']['output'];
};

export type AllocationScheduleInput = {
  allocationMethod: InputMaybe<Scalars['String']['input']>;
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  lines: Array<AllocationLineInput>;
  organizationId: Scalars['String']['input'];
  scheduleName: Scalars['String']['input'];
  sourceAccount: Scalars['String']['input'];
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

export enum ApprovalDecision {
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}

export type ApprovalRequest = {
  __typename?: 'ApprovalRequest';
  assigneeApproverUserId: Scalars['ID']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  decidedAt: Maybe<Scalars['String']['output']>;
  decidedByUserId: Maybe<Scalars['ID']['output']>;
  entityId: Scalars['ID']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  moduleKey: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  requesterDisplayName: Maybe<Scalars['String']['output']>;
  requesterUserId: Scalars['ID']['output'];
  resolutionNote: Maybe<Scalars['String']['output']>;
  status: ApprovalRequestStatus;
  title: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
};

export enum ApprovalRequestRole {
  Any = 'ANY',
  Approver = 'APPROVER',
  Requester = 'REQUESTER'
}

export enum ApprovalRequestStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

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

export type AssetMaintenance = {
  __typename?: 'AssetMaintenance';
  actionsTaken: Maybe<Scalars['String']['output']>;
  assetCode: Maybe<Scalars['String']['output']>;
  assetId: Scalars['ID']['output'];
  assetName: Maybe<Scalars['String']['output']>;
  assignedToName: Maybe<Scalars['String']['output']>;
  assignedToUserId: Maybe<Scalars['ID']['output']>;
  completedAt: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  downtimeHours: Scalars['Float']['output'];
  findings: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  intervalDays: Maybe<Scalars['Int']['output']>;
  laborCost: Scalars['Float']['output'];
  laborHours: Scalars['Float']['output'];
  laborRate: Scalars['Float']['output'];
  maintenanceType: Scalars['String']['output'];
  nextScheduledDate: Maybe<Scalars['String']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  partsCost: Scalars['Float']['output'];
  partsUsed: Array<MaintenancePart>;
  priority: Scalars['String']['output'];
  scheduledDate: Scalars['String']['output'];
  startedAt: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalCost: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  vendorId: Maybe<Scalars['ID']['output']>;
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

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  entityId: Maybe<Scalars['ID']['output']>;
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ipAddress: Maybe<Scalars['String']['output']>;
  newValuesJson: Maybe<Scalars['String']['output']>;
  oldValuesJson: Maybe<Scalars['String']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['ID']['output']>;
};

export type AuditLogPage = {
  __typename?: 'AuditLogPage';
  data: Array<AuditLog>;
  page: Scalars['Int']['output'];
  pages: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BomComponent = {
  __typename?: 'BOMComponent';
  itemId: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  scrapPercent: Scalars['Float']['output'];
  standardCost: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type BomComponentInput = {
  itemId: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  scrapPercent: InputMaybe<Scalars['Float']['input']>;
  standardCost: InputMaybe<Scalars['Float']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
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
  /** Initial balance for the account. Used as currentBalance on create. */
  openingBalance: InputMaybe<Scalars['Float']['input']>;
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

export type BillOfMaterials = {
  __typename?: 'BillOfMaterials';
  bomCode: Scalars['String']['output'];
  components: Array<BomComponent>;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  laborCost: Scalars['Float']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  overheadCost: Scalars['Float']['output'];
  parentItemId: Scalars['ID']['output'];
  parentItemName: Scalars['String']['output'];
  quantityProduced: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalCost: Scalars['Float']['output'];
  totalMaterialCost: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type Budget = {
  __typename?: 'Budget';
  budgetName: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  fiscalYear: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<BudgetLine>;
  organizationId: Scalars['String']['output'];
  seqNo: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type BudgetInput = {
  budgetName: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  fiscalYear: Scalars['String']['input'];
  lines: Array<BudgetLineInput>;
  organizationId: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type BudgetLine = {
  __typename?: 'BudgetLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  period: Scalars['String']['output'];
};

export type BudgetLineInput = {
  accountCode: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  period: Scalars['String']['input'];
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
  accountNumber: Maybe<Scalars['String']['output']>;
  accountType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  parentAccount: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ChartOfAccountsInput = {
  /** accountCode is generated server-side based on accountType. Ignored if supplied. */
  accountCode: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  /** Optional human-entered identifier (e.g. legacy ledger number). */
  accountNumber: InputMaybe<Scalars['String']['input']>;
  accountType: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
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

export type CompleteMaintenanceInput = {
  actionsTaken: InputMaybe<Scalars['String']['input']>;
  downtimeHours: InputMaybe<Scalars['Float']['input']>;
  findings: InputMaybe<Scalars['String']['input']>;
};

export type Contractor = {
  __typename?: 'Contractor';
  address: Maybe<Scalars['String']['output']>;
  contactPerson: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  specialty: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type ContractorInput = {
  address: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
  specialty: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type CreateAssetMaintenanceInput = {
  actionsTaken: InputMaybe<Scalars['String']['input']>;
  assetCode: InputMaybe<Scalars['String']['input']>;
  assetId: Scalars['ID']['input'];
  assetName: InputMaybe<Scalars['String']['input']>;
  assignedToName: InputMaybe<Scalars['String']['input']>;
  assignedToUserId: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  docNumber: Scalars['String']['input'];
  findings: InputMaybe<Scalars['String']['input']>;
  intervalDays: InputMaybe<Scalars['Int']['input']>;
  laborHours: InputMaybe<Scalars['Float']['input']>;
  laborRate: InputMaybe<Scalars['Float']['input']>;
  maintenanceType: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  partsUsed: InputMaybe<Array<MaintenancePartInput>>;
  priority: InputMaybe<Scalars['String']['input']>;
  scheduledDate: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type CreateAttendanceInput = {
  checkIn: InputMaybe<Scalars['String']['input']>;
  checkOut: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateBomInput = {
  bomCode: Scalars['String']['input'];
  components: Array<BomComponentInput>;
  description: InputMaybe<Scalars['String']['input']>;
  laborCost: InputMaybe<Scalars['Float']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  overheadCost: InputMaybe<Scalars['Float']['input']>;
  parentItemId: Scalars['ID']['input'];
  parentItemName: Scalars['String']['input'];
  quantityProduced: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
  version: InputMaybe<Scalars['String']['input']>;
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

export type CreateDeliveryOrderInput = {
  carrier: InputMaybe<Scalars['String']['input']>;
  customerId: InputMaybe<Scalars['ID']['input']>;
  customerName: InputMaybe<Scalars['String']['input']>;
  deliveryDate: Scalars['String']['input'];
  docNumber: Scalars['String']['input'];
  driverName: InputMaybe<Scalars['String']['input']>;
  driverPhone: InputMaybe<Scalars['String']['input']>;
  expectedArrival: InputMaybe<Scalars['String']['input']>;
  items: Array<DeliveryItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
  shippingAddress: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  trackingNumber: InputMaybe<Scalars['String']['input']>;
  vehicleNumber: InputMaybe<Scalars['String']['input']>;
};

export type CreateEmployeeMasterInput = {
  aadhaarNumber: InputMaybe<Scalars['String']['input']>;
  address: InputMaybe<Scalars['String']['input']>;
  alternatePhone: InputMaybe<Scalars['String']['input']>;
  bankDetails: InputMaybe<EmployeeBankInput>;
  basicSalary: InputMaybe<Scalars['Float']['input']>;
  bloodGroup: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  currency: InputMaybe<Scalars['String']['input']>;
  dateOfBirth: InputMaybe<Scalars['String']['input']>;
  dateOfConfirmation: InputMaybe<Scalars['String']['input']>;
  dateOfJoining: Scalars['String']['input'];
  department: InputMaybe<Scalars['String']['input']>;
  designation: InputMaybe<Scalars['String']['input']>;
  emergencyContact: InputMaybe<EmployeeEmergencyContactInput>;
  employeeCode: Scalars['String']['input'];
  employmentType: InputMaybe<Scalars['String']['input']>;
  esiNumber: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  maritalStatus: InputMaybe<Scalars['String']['input']>;
  nationality: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  panNumber: InputMaybe<Scalars['String']['input']>;
  personalEmail: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  pincode: InputMaybe<Scalars['String']['input']>;
  reportsToUserId: InputMaybe<Scalars['ID']['input']>;
  shiftMasterId: InputMaybe<Scalars['ID']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  uanNumber: InputMaybe<Scalars['String']['input']>;
  userId: InputMaybe<Scalars['ID']['input']>;
  workEmail: InputMaybe<Scalars['String']['input']>;
  workLocation: InputMaybe<Scalars['String']['input']>;
};

export type CreateFixedAssetInput = {
  acquisitionCost: Scalars['Float']['input'];
  assetCode: Scalars['String']['input'];
  assignedToUserId: InputMaybe<Scalars['ID']['input']>;
  barcode: InputMaybe<Scalars['String']['input']>;
  category: InputMaybe<Scalars['String']['input']>;
  commissionedDate: InputMaybe<Scalars['String']['input']>;
  depreciationMethod: InputMaybe<Scalars['String']['input']>;
  depreciationRatePercent: InputMaybe<Scalars['Float']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseDate: Scalars['String']['input'];
  salvageValue: InputMaybe<Scalars['Float']['input']>;
  serialNumber: InputMaybe<Scalars['String']['input']>;
  siteLocationId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  usefulLifeMonths: Scalars['Int']['input'];
  vendorId: InputMaybe<Scalars['ID']['input']>;
  warrantyExpiryDate: InputMaybe<Scalars['String']['input']>;
};

export type CreateGrnInput = {
  lineItems: Array<GrnLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  purchaseOrderId: InputMaybe<Scalars['ID']['input']>;
  receivedDate: Scalars['String']['input'];
  /** draft | submitted | approval_declined | confirmed (default draft) */
  status: InputMaybe<Scalars['String']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
  vendorName: InputMaybe<Scalars['String']['input']>;
};

export type CreateHrMasterInput = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  kind: Scalars['String']['input'];
  metadataJson: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  sortOrder: InputMaybe<Scalars['Int']['input']>;
};

export type CreateIntercompanyAllocationInput = {
  allocationMethod: InputMaybe<Scalars['String']['input']>;
  basisAmount: Scalars['Float']['input'];
  basisDate: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  lines: Array<AllocationLineInput>;
  name: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  scheduleCode: Scalars['String']['input'];
  sourceAccount: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type CreateIntercompanyJournalInput = {
  allocationId: InputMaybe<Scalars['ID']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  docNumber: Scalars['String']['input'];
  entryDate: Scalars['String']['input'];
  lines: Array<IntercompanyJournalLineInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  originatingOrganizationId: Scalars['ID']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type CreateIntercompanyTransferInput = {
  fromOrganizationId: Scalars['ID']['input'];
  fromOrganizationName: InputMaybe<Scalars['String']['input']>;
  lineItems: Array<IctLineItemInput>;
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  toOrganizationId: Scalars['ID']['input'];
  toOrganizationName: InputMaybe<Scalars['String']['input']>;
  transferDate: Scalars['String']['input'];
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

export type CreateModuleWorkspaceRecordInput = {
  approvalModuleKey: Scalars['String']['input'];
  detail: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  routePath: Scalars['String']['input'];
  snapshot: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
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

export type CreateQcInspectionInput = {
  batchNumber: InputMaybe<Scalars['String']['input']>;
  defects: InputMaybe<Array<QcDefectInput>>;
  docNumber: Scalars['String']['input'];
  inspectionDate: Scalars['String']['input'];
  inspectorName: InputMaybe<Scalars['String']['input']>;
  inspectorUserId: InputMaybe<Scalars['ID']['input']>;
  itemId: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  outcome: InputMaybe<Scalars['String']['input']>;
  quantityFailed: InputMaybe<Scalars['Float']['input']>;
  quantityInspected: Scalars['Float']['input'];
  quantityPassed: InputMaybe<Scalars['Float']['input']>;
  quantityReworked: InputMaybe<Scalars['Float']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  sourceModule: Scalars['String']['input'];
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

export type CreateTaxRateInput = {
  appliesTo: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  effectiveFrom: InputMaybe<Scalars['String']['input']>;
  effectiveTo: InputMaybe<Scalars['String']['input']>;
  hsnSacCode: InputMaybe<Scalars['String']['input']>;
  isCompound: InputMaybe<Scalars['Boolean']['input']>;
  isInclusive: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  ratePercent: Scalars['Float']['input'];
  status: InputMaybe<Scalars['String']['input']>;
  taxType: InputMaybe<Scalars['String']['input']>;
};

export type CreateTimesheetEntryInput = {
  billRate: InputMaybe<Scalars['Float']['input']>;
  billable: InputMaybe<Scalars['Boolean']['input']>;
  costRate: InputMaybe<Scalars['Float']['input']>;
  employeeUserId: Scalars['ID']['input'];
  entryDate: Scalars['String']['input'];
  hours: Scalars['Float']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  projectId: InputMaybe<Scalars['ID']['input']>;
  taskName: InputMaybe<Scalars['String']['input']>;
  workOrderId: InputMaybe<Scalars['ID']['input']>;
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

export type CurrencyRevaluation = {
  __typename?: 'CurrencyRevaluation';
  baseCurrency: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<CurrencyRevaluationLine>;
  organizationId: Scalars['String']['output'];
  postedAt: Maybe<Scalars['String']['output']>;
  revaluationDate: Scalars['String']['output'];
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalGainLoss: Scalars['Float']['output'];
};

export type CurrencyRevaluationInput = {
  baseCurrency: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  revaluationDate: Scalars['String']['input'];
};

export type CurrencyRevaluationLine = {
  __typename?: 'CurrencyRevaluationLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  gainLoss: Scalars['Float']['output'];
  originalAmount: Scalars['Float']['output'];
  revaluedAmount: Scalars['Float']['output'];
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

export type DashboardPreferences = {
  __typename?: 'DashboardPreferences';
  admin: Maybe<DashboardWidgetPreferences>;
  erp: Maybe<DashboardWidgetPreferences>;
  orgAdmin: Maybe<DashboardWidgetPreferences>;
};

export type DashboardWidgetPreferences = {
  __typename?: 'DashboardWidgetPreferences';
  hiddenWidgets: Array<Scalars['String']['output']>;
  widgetOrder: Array<Scalars['String']['output']>;
};

export type DashboardWidgetPreferencesInput = {
  hiddenWidgets: Array<Scalars['String']['input']>;
  widgetOrder: Array<Scalars['String']['input']>;
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

export type DeliveryItem = {
  __typename?: 'DeliveryItem';
  itemId: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type DeliveryItemInput = {
  itemId: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  unit: InputMaybe<Scalars['String']['input']>;
};

export type DeliveryOrder = {
  __typename?: 'DeliveryOrder';
  actualArrival: Maybe<Scalars['String']['output']>;
  carrier: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customerId: Maybe<Scalars['ID']['output']>;
  customerName: Maybe<Scalars['String']['output']>;
  deliveredAt: Maybe<Scalars['String']['output']>;
  deliveryDate: Scalars['String']['output'];
  dispatchedAt: Maybe<Scalars['String']['output']>;
  docNumber: Scalars['String']['output'];
  driverName: Maybe<Scalars['String']['output']>;
  driverPhone: Maybe<Scalars['String']['output']>;
  expectedArrival: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Array<DeliveryItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  salesOrderId: Maybe<Scalars['ID']['output']>;
  shippingAddress: Maybe<Scalars['String']['output']>;
  signedAt: Maybe<Scalars['String']['output']>;
  signedBy: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalQuantity: Scalars['Float']['output'];
  trackingNumber: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  vehicleNumber: Maybe<Scalars['String']['output']>;
};

export type DepreciationEntry = {
  __typename?: 'DepreciationEntry';
  accumulatedDepreciation: Scalars['Float']['output'];
  amount: Scalars['Float']['output'];
  bookValue: Scalars['Float']['output'];
  method: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  periodEndDate: Scalars['String']['output'];
  postedAt: Scalars['String']['output'];
};

export type Document = {
  __typename?: 'Document';
  category: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  downloadUrl: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimeType: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  parentId: Scalars['ID']['output'];
  parentModule: Scalars['String']['output'];
  sizeBytes: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  uploadedByUserId: Maybe<Scalars['ID']['output']>;
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

export type EmployeeBank = {
  __typename?: 'EmployeeBank';
  accountNumber: Maybe<Scalars['String']['output']>;
  bankName: Maybe<Scalars['String']['output']>;
  branchName: Maybe<Scalars['String']['output']>;
  ifscCode: Maybe<Scalars['String']['output']>;
};

export type EmployeeBankInput = {
  accountNumber: InputMaybe<Scalars['String']['input']>;
  bankName: InputMaybe<Scalars['String']['input']>;
  branchName: InputMaybe<Scalars['String']['input']>;
  ifscCode: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeEmergencyContact = {
  __typename?: 'EmployeeEmergencyContact';
  name: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  relation: Maybe<Scalars['String']['output']>;
};

export type EmployeeEmergencyContactInput = {
  name: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  relation: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeMaster = {
  __typename?: 'EmployeeMaster';
  aadhaarNumber: Maybe<Scalars['String']['output']>;
  address: Maybe<Scalars['String']['output']>;
  alternatePhone: Maybe<Scalars['String']['output']>;
  bankDetails: Maybe<EmployeeBank>;
  basicSalary: Scalars['Float']['output'];
  bloodGroup: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  dateOfBirth: Maybe<Scalars['String']['output']>;
  dateOfConfirmation: Maybe<Scalars['String']['output']>;
  dateOfJoining: Scalars['String']['output'];
  dateOfRelieving: Maybe<Scalars['String']['output']>;
  department: Maybe<Scalars['String']['output']>;
  designation: Maybe<Scalars['String']['output']>;
  emergencyContact: Maybe<EmployeeEmergencyContact>;
  employeeCode: Scalars['String']['output'];
  employmentType: Maybe<Scalars['String']['output']>;
  esiNumber: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  maritalStatus: Maybe<Scalars['String']['output']>;
  nationality: Maybe<Scalars['String']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  panNumber: Maybe<Scalars['String']['output']>;
  personalEmail: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  pincode: Maybe<Scalars['String']['output']>;
  reportsToUserId: Maybe<Scalars['ID']['output']>;
  shiftMasterId: Maybe<Scalars['ID']['output']>;
  state: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  uanNumber: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userId: Maybe<Scalars['ID']['output']>;
  workEmail: Maybe<Scalars['String']['output']>;
  workLocation: Maybe<Scalars['String']['output']>;
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

export type FixedAsset = {
  __typename?: 'FixedAsset';
  accumulatedDepreciation: Scalars['Float']['output'];
  acquisitionCost: Scalars['Float']['output'];
  assetCode: Scalars['String']['output'];
  assignedToUserId: Maybe<Scalars['ID']['output']>;
  barcode: Maybe<Scalars['String']['output']>;
  bookValue: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  commissionedDate: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  depreciationHistory: Array<DepreciationEntry>;
  depreciationMethod: Scalars['String']['output'];
  depreciationRatePercent: Maybe<Scalars['Float']['output']>;
  description: Maybe<Scalars['String']['output']>;
  disposalDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  purchaseDate: Scalars['String']['output'];
  salvageValue: Scalars['Float']['output'];
  serialNumber: Maybe<Scalars['String']['output']>;
  siteLocationId: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usefulLifeMonths: Scalars['Int']['output'];
  vendorId: Maybe<Scalars['ID']['output']>;
  warrantyExpiryDate: Maybe<Scalars['String']['output']>;
};

export type FixedAssetCategorySummary = {
  __typename?: 'FixedAssetCategorySummary';
  accumulatedDepreciation: Scalars['Float']['output'];
  acquisitionCost: Scalars['Float']['output'];
  bookValue: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
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

export type HrMaster = {
  __typename?: 'HrMaster';
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: Scalars['String']['output'];
  metadataJson: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IctLineItem = {
  __typename?: 'ICTLineItem';
  itemDescription: Scalars['String']['output'];
  qty: Scalars['Float']['output'];
  unit: Maybe<Scalars['String']['output']>;
};

export type IctLineItemInput = {
  itemDescription: Scalars['String']['input'];
  qty: Scalars['Float']['input'];
  unit: InputMaybe<Scalars['String']['input']>;
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

export type IntercompanyAllocation = {
  __typename?: 'IntercompanyAllocation';
  allocationMethod: Scalars['String']['output'];
  basisAmount: Scalars['Float']['output'];
  basisDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  journalEntryId: Maybe<Scalars['ID']['output']>;
  lines: Array<AllocationLine>;
  name: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  postedAt: Maybe<Scalars['String']['output']>;
  postedByUserId: Maybe<Scalars['ID']['output']>;
  scheduleCode: Scalars['String']['output'];
  sourceAccount: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAllocated: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IntercompanyJournalEntry = {
  __typename?: 'IntercompanyJournalEntry';
  allocationId: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  docNumber: Scalars['String']['output'];
  entryDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<IntercompanyJournalLine>;
  notes: Maybe<Scalars['String']['output']>;
  originatingOrganizationId: Scalars['ID']['output'];
  postedAt: Maybe<Scalars['String']['output']>;
  postedByUserId: Maybe<Scalars['ID']['output']>;
  reversalOfId: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  totalCredit: Scalars['Float']['output'];
  totalDebit: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IntercompanyJournalLine = {
  __typename?: 'IntercompanyJournalLine';
  account: Scalars['String']['output'];
  accountName: Maybe<Scalars['String']['output']>;
  costCenter: Maybe<Scalars['String']['output']>;
  credit: Scalars['Float']['output'];
  debit: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
};

export type IntercompanyJournalLineInput = {
  account: Scalars['String']['input'];
  accountName: InputMaybe<Scalars['String']['input']>;
  costCenter: InputMaybe<Scalars['String']['input']>;
  credit: InputMaybe<Scalars['Float']['input']>;
  debit: InputMaybe<Scalars['Float']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
};

export type IntercompanyTransfer = {
  __typename?: 'IntercompanyTransfer';
  createdAt: Maybe<Scalars['String']['output']>;
  fromOrganizationId: Scalars['ID']['output'];
  fromOrganizationName: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<IctLineItem>;
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  toOrganizationId: Scalars['ID']['output'];
  toOrganizationName: Maybe<Scalars['String']['output']>;
  transferDate: Scalars['String']['output'];
  transferNumber: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
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

export type JournalEntry = {
  __typename?: 'JournalEntry';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  entryDate: Scalars['String']['output'];
  entryNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lines: Array<JournalEntryLine>;
  organizationId: Scalars['String']['output'];
  postedAt: Maybe<Scalars['String']['output']>;
  postedBy: Maybe<Scalars['String']['output']>;
  referenceNumber: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  totalCredit: Scalars['Float']['output'];
  totalDebit: Scalars['Float']['output'];
};

export type JournalEntryInput = {
  description: Scalars['String']['input'];
  entryDate: Scalars['String']['input'];
  entryNumber: Scalars['String']['input'];
  lines: Array<JournalEntryLineInput>;
  organizationId: Scalars['String']['input'];
  referenceNumber: InputMaybe<Scalars['String']['input']>;
};

export type JournalEntryLine = {
  __typename?: 'JournalEntryLine';
  accountCode: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  credit: Scalars['Float']['output'];
  debit: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
};

export type JournalEntryLineInput = {
  accountCode: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  credit: Scalars['Float']['input'];
  debit: Scalars['Float']['input'];
  description: InputMaybe<Scalars['String']['input']>;
};

export type Lead = {
  __typename?: 'Lead';
  assignedTo: Maybe<Scalars['ID']['output']>;
  company: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  estimatedValue: Maybe<Scalars['Float']['output']>;
  expectedCloseDate: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  rating: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  source: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type LeadInput = {
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  company: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  estimatedValue: InputMaybe<Scalars['Float']['input']>;
  expectedCloseDate: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
  rating: InputMaybe<Scalars['String']['input']>;
  source: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
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

export type MaintenancePart = {
  __typename?: 'MaintenancePart';
  costPerUnit: Scalars['Float']['output'];
  itemId: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  lineTotal: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type MaintenancePartInput = {
  costPerUnit: InputMaybe<Scalars['Float']['input']>;
  itemId: InputMaybe<Scalars['ID']['input']>;
  itemName: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  unit: InputMaybe<Scalars['String']['input']>;
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

export type Milestone = {
  __typename?: 'Milestone';
  completedAt: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  dueDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type MilestoneInput = {
  completedAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  dueDate: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};

export type ModulePermission = {
  __typename?: 'ModulePermission';
  canCreate: Scalars['Boolean']['output'];
  canDelete: Scalars['Boolean']['output'];
  canUpdate: Scalars['Boolean']['output'];
  canView: Scalars['Boolean']['output'];
  moduleKey: Scalars['String']['output'];
};

export type ModulePermissionInput = {
  canCreate: Scalars['Boolean']['input'];
  canDelete: Scalars['Boolean']['input'];
  canUpdate: Scalars['Boolean']['input'];
  canView: Scalars['Boolean']['input'];
  moduleKey: Scalars['String']['input'];
};

export type ModuleWorkspaceRecord = {
  __typename?: 'ModuleWorkspaceRecord';
  approvalModuleKey: Scalars['String']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  createdByUserId: Maybe<Scalars['ID']['output']>;
  detail: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  routePath: Scalars['String']['output'];
  snapshot: Maybe<Scalars['String']['output']>;
  status: ModuleWorkspaceStatus;
  title: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['String']['output']>;
};

export enum ModuleWorkspaceStatus {
  Approved = 'APPROVED',
  Draft = 'DRAFT',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED'
}

export type Mutation = {
  __typename?: 'Mutation';
  activateBudget: Budget;
  adjustStock: InventoryControl;
  approveLeaveApplication: LeaveApplication;
  approveLeaveReinstatement: LeaveReinstatement;
  approvePurchaseOrder: PurchaseOrder;
  approveReturnAuthorization: ReturnAuthorization;
  approveVendorBill: VendorBill;
  archiveAllNotifications: Scalars['Int']['output'];
  archiveNotification: Notification;
  billPurchaseOrder: VendorBill;
  cancelCustomerDeposit: CustomerDeposit;
  cancelCustomerRefund: CustomerRefund;
  cancelFinanceChargeAssessment: FinanceChargeAssessment;
  cancelIntercompanyTransfer: IntercompanyTransfer;
  cancelMaterialReceipt: MaterialReceipt;
  cancelReturnAuthorization: ReturnAuthorization;
  cancelStockAdjustment: StockAdjustment;
  cancelStockTransfer: StockTransfer;
  completeAssetMaintenance: AssetMaintenance;
  confirmIntercompanyTransfer: IntercompanyTransfer;
  confirmMaterialReceipt: MaterialReceipt;
  confirmStockAdjustment: StockAdjustment;
  confirmStockTransfer: StockTransfer;
  convertLeadToOpportunity: Scalars['ID']['output'];
  createAllocationSchedule: AllocationSchedule;
  createApplicant: Applicant;
  createAsset: Asset;
  createAssetMaintenance: AssetMaintenance;
  createAttendance: Attendance;
  createBankAccount: BankAccount;
  createBankStatementLine: BankStatementLine;
  createBillOfMaterials: BillOfMaterials;
  createBudget: Budget;
  createCareer: Career;
  createCashBank: CashBank;
  createChartOfAccount: ChartOfAccounts;
  createClient: Client;
  createContractor: Contractor;
  createCurrencyRevaluation: CurrencyRevaluation;
  createCustomer: Customer;
  createCustomerDeposit: CustomerDeposit;
  createCustomerInvoice: CustomerInvoice;
  createCustomerPayment: CustomerPayment;
  createCustomerRefund: CustomerRefund;
  createDVS: Dvs;
  createDeliveryChallan: DeliveryChallan;
  createDeliveryOrder: DeliveryOrder;
  createEPM: Epm;
  createEmployeeMaster: EmployeeMaster;
  createExciseInvoice: ExciseInvoice;
  createExtraction: Extraction;
  createFixedAsset: FixedAsset;
  createGRN: Grn;
  createGeneralLedger: GeneralLedger;
  createGoodsReceipt: GoodsReceipt;
  createHrMaster: HrMaster;
  createIPInspection: IpInspection;
  createIntercompanyAllocation: IntercompanyAllocation;
  createIntercompanyJournalEntry: IntercompanyJournalEntry;
  createIntercompanyTransfer: IntercompanyTransfer;
  createInternalOrder: InternalOrder;
  createInventoryControl: InventoryControl;
  createInventoryReturn: InventoryReturn;
  createItem: Item;
  createJournalEntry: JournalEntry;
  createLead: Lead;
  createLeaveApplication: LeaveApplication;
  createLeaveEnrollment: LeaveEnrollment;
  createLeaveReinstatement: LeaveReinstatement;
  createLeaveType: LeaveType;
  createLoanRepayment: LoanRepayment;
  createMaterialReceipt: MaterialReceipt;
  createModuleWorkspaceRecord: ModuleWorkspaceRecord;
  createOpportunity: Opportunity;
  createOrganization: Organization;
  createOrganizationWithOrgAdmin: Organization;
  createPayrollManagement: PayrollManagement;
  createPayrollUiRecord: PayrollUiRecord;
  createProduct: Product;
  createProductionPlanning: ProductionPlanning;
  createProject: Project;
  createPurchaseOrder: PurchaseOrder;
  createQCInspection: QcInspection;
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
  createSiteLocation: SiteLocation;
  createStockAdjustment: StockAdjustment;
  createStockMovement: StockMovement;
  createStockTransfer: StockTransfer;
  createTaxRate: TaxRate;
  createTimesheetEntry: TimesheetEntry;
  createUser: User;
  createVendor: Vendor;
  createVendorBill: VendorBill;
  createVendorCredit: VendorCredit;
  createVendorPayment: VendorPayment;
  createVendorPrepayment: VendorPrepayment;
  createWarehouse: Warehouse;
  createWarehouseBin: WarehouseBin;
  createWorkOrder: WorkOrder;
  deleteAllocationSchedule: Scalars['Boolean']['output'];
  deleteApplicant: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteAssetMaintenance: AssetMaintenance;
  deleteAttendance: Attendance;
  deleteBankStatementLine: Scalars['Boolean']['output'];
  deleteBillOfMaterials: BillOfMaterials;
  deleteBudget: Scalars['Boolean']['output'];
  deleteCareer: Scalars['Boolean']['output'];
  deleteChartOfAccount: Scalars['Boolean']['output'];
  deleteClient: Scalars['Boolean']['output'];
  deleteContractor: Scalars['Boolean']['output'];
  deleteCurrencyRevaluation: Scalars['Boolean']['output'];
  deleteCustomer: Scalars['Boolean']['output'];
  deleteCustomerInvoice: CustomerInvoice;
  deleteCustomerPayment: Scalars['Boolean']['output'];
  deleteDVS: Scalars['Boolean']['output'];
  deleteDeliveryChallan: Scalars['Boolean']['output'];
  deleteDeliveryOrder: DeliveryOrder;
  deleteDocument: Document;
  deleteEPM: Scalars['Boolean']['output'];
  deleteEmployeeMaster: EmployeeMaster;
  deleteExciseInvoice: Scalars['Boolean']['output'];
  deleteExtraction: Scalars['Boolean']['output'];
  deleteFinanceChargeAssessment: Scalars['Boolean']['output'];
  deleteFixedAsset: FixedAsset;
  deleteGRN: Scalars['Boolean']['output'];
  deleteGoodsReceipt: Scalars['Boolean']['output'];
  deleteHrMaster: HrMaster;
  deleteIPInspection: Scalars['Boolean']['output'];
  deleteIndividualPriceList: Scalars['Boolean']['output'];
  deleteIntercompanyAllocation: IntercompanyAllocation;
  deleteIntercompanyJournalEntry: IntercompanyJournalEntry;
  deleteIntercompanyTransfer: Scalars['Boolean']['output'];
  deleteInternalOrder: Scalars['Boolean']['output'];
  deleteInventoryReturn: Scalars['Boolean']['output'];
  deleteItem: Item;
  deleteJournalEntry: Scalars['Boolean']['output'];
  deleteLead: Scalars['Boolean']['output'];
  deleteLeaveApplication: LeaveApplication;
  deleteLeaveEnrollment: LeaveEnrollment;
  deleteLeaveReinstatement: LeaveReinstatement;
  deleteLeaveType: LeaveType;
  deleteLoanRepayment: Scalars['Boolean']['output'];
  deleteMaterialReceipt: Scalars['Boolean']['output'];
  deleteOpportunity: Scalars['Boolean']['output'];
  deleteOrganization: Organization;
  deletePayrollManagement: Scalars['Boolean']['output'];
  deletePayrollUiRecord: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductionPlanning: Scalars['Boolean']['output'];
  deleteProject: Project;
  deletePurchaseOrder: Scalars['Boolean']['output'];
  deleteQCInspection: QcInspection;
  deleteQuotation: Scalars['Boolean']['output'];
  deleteReconciliationRule: Scalars['Boolean']['output'];
  deleteReturnAuthorization: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteSalaryProcessing: Scalars['Boolean']['output'];
  deleteSalesEnquiry: SalesEnquiry;
  deleteSalesOrder: SalesOrder;
  deleteSalesQuotation: SalesQuotation;
  deleteSalesReturn: Scalars['Boolean']['output'];
  deleteSiteLocation: Scalars['Boolean']['output'];
  deleteStockAdjustment: Scalars['Boolean']['output'];
  deleteStockTransfer: Scalars['Boolean']['output'];
  deleteTaxRate: TaxRate;
  deleteTimesheetEntry: TimesheetEntry;
  deleteUser: User;
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorBill: Scalars['Boolean']['output'];
  deleteVendorCredit: Scalars['Boolean']['output'];
  deleteVendorPayment: Scalars['Boolean']['output'];
  deleteVendorPrepayment: Scalars['Boolean']['output'];
  deleteWorkOrder: Scalars['Boolean']['output'];
  disposeFixedAsset: FixedAsset;
  draftFinanceChargeAssessment: FinanceChargeAssessment;
  generatePriceList: PriceList;
  login: AuthPayload;
  markAllNotificationsRead: Scalars['Int']['output'];
  markNotificationRead: Notification;
  matchBankStatementLineToBook: BankStatementLine;
  postCurrencyRevaluation: CurrencyRevaluation;
  postFinanceChargeAssessment: FinanceChargeAssessment;
  postFixedAssetDepreciation: FixedAsset;
  postIntercompanyAllocation: IntercompanyAllocation;
  postIntercompanyJournalEntry: IntercompanyJournalEntry;
  postJournalEntry: JournalEntry;
  receivePurchaseOrder: PurchaseOrder;
  receiveReturnAuthorizationGoods: ReturnAuthorization;
  reconcileCashBank: CashBank;
  refundCashSale: SalesOrder;
  register: AuthPayload;
  rejectLeaveApplication: LeaveApplication;
  rejectLeaveReinstatement: LeaveReinstatement;
  rejectReturnAuthorization: ReturnAuthorization;
  resolveApprovalRequest: ApprovalRequest;
  resolveTimesheetEntry: TimesheetEntry;
  reverseIntercompanyAllocation: IntercompanyAllocation;
  reverseIntercompanyJournalEntry: IntercompanyJournalEntry;
  seedIndividualPriceListFromCatalog: IndividualPriceList;
  seedSystemRoles: Array<Role>;
  /**
   * Send a notification (broadcast/maintenance/announcement/alert).
   * Super admin can target all org admins or specific users in any org.
   * Org admin can target all users in their own org or specific users in their own org.
   * Returns the number of notifications created.
   */
  sendNotification: Scalars['Int']['output'];
  sendQuotation: SendQuotationResult;
  /** Replace module-level approver assignments for an organization (org admin: own org only). */
  setOrganizationModuleApprovers: Organization;
  setQCInspectionOutcome: QcInspection;
  setUserModulePermissions: User;
  startAssetMaintenance: AssetMaintenance;
  submitCustomerInvoiceForApproval: CustomerInvoice;
  submitDeliveryChallanForApproval: DeliveryChallan;
  submitGRNForApproval: Grn;
  submitLeadForApproval: Lead;
  submitMaterialReceiptForApproval: MaterialReceipt;
  submitModuleWorkspaceRecordForApproval: ModuleWorkspaceRecord;
  submitPayrollManagementForApproval: PayrollManagement;
  submitPayrollUiRecordForApproval: PayrollUiRecord;
  submitProjectForApproval: Project;
  submitPurchaseOrder: PurchaseOrder;
  submitQuotationForApproval: Quotation;
  submitSalesEnquiryForApproval: SalesEnquiry;
  /** Draft → pending approval inbox for the Sales approver configured under Org admin → Approvals. */
  submitSalesOrder: SalesOrder;
  submitSalesReturnForApproval: SalesReturn;
  submitTimesheetEntry: TimesheetEntry;
  submitVendorBillForApproval: VendorBill;
  submitVendorForApproval: Vendor;
  transferBankFunds: BankTransferResult;
  transitionDeliveryOrderStatus: DeliveryOrder;
  updateAllocationSchedule: AllocationSchedule;
  updateApplicant: Applicant;
  updateAsset: Asset;
  updateAssetMaintenance: AssetMaintenance;
  updateAttendance: Attendance;
  updateBankAccount: BankAccount;
  updateBillOfMaterials: BillOfMaterials;
  updateBudget: Budget;
  updateCareer: Career;
  updateChartOfAccount: ChartOfAccounts;
  updateClient: Client;
  updateContractor: Contractor;
  updateCustomer: Customer;
  updateCustomerInvoice: CustomerInvoice;
  updateCustomerPayment: CustomerPayment;
  updateDVS: Dvs;
  updateDeliveryChallan: DeliveryChallan;
  updateDeliveryOrder: DeliveryOrder;
  updateEPM: Epm;
  updateEmployeeMaster: EmployeeMaster;
  updateExciseInvoice: ExciseInvoice;
  updateExtraction: Extraction;
  updateFixedAsset: FixedAsset;
  updateGRN: Grn;
  updateGoodsReceipt: GoodsReceipt;
  updateHrMaster: HrMaster;
  updateIPInspection: IpInspection;
  updateIntercompanyAllocation: IntercompanyAllocation;
  updateIntercompanyJournalEntry: IntercompanyJournalEntry;
  updateIntercompanyTransfer: IntercompanyTransfer;
  updateInternalOrder: InternalOrder;
  updateInventoryControl: InventoryControl;
  updateInventoryReturn: InventoryReturn;
  updateItem: Item;
  updateJournalEntry: JournalEntry;
  updateLead: Lead;
  updateLeaveApplication: LeaveApplication;
  updateLeaveEnrollment: LeaveEnrollment;
  updateLeaveReinstatement: LeaveReinstatement;
  updateLeaveType: LeaveType;
  updateLoanRepayment: LoanRepayment;
  updateMaterialReceipt: MaterialReceipt;
  updateModuleWorkspaceRecord: ModuleWorkspaceRecord;
  updateMyDashboardPreferences: User;
  updateOpportunity: Opportunity;
  updateOrganization: Organization;
  updatePayrollManagement: PayrollManagement;
  updatePayrollUiRecord: PayrollUiRecord;
  updateProduct: Product;
  updateProductionPlanning: ProductionPlanning;
  updateProject: Project;
  updatePurchaseOrder: PurchaseOrder;
  updateQCInspection: QcInspection;
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
  updateSiteLocation: SiteLocation;
  updateStockAdjustment: StockAdjustment;
  updateStockTransfer: StockTransfer;
  updateTaxRate: TaxRate;
  updateTimesheetEntry: TimesheetEntry;
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


export type MutationActivateBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAdjustStockArgs = {
  binLocation: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
  organizationId: InputMaybe<Scalars['String']['input']>;
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


export type MutationArchiveNotificationArgs = {
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


export type MutationCancelIntercompanyTransferArgs = {
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


export type MutationCompleteAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
  input: CompleteMaintenanceInput;
};


export type MutationConfirmIntercompanyTransferArgs = {
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


export type MutationConvertLeadToOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateAllocationScheduleArgs = {
  input: AllocationScheduleInput;
};


export type MutationCreateApplicantArgs = {
  input: ApplicantInput;
};


export type MutationCreateAssetArgs = {
  input: AssetInput;
};


export type MutationCreateAssetMaintenanceArgs = {
  input: CreateAssetMaintenanceInput;
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


export type MutationCreateBillOfMaterialsArgs = {
  input: CreateBomInput;
};


export type MutationCreateBudgetArgs = {
  input: BudgetInput;
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


export type MutationCreateContractorArgs = {
  input: ContractorInput;
};


export type MutationCreateCurrencyRevaluationArgs = {
  input: CurrencyRevaluationInput;
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


export type MutationCreateDeliveryOrderArgs = {
  input: CreateDeliveryOrderInput;
};


export type MutationCreateEpmArgs = {
  input: EpmInput;
};


export type MutationCreateEmployeeMasterArgs = {
  input: CreateEmployeeMasterInput;
};


export type MutationCreateExciseInvoiceArgs = {
  input: ExciseInvoiceInput;
};


export type MutationCreateExtractionArgs = {
  input: ExtractionInput;
};


export type MutationCreateFixedAssetArgs = {
  input: CreateFixedAssetInput;
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


export type MutationCreateHrMasterArgs = {
  input: CreateHrMasterInput;
};


export type MutationCreateIpInspectionArgs = {
  input: IpInspectionInput;
};


export type MutationCreateIntercompanyAllocationArgs = {
  input: CreateIntercompanyAllocationInput;
};


export type MutationCreateIntercompanyJournalEntryArgs = {
  input: CreateIntercompanyJournalInput;
};


export type MutationCreateIntercompanyTransferArgs = {
  input: CreateIntercompanyTransferInput;
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


export type MutationCreateJournalEntryArgs = {
  input: JournalEntryInput;
};


export type MutationCreateLeadArgs = {
  input: LeadInput;
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


export type MutationCreateModuleWorkspaceRecordArgs = {
  input: CreateModuleWorkspaceRecordInput;
};


export type MutationCreateOpportunityArgs = {
  input: OpportunityInput;
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


export type MutationCreatePayrollUiRecordArgs = {
  input: PayrollUiRecordInput;
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


export type MutationCreateQcInspectionArgs = {
  input: CreateQcInspectionInput;
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


export type MutationCreateSiteLocationArgs = {
  input: SiteLocationInput;
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


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateTimesheetEntryArgs = {
  input: CreateTimesheetEntryInput;
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


export type MutationDeleteAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteApplicantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBankStatementLineArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBudgetArgs = {
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


export type MutationDeleteContractorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCurrencyRevaluationArgs = {
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


export type MutationDeleteDeliveryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEpmArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEmployeeMasterArgs = {
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


export type MutationDeleteFixedAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGrnArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHrMasterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIpInspectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIndividualPriceListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIntercompanyTransferArgs = {
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


export type MutationDeleteJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeadArgs = {
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


export type MutationDeleteOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollManagementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePayrollUiRecordArgs = {
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


export type MutationDeleteQcInspectionArgs = {
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


export type MutationDeleteSiteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStockTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTimesheetEntryArgs = {
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


export type MutationDisposeFixedAssetArgs = {
  disposalDate: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
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


export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMatchBankStatementLineToBookArgs = {
  bankStatementLineId: Scalars['ID']['input'];
  cashBankId: Scalars['ID']['input'];
};


export type MutationPostCurrencyRevaluationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostFinanceChargeAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostFixedAssetDepreciationArgs = {
  id: Scalars['ID']['input'];
  input: PostDepreciationInput;
};


export type MutationPostIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPostJournalEntryArgs = {
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


export type MutationResolveApprovalRequestArgs = {
  decision: ApprovalDecision;
  id: Scalars['ID']['input'];
  note: InputMaybe<Scalars['String']['input']>;
};


export type MutationResolveTimesheetEntryArgs = {
  decision: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
};


export type MutationReverseIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReverseIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSeedIndividualPriceListFromCatalogArgs = {
  customerId: Scalars['ID']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
};


export type MutationSendQuotationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetOrganizationModuleApproversArgs = {
  assignments: Array<OrganizationModuleApproverInput>;
  organizationId: Scalars['ID']['input'];
};


export type MutationSetQcInspectionOutcomeArgs = {
  id: Scalars['ID']['input'];
  notes: InputMaybe<Scalars['String']['input']>;
  outcome: Scalars['String']['input'];
};


export type MutationSetUserModulePermissionsArgs = {
  permissions: Array<ModulePermissionInput>;
  userId: Scalars['ID']['input'];
};


export type MutationStartAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitCustomerInvoiceForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitDeliveryChallanForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitGrnForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitLeadForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitMaterialReceiptForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitModuleWorkspaceRecordForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPayrollManagementForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPayrollUiRecordForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitProjectForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitPurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitQuotationForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitSalesEnquiryForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitSalesOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitSalesReturnForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitVendorBillForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitVendorForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTransferBankFundsArgs = {
  input: BankTransferInput;
};


export type MutationTransitionDeliveryOrderStatusArgs = {
  id: Scalars['ID']['input'];
  signedBy: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};


export type MutationUpdateAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
  input: AllocationScheduleInput;
};


export type MutationUpdateApplicantArgs = {
  id: Scalars['ID']['input'];
  input: ApplicantInput;
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID']['input'];
  input: AssetInput;
};


export type MutationUpdateAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssetMaintenanceInput;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAttendanceInput;
};


export type MutationUpdateBankAccountArgs = {
  id: Scalars['ID']['input'];
  input: BankAccountInput;
};


export type MutationUpdateBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBomInput;
};


export type MutationUpdateBudgetArgs = {
  id: Scalars['ID']['input'];
  input: BudgetInput;
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


export type MutationUpdateContractorArgs = {
  id: Scalars['ID']['input'];
  input: ContractorInput;
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


export type MutationUpdateDeliveryOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateDeliveryOrderInput;
};


export type MutationUpdateEpmArgs = {
  id: Scalars['ID']['input'];
  input: EpmInput;
};


export type MutationUpdateEmployeeMasterArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEmployeeMasterInput;
};


export type MutationUpdateExciseInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: ExciseInvoiceInput;
};


export type MutationUpdateExtractionArgs = {
  id: Scalars['ID']['input'];
  input: ExtractionInput;
};


export type MutationUpdateFixedAssetArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFixedAssetInput;
};


export type MutationUpdateGrnArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGrnInput;
};


export type MutationUpdateGoodsReceiptArgs = {
  id: Scalars['ID']['input'];
  input: GoodsReceiptInput;
};


export type MutationUpdateHrMasterArgs = {
  id: Scalars['ID']['input'];
  input: UpdateHrMasterInput;
};


export type MutationUpdateIpInspectionArgs = {
  id: Scalars['ID']['input'];
  input: IpInspectionInput;
};


export type MutationUpdateIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyAllocationInput;
};


export type MutationUpdateIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyJournalInput;
};


export type MutationUpdateIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
  input: UpdateIntercompanyTransferInput;
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


export type MutationUpdateJournalEntryArgs = {
  id: Scalars['ID']['input'];
  input: JournalEntryInput;
};


export type MutationUpdateLeadArgs = {
  id: Scalars['ID']['input'];
  input: LeadInput;
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


export type MutationUpdateModuleWorkspaceRecordArgs = {
  detail: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  snapshot: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateMyDashboardPreferencesArgs = {
  dashboard: Scalars['String']['input'];
  input: DashboardWidgetPreferencesInput;
};


export type MutationUpdateOpportunityArgs = {
  id: Scalars['ID']['input'];
  input: OpportunityInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
};


export type MutationUpdatePayrollManagementArgs = {
  id: Scalars['ID']['input'];
  input: PayrollManagementInput;
};


export type MutationUpdatePayrollUiRecordArgs = {
  id: Scalars['ID']['input'];
  input: PayrollUiRecordInput;
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


export type MutationUpdateQcInspectionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQcInspectionInput;
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


export type MutationUpdateSiteLocationArgs = {
  id: Scalars['ID']['input'];
  input: SiteLocationInput;
};


export type MutationUpdateStockAdjustmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStockAdjustmentInput;
};


export type MutationUpdateStockTransferArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStockTransferInput;
};


export type MutationUpdateTaxRateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTaxRateInput;
};


export type MutationUpdateTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTimesheetEntryInput;
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

export type Notification = {
  __typename?: 'Notification';
  actorUserId: Maybe<Scalars['ID']['output']>;
  archivedAt: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  kind: NotificationKind;
  link: Maybe<Scalars['String']['output']>;
  message: Maybe<Scalars['String']['output']>;
  moduleKey: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  readAt: Maybe<Scalars['String']['output']>;
  recipientUserId: Scalars['ID']['output'];
  referenceId: Maybe<Scalars['ID']['output']>;
  referenceModule: Maybe<Scalars['String']['output']>;
  severity: NotificationSeverity;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export enum NotificationKind {
  Alert = 'ALERT',
  Announcement = 'ANNOUNCEMENT',
  ApprovalApproved = 'APPROVAL_APPROVED',
  ApprovalRejected = 'APPROVAL_REJECTED',
  ApprovalRequest = 'APPROVAL_REQUEST',
  BillDue = 'BILL_DUE',
  Broadcast = 'BROADCAST',
  InvoiceOverdue = 'INVOICE_OVERDUE',
  LowStock = 'LOW_STOCK',
  Maintenance = 'MAINTENANCE',
  Mention = 'MENTION',
  NewLead = 'NEW_LEAD',
  System = 'SYSTEM'
}

export enum NotificationSeverity {
  Danger = 'DANGER',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type Opportunity = {
  __typename?: 'Opportunity';
  accountName: Maybe<Scalars['String']['output']>;
  amount: Maybe<Scalars['Float']['output']>;
  assignedTo: Maybe<Scalars['ID']['output']>;
  closeDate: Maybe<Scalars['String']['output']>;
  contactName: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  leadSource: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nextStep: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  probability: Maybe<Scalars['Int']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  stage: Scalars['String']['output'];
};

export type OpportunityInput = {
  accountName: InputMaybe<Scalars['String']['input']>;
  amount: InputMaybe<Scalars['Float']['input']>;
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  closeDate: InputMaybe<Scalars['String']['input']>;
  contactName: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  leadSource: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  nextStep: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
  probability: InputMaybe<Scalars['Int']['input']>;
  stage: InputMaybe<Scalars['String']['input']>;
};

export type Organization = {
  __typename?: 'Organization';
  address: Maybe<Scalars['String']['output']>;
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  moduleApprovers: Array<OrganizationModuleApprover>;
  name: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

/** Which user under the organization acts as workflow approver for a given ERP module. */
export type OrganizationModuleApprover = {
  __typename?: 'OrganizationModuleApprover';
  approverUserId: Maybe<Scalars['ID']['output']>;
  moduleKey: Scalars['String']['output'];
};

export type OrganizationModuleApproverInput = {
  /** Set to omit or empty to clear the approver for this module. */
  approverUserId: InputMaybe<Scalars['ID']['input']>;
  moduleKey: Scalars['String']['input'];
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

export type PayrollUiRecord = {
  __typename?: 'PayrollUiRecord';
  approvalStatus: Scalars['String']['output'];
  category: Scalars['String']['output'];
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PayrollUiRecordInput = {
  category: Scalars['String']['input'];
  code: InputMaybe<Scalars['String']['input']>;
  data: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
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

export type PostDepreciationInput = {
  amount: InputMaybe<Scalars['Float']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  periodEndDate: Scalars['String']['input'];
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
  actualCost: Maybe<Scalars['Float']['output']>;
  budget: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  docDate: Scalars['String']['output'];
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  managerId: Maybe<Scalars['ID']['output']>;
  milestones: Maybe<Array<Milestone>>;
  organizationId: Scalars['String']['output'];
  progress: Maybe<Scalars['Float']['output']>;
  projectId: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  tasks: Maybe<Array<Task>>;
};

export type ProductionPlanningInput = {
  actualCost: InputMaybe<Scalars['Float']['input']>;
  budget: InputMaybe<Scalars['Float']['input']>;
  docDate: Scalars['String']['input'];
  managerId: InputMaybe<Scalars['ID']['input']>;
  milestones: InputMaybe<Array<MilestoneInput>>;
  organizationId: Scalars['String']['input'];
  progress: InputMaybe<Scalars['Float']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  tasks: InputMaybe<Array<TaskInput>>;
};

export type Project = {
  __typename?: 'Project';
  createdAt: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** draft | submitted | approval_declined | approved — omitted on legacy rows means approved */
  orgApprovalStatus: Scalars['String']['output'];
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

export type QcDefect = {
  __typename?: 'QCDefect';
  code: Scalars['String']['output'];
  correctiveAction: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  rootCause: Maybe<Scalars['String']['output']>;
  severity: Scalars['String']['output'];
};

export type QcDefectInput = {
  code: Scalars['String']['input'];
  correctiveAction: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  quantity: InputMaybe<Scalars['Float']['input']>;
  rootCause: InputMaybe<Scalars['String']['input']>;
  severity: InputMaybe<Scalars['String']['input']>;
};

export type QcInspection = {
  __typename?: 'QCInspection';
  batchNumber: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  defects: Array<QcDefect>;
  docNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inspectionDate: Scalars['String']['output'];
  inspectorName: Maybe<Scalars['String']['output']>;
  inspectorUserId: Maybe<Scalars['ID']['output']>;
  itemId: Maybe<Scalars['ID']['output']>;
  itemName: Scalars['String']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  outcome: Scalars['String']['output'];
  quantityFailed: Scalars['Float']['output'];
  quantityInspected: Scalars['Float']['output'];
  quantityPassed: Scalars['Float']['output'];
  quantityReworked: Scalars['Float']['output'];
  sourceId: Maybe<Scalars['ID']['output']>;
  sourceModule: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type QcOutcomeSummary = {
  __typename?: 'QCOutcomeSummary';
  count: Scalars['Int']['output'];
  outcome: Scalars['String']['output'];
  quantityFailed: Scalars['Float']['output'];
  quantityInspected: Scalars['Float']['output'];
  quantityPassed: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  allocationSchedule: Maybe<AllocationSchedule>;
  allocationSchedules: Array<AllocationSchedule>;
  applicant: Maybe<Applicant>;
  applicants: Array<Applicant>;
  asset: Maybe<Asset>;
  assetMaintenance: Maybe<AssetMaintenance>;
  assetMaintenances: Array<AssetMaintenance>;
  assets: Array<Asset>;
  attendance: Maybe<Attendance>;
  attendances: Array<Attendance>;
  auditLogs: AuditLogPage;
  availableVendorCredits: Array<VendorCredit>;
  availableVendorPrepayments: Array<VendorPrepayment>;
  bankAccount: Maybe<BankAccount>;
  bankAccounts: Array<BankAccount>;
  bankStatementLines: Array<BankStatementLine>;
  billOfMaterials: Maybe<BillOfMaterials>;
  billsOfMaterials: Array<BillOfMaterials>;
  budget: Maybe<Budget>;
  budgets: Array<Budget>;
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
  contractor: Maybe<Contractor>;
  contractors: Array<Contractor>;
  currencyRevaluation: Maybe<CurrencyRevaluation>;
  currencyRevaluations: Array<CurrencyRevaluation>;
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
  deliveryOrder: Maybe<DeliveryOrder>;
  deliveryOrders: Array<DeliveryOrder>;
  deliverychallan: Maybe<DeliveryChallan>;
  deliverychallans: Array<DeliveryChallan>;
  document: Maybe<Document>;
  documents: Array<Document>;
  dvs: Maybe<Dvs>;
  dvsRecords: Array<Dvs>;
  employeeMaster: Maybe<EmployeeMaster>;
  employeeMasters: Array<EmployeeMaster>;
  epm: Maybe<Epm>;
  epms: Array<Epm>;
  exciseinvoice: Maybe<ExciseInvoice>;
  exciseinvoices: Array<ExciseInvoice>;
  extraction: Maybe<Extraction>;
  extractions: Array<Extraction>;
  financeChargeAssessment: Maybe<FinanceChargeAssessment>;
  financeChargeAssessments: Array<FinanceChargeAssessment>;
  fixedAsset: Maybe<FixedAsset>;
  fixedAssetSummaryByCategory: Array<FixedAssetCategorySummary>;
  fixedAssets: Array<FixedAsset>;
  generalLedger: Maybe<GeneralLedger>;
  generalLedgers: Array<GeneralLedger>;
  generateCustomerStatement: CustomerStatement;
  /** Cross-collection search inside the current organization. */
  globalSearch: Array<SearchHit>;
  goodsreceipt: Maybe<GoodsReceipt>;
  goodsreceipts: Array<GoodsReceipt>;
  grn: Maybe<Grn>;
  grns: Array<Grn>;
  grnsByPO: Array<Grn>;
  hrMaster: Maybe<HrMaster>;
  hrMasters: Array<HrMaster>;
  individualPriceList: Maybe<IndividualPriceList>;
  individualPriceListByCustomer: Maybe<IndividualPriceList>;
  individualPriceLists: Array<IndividualPriceList>;
  intercompanyAllocation: Maybe<IntercompanyAllocation>;
  intercompanyAllocations: Array<IntercompanyAllocation>;
  intercompanyJournalEntries: Array<IntercompanyJournalEntry>;
  intercompanyJournalEntry: Maybe<IntercompanyJournalEntry>;
  intercompanyTransfer: Maybe<IntercompanyTransfer>;
  intercompanyTransfers: Array<IntercompanyTransfer>;
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
  journalEntries: Array<JournalEntry>;
  journalEntry: Maybe<JournalEntry>;
  lead: Maybe<Lead>;
  leads: Array<Lead>;
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
  moduleWorkspaceRecords: Array<ModuleWorkspaceRecord>;
  /**
   * Approval requests the current user is involved in, either as requester
   * or as assigned approver. Filter by status and/or role.
   */
  myApprovalRequests: Array<ApprovalRequest>;
  /** Notifications addressed to the current user (newest first). */
  myNotifications: Array<Notification>;
  /** Approval tasks assigned to the current user (same organization). */
  myPendingApprovalRequests: Array<ApprovalRequest>;
  /** Unread count for the current user. */
  myUnreadNotificationCount: Scalars['Int']['output'];
  opportunities: Array<Opportunity>;
  opportunity: Maybe<Opportunity>;
  organization: Maybe<Organization>;
  organizationDocuments: Array<Document>;
  organizations: Array<Organization>;
  outstandingVendorBills: Array<VendorBill>;
  payrollmanagement: Maybe<PayrollManagement>;
  payrollmanagements: Array<PayrollManagement>;
  payrolluirecord: Maybe<PayrollUiRecord>;
  payrolluirecords: Array<PayrollUiRecord>;
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
  qcInspection: Maybe<QcInspection>;
  qcInspections: Array<QcInspection>;
  qcOutcomeSummary: Array<QcOutcomeSummary>;
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
  siteLocation: Maybe<SiteLocation>;
  siteLocations: Array<SiteLocation>;
  stockMovement: Maybe<StockMovement>;
  stockMovements: Array<StockMovement>;
  stockadjustment: Maybe<StockAdjustment>;
  stockadjustments: Array<StockAdjustment>;
  stocktransfer: Maybe<StockTransfer>;
  stocktransfers: Array<StockTransfer>;
  systemRoles: Array<Role>;
  taxRate: Maybe<TaxRate>;
  taxRates: Array<TaxRate>;
  timesheetEntries: Array<TimesheetEntry>;
  timesheetEntry: Maybe<TimesheetEntry>;
  timesheetWeeklySummary: TimesheetWeeklySummary;
  upcomingMaintenance: Array<AssetMaintenance>;
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


export type QueryAllocationScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAllocationSchedulesArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryAssetMaintenanceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetMaintenancesArgs = {
  assetId: InputMaybe<Scalars['ID']['input']>;
  maintenanceType: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryAssetsArgs = {
  assetType: InputMaybe<Scalars['String']['input']>;
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


export type QueryAuditLogsArgs = {
  action: InputMaybe<Scalars['String']['input']>;
  entityId: InputMaybe<Scalars['ID']['input']>;
  entityType: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
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


export type QueryBillOfMaterialsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBillsOfMaterialsArgs = {
  organizationId: Scalars['ID']['input'];
  parentItemId: InputMaybe<Scalars['ID']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBudgetsArgs = {
  fiscalYear: InputMaybe<Scalars['String']['input']>;
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


export type QueryContractorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContractorsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCurrencyRevaluationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCurrencyRevaluationsArgs = {
  organizationId: Scalars['String']['input'];
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


export type QueryDeliveryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliveryOrdersArgs = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  organizationId: Scalars['ID']['input'];
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryDeliverychallanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliverychallansArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDocumentsArgs = {
  parentId: Scalars['ID']['input'];
  parentModule: Scalars['String']['input'];
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


export type QueryEmployeeMasterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmployeeMastersArgs = {
  department: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
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


export type QueryFixedAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFixedAssetSummaryByCategoryArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryFixedAssetsArgs = {
  category: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
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


export type QueryGlobalSearchArgs = {
  limitPerKind: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
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


export type QueryHrMasterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHrMastersArgs = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  kind: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
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


export type QueryIntercompanyAllocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIntercompanyAllocationsArgs = {
  organizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryIntercompanyJournalEntriesArgs = {
  allocationId: InputMaybe<Scalars['ID']['input']>;
  originatingOrganizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryIntercompanyJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIntercompanyTransferArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIntercompanyTransfersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
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


export type QueryJournalEntriesArgs = {
  organizationId: Scalars['String']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeadsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
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


export type QueryModuleWorkspaceRecordsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  routePath: Scalars['String']['input'];
};


export type QueryMyApprovalRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<ApprovalRequestRole>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<ApprovalRequestStatus>;
};


export type QueryMyNotificationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  skip: InputMaybe<Scalars['Int']['input']>;
  unreadOnly: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryOpportunitiesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  stage: InputMaybe<Scalars['String']['input']>;
};


export type QueryOpportunityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationDocumentsArgs = {
  organizationId: Scalars['ID']['input'];
  parentModule: InputMaybe<Scalars['String']['input']>;
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


export type QueryPayrolluirecordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPayrolluirecordsArgs = {
  category: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
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


export type QueryQcInspectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQcInspectionsArgs = {
  organizationId: Scalars['ID']['input'];
  outcome: InputMaybe<Scalars['String']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  sourceModule: InputMaybe<Scalars['String']['input']>;
};


export type QueryQcOutcomeSummaryArgs = {
  organizationId: Scalars['ID']['input'];
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


export type QuerySiteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySiteLocationsArgs = {
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


export type QueryTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaxRatesArgs = {
  appliesTo: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryTimesheetEntriesArgs = {
  billable: InputMaybe<Scalars['Boolean']['input']>;
  employeeUserId: InputMaybe<Scalars['ID']['input']>;
  endDate: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  projectId: InputMaybe<Scalars['ID']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryTimesheetEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTimesheetWeeklySummaryArgs = {
  employeeUserId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  weekEnd: Scalars['String']['input'];
  weekStart: Scalars['String']['input'];
};


export type QueryUpcomingMaintenanceArgs = {
  days: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
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

/** Unified workflow state stored on approvable ERP records (extend per module). */
export enum RecordApprovalWorkflowStatus {
  Approved = 'APPROVED',
  Draft = 'DRAFT',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED'
}

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
  approvalRequestedAt: Maybe<Scalars['String']['output']>;
  /** Org approval workflow (Draft → Pending → Approved/Rejected). Derived for legacy rows. */
  approvalStatus: RecordApprovalWorkflowStatus;
  approvedAt: Maybe<Scalars['String']['output']>;
  approvedBy: Maybe<Scalars['ID']['output']>;
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

export type SearchHit = {
  __typename?: 'SearchHit';
  id: Scalars['ID']['output'];
  kind: Scalars['String']['output'];
  link: Scalars['String']['output'];
  matchedField: Maybe<Scalars['String']['output']>;
  subtitle: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

/** Audience for a manual sendNotification call. Exactly one field should be set. */
export type SendNotificationAudienceInput = {
  /** Send to every active ORG_ADMIN across all organizations (super admin only). */
  allOrgAdmins: InputMaybe<Scalars['Boolean']['input']>;
  /** Send to every active user in the given organization (org admin: own org only). */
  allUsersInOrganizationId: InputMaybe<Scalars['ID']['input']>;
  /** Send to one or more specific user IDs. */
  userIds: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type SendNotificationInput = {
  audience: SendNotificationAudienceInput;
  kind: NotificationKind;
  link: InputMaybe<Scalars['String']['input']>;
  message: InputMaybe<Scalars['String']['input']>;
  severity: InputMaybe<NotificationSeverity>;
  title: Scalars['String']['input'];
};

export type SendQuotationResult = {
  __typename?: 'SendQuotationResult';
  emailSent: Scalars['Boolean']['output'];
  quotation: Quotation;
};

export type SiteLocation = {
  __typename?: 'SiteLocation';
  address: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  contactPerson: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  zipCode: Maybe<Scalars['String']['output']>;
};

export type SiteLocationInput = {
  address: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  zipCode: InputMaybe<Scalars['String']['input']>;
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

export type Task = {
  __typename?: 'Task';
  assignedTo: Maybe<Scalars['ID']['output']>;
  completedAt: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  dueDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['String']['output'];
  startDate: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type TaskInput = {
  assignedTo: InputMaybe<Scalars['ID']['input']>;
  completedAt: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  dueDate: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  priority: InputMaybe<Scalars['String']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type TaxRate = {
  __typename?: 'TaxRate';
  appliesTo: Scalars['String']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  effectiveFrom: Maybe<Scalars['String']['output']>;
  effectiveTo: Maybe<Scalars['String']['output']>;
  hsnSacCode: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isCompound: Scalars['Boolean']['output'];
  isInclusive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  ratePercent: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  taxType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TimesheetEntry = {
  __typename?: 'TimesheetEntry';
  approvedAt: Maybe<Scalars['String']['output']>;
  approvedByUserId: Maybe<Scalars['ID']['output']>;
  billRate: Scalars['Float']['output'];
  billable: Scalars['Boolean']['output'];
  costRate: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  employeeUserId: Scalars['ID']['output'];
  entryDate: Scalars['String']['output'];
  hours: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  projectId: Maybe<Scalars['ID']['output']>;
  rejectionReason: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  submittedAt: Maybe<Scalars['String']['output']>;
  taskName: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  workOrderId: Maybe<Scalars['ID']['output']>;
};

export type TimesheetWeeklySummary = {
  __typename?: 'TimesheetWeeklySummary';
  approvedHours: Scalars['Float']['output'];
  billableHours: Scalars['Float']['output'];
  draft: Scalars['Float']['output'];
  pending: Scalars['Float']['output'];
  totalHours: Scalars['Float']['output'];
};

export type UpdateAssetMaintenanceInput = {
  actionsTaken: InputMaybe<Scalars['String']['input']>;
  assetId: InputMaybe<Scalars['ID']['input']>;
  assignedToName: InputMaybe<Scalars['String']['input']>;
  assignedToUserId: InputMaybe<Scalars['ID']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  docNumber: InputMaybe<Scalars['String']['input']>;
  findings: InputMaybe<Scalars['String']['input']>;
  intervalDays: InputMaybe<Scalars['Int']['input']>;
  laborHours: InputMaybe<Scalars['Float']['input']>;
  laborRate: InputMaybe<Scalars['Float']['input']>;
  maintenanceType: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  partsUsed: InputMaybe<Array<MaintenancePartInput>>;
  priority: InputMaybe<Scalars['String']['input']>;
  scheduledDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateAttendanceInput = {
  checkIn: InputMaybe<Scalars['String']['input']>;
  checkOut: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBomInput = {
  bomCode: InputMaybe<Scalars['String']['input']>;
  components: InputMaybe<Array<BomComponentInput>>;
  description: InputMaybe<Scalars['String']['input']>;
  laborCost: InputMaybe<Scalars['Float']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  overheadCost: InputMaybe<Scalars['Float']['input']>;
  parentItemId: InputMaybe<Scalars['ID']['input']>;
  parentItemName: InputMaybe<Scalars['String']['input']>;
  quantityProduced: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
  version: InputMaybe<Scalars['String']['input']>;
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

export type UpdateDeliveryOrderInput = {
  carrier: InputMaybe<Scalars['String']['input']>;
  customerId: InputMaybe<Scalars['ID']['input']>;
  customerName: InputMaybe<Scalars['String']['input']>;
  deliveryDate: InputMaybe<Scalars['String']['input']>;
  docNumber: InputMaybe<Scalars['String']['input']>;
  driverName: InputMaybe<Scalars['String']['input']>;
  driverPhone: InputMaybe<Scalars['String']['input']>;
  expectedArrival: InputMaybe<Scalars['String']['input']>;
  items: InputMaybe<Array<DeliveryItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
  shippingAddress: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  trackingNumber: InputMaybe<Scalars['String']['input']>;
  vehicleNumber: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeMasterInput = {
  aadhaarNumber: InputMaybe<Scalars['String']['input']>;
  address: InputMaybe<Scalars['String']['input']>;
  alternatePhone: InputMaybe<Scalars['String']['input']>;
  bankDetails: InputMaybe<EmployeeBankInput>;
  basicSalary: InputMaybe<Scalars['Float']['input']>;
  bloodGroup: InputMaybe<Scalars['String']['input']>;
  city: InputMaybe<Scalars['String']['input']>;
  country: InputMaybe<Scalars['String']['input']>;
  currency: InputMaybe<Scalars['String']['input']>;
  dateOfBirth: InputMaybe<Scalars['String']['input']>;
  dateOfConfirmation: InputMaybe<Scalars['String']['input']>;
  dateOfJoining: InputMaybe<Scalars['String']['input']>;
  dateOfRelieving: InputMaybe<Scalars['String']['input']>;
  department: InputMaybe<Scalars['String']['input']>;
  designation: InputMaybe<Scalars['String']['input']>;
  emergencyContact: InputMaybe<EmployeeEmergencyContactInput>;
  employeeCode: InputMaybe<Scalars['String']['input']>;
  employmentType: InputMaybe<Scalars['String']['input']>;
  esiNumber: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  gender: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  maritalStatus: InputMaybe<Scalars['String']['input']>;
  nationality: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  panNumber: InputMaybe<Scalars['String']['input']>;
  personalEmail: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  pincode: InputMaybe<Scalars['String']['input']>;
  reportsToUserId: InputMaybe<Scalars['ID']['input']>;
  shiftMasterId: InputMaybe<Scalars['ID']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  uanNumber: InputMaybe<Scalars['String']['input']>;
  workEmail: InputMaybe<Scalars['String']['input']>;
  workLocation: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFixedAssetInput = {
  acquisitionCost: InputMaybe<Scalars['Float']['input']>;
  assetCode: InputMaybe<Scalars['String']['input']>;
  assignedToUserId: InputMaybe<Scalars['ID']['input']>;
  barcode: InputMaybe<Scalars['String']['input']>;
  category: InputMaybe<Scalars['String']['input']>;
  commissionedDate: InputMaybe<Scalars['String']['input']>;
  depreciationMethod: InputMaybe<Scalars['String']['input']>;
  depreciationRatePercent: InputMaybe<Scalars['Float']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  purchaseDate: InputMaybe<Scalars['String']['input']>;
  salvageValue: InputMaybe<Scalars['Float']['input']>;
  serialNumber: InputMaybe<Scalars['String']['input']>;
  siteLocationId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  usefulLifeMonths: InputMaybe<Scalars['Int']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
  warrantyExpiryDate: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGrnInput = {
  notes: InputMaybe<Scalars['String']['input']>;
  receivedDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateHrMasterInput = {
  active: InputMaybe<Scalars['Boolean']['input']>;
  code: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  metadataJson: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  sortOrder: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateIntercompanyAllocationInput = {
  allocationMethod: InputMaybe<Scalars['String']['input']>;
  basisAmount: InputMaybe<Scalars['Float']['input']>;
  basisDate: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  lines: InputMaybe<Array<AllocationLineInput>>;
  name: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  scheduleCode: InputMaybe<Scalars['String']['input']>;
  sourceAccount: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIntercompanyJournalInput = {
  allocationId: InputMaybe<Scalars['ID']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  docNumber: InputMaybe<Scalars['String']['input']>;
  entryDate: InputMaybe<Scalars['String']['input']>;
  lines: InputMaybe<Array<IntercompanyJournalLineInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIntercompanyTransferInput = {
  fromOrganizationId: InputMaybe<Scalars['ID']['input']>;
  fromOrganizationName: InputMaybe<Scalars['String']['input']>;
  lineItems: InputMaybe<Array<IctLineItemInput>>;
  notes: InputMaybe<Scalars['String']['input']>;
  toOrganizationId: InputMaybe<Scalars['ID']['input']>;
  toOrganizationName: InputMaybe<Scalars['String']['input']>;
  transferDate: InputMaybe<Scalars['String']['input']>;
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

export type UpdateQcInspectionInput = {
  batchNumber: InputMaybe<Scalars['String']['input']>;
  defects: InputMaybe<Array<QcDefectInput>>;
  docNumber: InputMaybe<Scalars['String']['input']>;
  inspectionDate: InputMaybe<Scalars['String']['input']>;
  inspectorName: InputMaybe<Scalars['String']['input']>;
  inspectorUserId: InputMaybe<Scalars['ID']['input']>;
  itemId: InputMaybe<Scalars['ID']['input']>;
  itemName: InputMaybe<Scalars['String']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  outcome: InputMaybe<Scalars['String']['input']>;
  quantityFailed: InputMaybe<Scalars['Float']['input']>;
  quantityInspected: InputMaybe<Scalars['Float']['input']>;
  quantityPassed: InputMaybe<Scalars['Float']['input']>;
  quantityReworked: InputMaybe<Scalars['Float']['input']>;
  sourceId: InputMaybe<Scalars['ID']['input']>;
  sourceModule: InputMaybe<Scalars['String']['input']>;
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

export type UpdateTaxRateInput = {
  appliesTo: InputMaybe<Scalars['String']['input']>;
  code: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  effectiveFrom: InputMaybe<Scalars['String']['input']>;
  effectiveTo: InputMaybe<Scalars['String']['input']>;
  hsnSacCode: InputMaybe<Scalars['String']['input']>;
  isCompound: InputMaybe<Scalars['Boolean']['input']>;
  isInclusive: InputMaybe<Scalars['Boolean']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  ratePercent: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  taxType: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTimesheetEntryInput = {
  billRate: InputMaybe<Scalars['Float']['input']>;
  billable: InputMaybe<Scalars['Boolean']['input']>;
  costRate: InputMaybe<Scalars['Float']['input']>;
  entryDate: InputMaybe<Scalars['String']['input']>;
  hours: InputMaybe<Scalars['Float']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  taskName: InputMaybe<Scalars['String']['input']>;
  workOrderId: InputMaybe<Scalars['ID']['input']>;
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
  dashboardPreferences: Maybe<DashboardPreferences>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  modulePermissions: Maybe<Array<ModulePermission>>;
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
  /** draft | submitted | approval_declined | approved — omitted on legacy rows means approved */
  orgApprovalStatus: Scalars['String']['output'];
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
  /** Defaults to true when omitted. */
  isAvailable: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['String']['input'];
  warehouseId: Scalars['String']['input'];
};

export type WarehouseInput = {
  address: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  contactNumber: Scalars['String']['input'];
  /** Stored utilization / occupancy level for reporting. */
  currentUtilization: InputMaybe<Scalars['Float']['input']>;
  /** Defaults to true on create when omitted. */
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  location: Scalars['String']['input'];
  managerName: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  /** Omitted or blank values receive the next auto-generated code for the organization (e.g. WH0001). */
  warehouseCode: InputMaybe<Scalars['String']['input']>;
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
  AllocationLine: ResolverTypeWrapper<Partial<AllocationLine>>;
  AllocationLineInput: ResolverTypeWrapper<Partial<AllocationLineInput>>;
  AllocationSchedule: ResolverTypeWrapper<Partial<AllocationSchedule>>;
  AllocationScheduleInput: ResolverTypeWrapper<Partial<AllocationScheduleInput>>;
  Applicant: ResolverTypeWrapper<Partial<Applicant>>;
  ApplicantInput: ResolverTypeWrapper<Partial<ApplicantInput>>;
  ApprovalDecision: ResolverTypeWrapper<Partial<ApprovalDecision>>;
  ApprovalRequest: ResolverTypeWrapper<Partial<ApprovalRequest>>;
  ApprovalRequestRole: ResolverTypeWrapper<Partial<ApprovalRequestRole>>;
  ApprovalRequestStatus: ResolverTypeWrapper<Partial<ApprovalRequestStatus>>;
  Asset: ResolverTypeWrapper<Partial<Asset>>;
  AssetInput: ResolverTypeWrapper<Partial<AssetInput>>;
  AssetMaintenance: ResolverTypeWrapper<Partial<AssetMaintenance>>;
  Attendance: ResolverTypeWrapper<Partial<Attendance>>;
  AuditLog: ResolverTypeWrapper<Partial<AuditLog>>;
  AuditLogPage: ResolverTypeWrapper<Partial<AuditLogPage>>;
  AuthPayload: ResolverTypeWrapper<Partial<AuthPayload>>;
  BOMComponent: ResolverTypeWrapper<Partial<BomComponent>>;
  BOMComponentInput: ResolverTypeWrapper<Partial<BomComponentInput>>;
  BankAccount: ResolverTypeWrapper<Partial<BankAccount>>;
  BankAccountInput: ResolverTypeWrapper<Partial<BankAccountInput>>;
  BankStatementLine: ResolverTypeWrapper<Partial<BankStatementLine>>;
  BankStatementLineInput: ResolverTypeWrapper<Partial<BankStatementLineInput>>;
  BankTransferInput: ResolverTypeWrapper<Partial<BankTransferInput>>;
  BankTransferResult: ResolverTypeWrapper<Partial<BankTransferResult>>;
  BillOfMaterials: ResolverTypeWrapper<Partial<BillOfMaterials>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Budget: ResolverTypeWrapper<Partial<Budget>>;
  BudgetInput: ResolverTypeWrapper<Partial<BudgetInput>>;
  BudgetLine: ResolverTypeWrapper<Partial<BudgetLine>>;
  BudgetLineInput: ResolverTypeWrapper<Partial<BudgetLineInput>>;
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
  CompleteMaintenanceInput: ResolverTypeWrapper<Partial<CompleteMaintenanceInput>>;
  Contractor: ResolverTypeWrapper<Partial<Contractor>>;
  ContractorInput: ResolverTypeWrapper<Partial<ContractorInput>>;
  CreateAssetMaintenanceInput: ResolverTypeWrapper<Partial<CreateAssetMaintenanceInput>>;
  CreateAttendanceInput: ResolverTypeWrapper<Partial<CreateAttendanceInput>>;
  CreateBOMInput: ResolverTypeWrapper<Partial<CreateBomInput>>;
  CreateClientInput: ResolverTypeWrapper<Partial<CreateClientInput>>;
  CreateCustomerDepositInput: ResolverTypeWrapper<Partial<CreateCustomerDepositInput>>;
  CreateCustomerInput: ResolverTypeWrapper<Partial<CreateCustomerInput>>;
  CreateCustomerInvoiceInput: ResolverTypeWrapper<Partial<CreateCustomerInvoiceInput>>;
  CreateCustomerPaymentInput: ResolverTypeWrapper<Partial<CreateCustomerPaymentInput>>;
  CreateCustomerRefundInput: ResolverTypeWrapper<Partial<CreateCustomerRefundInput>>;
  CreateDeliveryOrderInput: ResolverTypeWrapper<Partial<CreateDeliveryOrderInput>>;
  CreateEmployeeMasterInput: ResolverTypeWrapper<Partial<CreateEmployeeMasterInput>>;
  CreateFixedAssetInput: ResolverTypeWrapper<Partial<CreateFixedAssetInput>>;
  CreateGRNInput: ResolverTypeWrapper<Partial<CreateGrnInput>>;
  CreateHrMasterInput: ResolverTypeWrapper<Partial<CreateHrMasterInput>>;
  CreateIntercompanyAllocationInput: ResolverTypeWrapper<Partial<CreateIntercompanyAllocationInput>>;
  CreateIntercompanyJournalInput: ResolverTypeWrapper<Partial<CreateIntercompanyJournalInput>>;
  CreateIntercompanyTransferInput: ResolverTypeWrapper<Partial<CreateIntercompanyTransferInput>>;
  CreateItemInput: ResolverTypeWrapper<Partial<CreateItemInput>>;
  CreateLeaveApplicationInput: ResolverTypeWrapper<Partial<CreateLeaveApplicationInput>>;
  CreateLeaveEnrollmentInput: ResolverTypeWrapper<Partial<CreateLeaveEnrollmentInput>>;
  CreateLeaveReinstatementInput: ResolverTypeWrapper<Partial<CreateLeaveReinstatementInput>>;
  CreateLeaveTypeInput: ResolverTypeWrapper<Partial<CreateLeaveTypeInput>>;
  CreateMaterialReceiptInput: ResolverTypeWrapper<Partial<CreateMaterialReceiptInput>>;
  CreateModuleWorkspaceRecordInput: ResolverTypeWrapper<Partial<CreateModuleWorkspaceRecordInput>>;
  CreateOrgAdminUserInput: ResolverTypeWrapper<Partial<CreateOrgAdminUserInput>>;
  CreateOrganizationInput: ResolverTypeWrapper<Partial<CreateOrganizationInput>>;
  CreateOrganizationWithOrgAdminInput: ResolverTypeWrapper<Partial<CreateOrganizationWithOrgAdminInput>>;
  CreateProductInput: ResolverTypeWrapper<Partial<CreateProductInput>>;
  CreateProjectInput: ResolverTypeWrapper<Partial<CreateProjectInput>>;
  CreatePurchaseOrderInput: ResolverTypeWrapper<Partial<CreatePurchaseOrderInput>>;
  CreateQCInspectionInput: ResolverTypeWrapper<Partial<CreateQcInspectionInput>>;
  CreateQuotationInput: ResolverTypeWrapper<Partial<CreateQuotationInput>>;
  CreateReturnAuthorizationInput: ResolverTypeWrapper<Partial<CreateReturnAuthorizationInput>>;
  CreateRoleInput: ResolverTypeWrapper<Partial<CreateRoleInput>>;
  CreateSalesEnquiryInput: ResolverTypeWrapper<Partial<CreateSalesEnquiryInput>>;
  CreateSalesOrderInput: ResolverTypeWrapper<Partial<CreateSalesOrderInput>>;
  CreateSalesQuotationInput: ResolverTypeWrapper<Partial<CreateSalesQuotationInput>>;
  CreateStockAdjustmentInput: ResolverTypeWrapper<Partial<CreateStockAdjustmentInput>>;
  CreateStockTransferInput: ResolverTypeWrapper<Partial<CreateStockTransferInput>>;
  CreateTaxRateInput: ResolverTypeWrapper<Partial<CreateTaxRateInput>>;
  CreateTimesheetEntryInput: ResolverTypeWrapper<Partial<CreateTimesheetEntryInput>>;
  CreateUserInput: ResolverTypeWrapper<Partial<CreateUserInput>>;
  CreateVendorBillInput: ResolverTypeWrapper<Partial<CreateVendorBillInput>>;
  CreateVendorCreditInput: ResolverTypeWrapper<Partial<CreateVendorCreditInput>>;
  CreateVendorInput: ResolverTypeWrapper<Partial<CreateVendorInput>>;
  CreateVendorPaymentInput: ResolverTypeWrapper<Partial<CreateVendorPaymentInput>>;
  CreateVendorPrepaymentInput: ResolverTypeWrapper<Partial<CreateVendorPrepaymentInput>>;
  CurrencyRevaluation: ResolverTypeWrapper<Partial<CurrencyRevaluation>>;
  CurrencyRevaluationInput: ResolverTypeWrapper<Partial<CurrencyRevaluationInput>>;
  CurrencyRevaluationLine: ResolverTypeWrapper<Partial<CurrencyRevaluationLine>>;
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
  DashboardPreferences: ResolverTypeWrapper<Partial<DashboardPreferences>>;
  DashboardWidgetPreferences: ResolverTypeWrapper<Partial<DashboardWidgetPreferences>>;
  DashboardWidgetPreferencesInput: ResolverTypeWrapper<Partial<DashboardWidgetPreferencesInput>>;
  DeliveryChallan: ResolverTypeWrapper<Partial<DeliveryChallan>>;
  DeliveryChallanInput: ResolverTypeWrapper<Partial<DeliveryChallanInput>>;
  DeliveryItem: ResolverTypeWrapper<Partial<DeliveryItem>>;
  DeliveryItemInput: ResolverTypeWrapper<Partial<DeliveryItemInput>>;
  DeliveryOrder: ResolverTypeWrapper<Partial<DeliveryOrder>>;
  DepreciationEntry: ResolverTypeWrapper<Partial<DepreciationEntry>>;
  Document: ResolverTypeWrapper<Partial<Document>>;
  DraftFinanceChargeAssessmentInput: ResolverTypeWrapper<Partial<DraftFinanceChargeAssessmentInput>>;
  EPM: ResolverTypeWrapper<Partial<Epm>>;
  EPMInput: ResolverTypeWrapper<Partial<EpmInput>>;
  Education: ResolverTypeWrapper<Partial<Education>>;
  EducationInput: ResolverTypeWrapper<Partial<EducationInput>>;
  EmployeeBank: ResolverTypeWrapper<Partial<EmployeeBank>>;
  EmployeeBankInput: ResolverTypeWrapper<Partial<EmployeeBankInput>>;
  EmployeeEmergencyContact: ResolverTypeWrapper<Partial<EmployeeEmergencyContact>>;
  EmployeeEmergencyContactInput: ResolverTypeWrapper<Partial<EmployeeEmergencyContactInput>>;
  EmployeeMaster: ResolverTypeWrapper<Partial<EmployeeMaster>>;
  ExciseInvoice: ResolverTypeWrapper<Partial<ExciseInvoice>>;
  ExciseInvoiceInput: ResolverTypeWrapper<Partial<ExciseInvoiceInput>>;
  Experience: ResolverTypeWrapper<Partial<Experience>>;
  ExperienceInput: ResolverTypeWrapper<Partial<ExperienceInput>>;
  Extraction: ResolverTypeWrapper<Partial<Extraction>>;
  ExtractionInput: ResolverTypeWrapper<Partial<ExtractionInput>>;
  FinanceChargeAssessment: ResolverTypeWrapper<Partial<FinanceChargeAssessment>>;
  FinanceChargeLine: ResolverTypeWrapper<Partial<FinanceChargeLine>>;
  FixedAsset: ResolverTypeWrapper<Partial<FixedAsset>>;
  FixedAssetCategorySummary: ResolverTypeWrapper<Partial<FixedAssetCategorySummary>>;
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
  HrMaster: ResolverTypeWrapper<Partial<HrMaster>>;
  ICTLineItem: ResolverTypeWrapper<Partial<IctLineItem>>;
  ICTLineItemInput: ResolverTypeWrapper<Partial<IctLineItemInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  IPInspection: ResolverTypeWrapper<Partial<IpInspection>>;
  IPInspectionInput: ResolverTypeWrapper<Partial<IpInspectionInput>>;
  IndividualPriceList: ResolverTypeWrapper<Partial<IndividualPriceList>>;
  IndividualPriceListLine: ResolverTypeWrapper<Partial<IndividualPriceListLine>>;
  IndividualPriceListLineInput: ResolverTypeWrapper<Partial<IndividualPriceListLineInput>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  IntercompanyAllocation: ResolverTypeWrapper<Partial<IntercompanyAllocation>>;
  IntercompanyJournalEntry: ResolverTypeWrapper<Partial<IntercompanyJournalEntry>>;
  IntercompanyJournalLine: ResolverTypeWrapper<Partial<IntercompanyJournalLine>>;
  IntercompanyJournalLineInput: ResolverTypeWrapper<Partial<IntercompanyJournalLineInput>>;
  IntercompanyTransfer: ResolverTypeWrapper<Partial<IntercompanyTransfer>>;
  InternalOrder: ResolverTypeWrapper<Partial<InternalOrder>>;
  InternalOrderInput: ResolverTypeWrapper<Partial<InternalOrderInput>>;
  InventoryControl: ResolverTypeWrapper<Partial<InventoryControl>>;
  InventoryControlInput: ResolverTypeWrapper<Partial<InventoryControlInput>>;
  InventoryReturn: ResolverTypeWrapper<Partial<InventoryReturn>>;
  InventoryReturnInput: ResolverTypeWrapper<Partial<InventoryReturnInput>>;
  Item: ResolverTypeWrapper<Partial<Item>>;
  JournalEntry: ResolverTypeWrapper<Partial<JournalEntry>>;
  JournalEntryInput: ResolverTypeWrapper<Partial<JournalEntryInput>>;
  JournalEntryLine: ResolverTypeWrapper<Partial<JournalEntryLine>>;
  JournalEntryLineInput: ResolverTypeWrapper<Partial<JournalEntryLineInput>>;
  Lead: ResolverTypeWrapper<Partial<Lead>>;
  LeadInput: ResolverTypeWrapper<Partial<LeadInput>>;
  LeaveApplication: ResolverTypeWrapper<Partial<LeaveApplication>>;
  LeaveEnrollment: ResolverTypeWrapper<Partial<LeaveEnrollment>>;
  LeaveReinstatement: ResolverTypeWrapper<Partial<LeaveReinstatement>>;
  LeaveType: ResolverTypeWrapper<Partial<LeaveType>>;
  LoanRepayment: ResolverTypeWrapper<Partial<LoanRepayment>>;
  LoanRepaymentInput: ResolverTypeWrapper<Partial<LoanRepaymentInput>>;
  LoginInput: ResolverTypeWrapper<Partial<LoginInput>>;
  MRNLineItem: ResolverTypeWrapper<Partial<MrnLineItem>>;
  MRNLineItemInput: ResolverTypeWrapper<Partial<MrnLineItemInput>>;
  MaintenancePart: ResolverTypeWrapper<Partial<MaintenancePart>>;
  MaintenancePartInput: ResolverTypeWrapper<Partial<MaintenancePartInput>>;
  MaterialReceipt: ResolverTypeWrapper<Partial<MaterialReceipt>>;
  Milestone: ResolverTypeWrapper<Partial<Milestone>>;
  MilestoneInput: ResolverTypeWrapper<Partial<MilestoneInput>>;
  ModulePermission: ResolverTypeWrapper<Partial<ModulePermission>>;
  ModulePermissionInput: ResolverTypeWrapper<Partial<ModulePermissionInput>>;
  ModuleWorkspaceRecord: ResolverTypeWrapper<Partial<ModuleWorkspaceRecord>>;
  ModuleWorkspaceStatus: ResolverTypeWrapper<Partial<ModuleWorkspaceStatus>>;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<Partial<Notification>>;
  NotificationKind: ResolverTypeWrapper<Partial<NotificationKind>>;
  NotificationSeverity: ResolverTypeWrapper<Partial<NotificationSeverity>>;
  Opportunity: ResolverTypeWrapper<Partial<Opportunity>>;
  OpportunityInput: ResolverTypeWrapper<Partial<OpportunityInput>>;
  Organization: ResolverTypeWrapper<Partial<Organization>>;
  OrganizationModuleApprover: ResolverTypeWrapper<Partial<OrganizationModuleApprover>>;
  OrganizationModuleApproverInput: ResolverTypeWrapper<Partial<OrganizationModuleApproverInput>>;
  POLineItem: ResolverTypeWrapper<Partial<PoLineItem>>;
  POLineItemInput: ResolverTypeWrapper<Partial<PoLineItemInput>>;
  PayrollManagement: ResolverTypeWrapper<Partial<PayrollManagement>>;
  PayrollManagementInput: ResolverTypeWrapper<Partial<PayrollManagementInput>>;
  PayrollUiRecord: ResolverTypeWrapper<Partial<PayrollUiRecord>>;
  PayrollUiRecordInput: ResolverTypeWrapper<Partial<PayrollUiRecordInput>>;
  Permission: ResolverTypeWrapper<Partial<Permission>>;
  PermissionInput: ResolverTypeWrapper<Partial<PermissionInput>>;
  PostDepreciationInput: ResolverTypeWrapper<Partial<PostDepreciationInput>>;
  PriceList: ResolverTypeWrapper<Partial<PriceList>>;
  PriceListLine: ResolverTypeWrapper<Partial<PriceListLine>>;
  Product: ResolverTypeWrapper<Partial<Product>>;
  ProductionPlanning: ResolverTypeWrapper<Partial<ProductionPlanning>>;
  ProductionPlanningInput: ResolverTypeWrapper<Partial<ProductionPlanningInput>>;
  Project: ResolverTypeWrapper<Partial<Project>>;
  PurchaseOrder: ResolverTypeWrapper<Partial<PurchaseOrder>>;
  QCDefect: ResolverTypeWrapper<Partial<QcDefect>>;
  QCDefectInput: ResolverTypeWrapper<Partial<QcDefectInput>>;
  QCInspection: ResolverTypeWrapper<Partial<QcInspection>>;
  QCOutcomeSummary: ResolverTypeWrapper<Partial<QcOutcomeSummary>>;
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
  RecordApprovalWorkflowStatus: ResolverTypeWrapper<Partial<RecordApprovalWorkflowStatus>>;
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
  SearchHit: ResolverTypeWrapper<Partial<SearchHit>>;
  SendNotificationAudienceInput: ResolverTypeWrapper<Partial<SendNotificationAudienceInput>>;
  SendNotificationInput: ResolverTypeWrapper<Partial<SendNotificationInput>>;
  SendQuotationResult: ResolverTypeWrapper<Partial<SendQuotationResult>>;
  SiteLocation: ResolverTypeWrapper<Partial<SiteLocation>>;
  SiteLocationInput: ResolverTypeWrapper<Partial<SiteLocationInput>>;
  StockAdjustment: ResolverTypeWrapper<Partial<StockAdjustment>>;
  StockMovement: ResolverTypeWrapper<Partial<StockMovement>>;
  StockMovementInput: ResolverTypeWrapper<Partial<StockMovementInput>>;
  StockTransfer: ResolverTypeWrapper<Partial<StockTransfer>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  Task: ResolverTypeWrapper<Partial<Task>>;
  TaskInput: ResolverTypeWrapper<Partial<TaskInput>>;
  TaxRate: ResolverTypeWrapper<Partial<TaxRate>>;
  TimesheetEntry: ResolverTypeWrapper<Partial<TimesheetEntry>>;
  TimesheetWeeklySummary: ResolverTypeWrapper<Partial<TimesheetWeeklySummary>>;
  UpdateAssetMaintenanceInput: ResolverTypeWrapper<Partial<UpdateAssetMaintenanceInput>>;
  UpdateAttendanceInput: ResolverTypeWrapper<Partial<UpdateAttendanceInput>>;
  UpdateBOMInput: ResolverTypeWrapper<Partial<UpdateBomInput>>;
  UpdateClientInput: ResolverTypeWrapper<Partial<UpdateClientInput>>;
  UpdateCustomerInput: ResolverTypeWrapper<Partial<UpdateCustomerInput>>;
  UpdateCustomerInvoiceInput: ResolverTypeWrapper<Partial<UpdateCustomerInvoiceInput>>;
  UpdateCustomerPaymentInput: ResolverTypeWrapper<Partial<UpdateCustomerPaymentInput>>;
  UpdateDeliveryOrderInput: ResolverTypeWrapper<Partial<UpdateDeliveryOrderInput>>;
  UpdateEmployeeMasterInput: ResolverTypeWrapper<Partial<UpdateEmployeeMasterInput>>;
  UpdateFixedAssetInput: ResolverTypeWrapper<Partial<UpdateFixedAssetInput>>;
  UpdateGRNInput: ResolverTypeWrapper<Partial<UpdateGrnInput>>;
  UpdateHrMasterInput: ResolverTypeWrapper<Partial<UpdateHrMasterInput>>;
  UpdateIntercompanyAllocationInput: ResolverTypeWrapper<Partial<UpdateIntercompanyAllocationInput>>;
  UpdateIntercompanyJournalInput: ResolverTypeWrapper<Partial<UpdateIntercompanyJournalInput>>;
  UpdateIntercompanyTransferInput: ResolverTypeWrapper<Partial<UpdateIntercompanyTransferInput>>;
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
  UpdateQCInspectionInput: ResolverTypeWrapper<Partial<UpdateQcInspectionInput>>;
  UpdateQuotationInput: ResolverTypeWrapper<Partial<UpdateQuotationInput>>;
  UpdateRoleInput: ResolverTypeWrapper<Partial<UpdateRoleInput>>;
  UpdateSalesEnquiryInput: ResolverTypeWrapper<Partial<UpdateSalesEnquiryInput>>;
  UpdateSalesOrderInput: ResolverTypeWrapper<Partial<UpdateSalesOrderInput>>;
  UpdateSalesQuotationInput: ResolverTypeWrapper<Partial<UpdateSalesQuotationInput>>;
  UpdateStockAdjustmentInput: ResolverTypeWrapper<Partial<UpdateStockAdjustmentInput>>;
  UpdateStockTransferInput: ResolverTypeWrapper<Partial<UpdateStockTransferInput>>;
  UpdateTaxRateInput: ResolverTypeWrapper<Partial<UpdateTaxRateInput>>;
  UpdateTimesheetEntryInput: ResolverTypeWrapper<Partial<UpdateTimesheetEntryInput>>;
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
  AllocationLine: Partial<AllocationLine>;
  AllocationLineInput: Partial<AllocationLineInput>;
  AllocationSchedule: Partial<AllocationSchedule>;
  AllocationScheduleInput: Partial<AllocationScheduleInput>;
  Applicant: Partial<Applicant>;
  ApplicantInput: Partial<ApplicantInput>;
  ApprovalRequest: Partial<ApprovalRequest>;
  Asset: Partial<Asset>;
  AssetInput: Partial<AssetInput>;
  AssetMaintenance: Partial<AssetMaintenance>;
  Attendance: Partial<Attendance>;
  AuditLog: Partial<AuditLog>;
  AuditLogPage: Partial<AuditLogPage>;
  AuthPayload: Partial<AuthPayload>;
  BOMComponent: Partial<BomComponent>;
  BOMComponentInput: Partial<BomComponentInput>;
  BankAccount: Partial<BankAccount>;
  BankAccountInput: Partial<BankAccountInput>;
  BankStatementLine: Partial<BankStatementLine>;
  BankStatementLineInput: Partial<BankStatementLineInput>;
  BankTransferInput: Partial<BankTransferInput>;
  BankTransferResult: Partial<BankTransferResult>;
  BillOfMaterials: Partial<BillOfMaterials>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Budget: Partial<Budget>;
  BudgetInput: Partial<BudgetInput>;
  BudgetLine: Partial<BudgetLine>;
  BudgetLineInput: Partial<BudgetLineInput>;
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
  CompleteMaintenanceInput: Partial<CompleteMaintenanceInput>;
  Contractor: Partial<Contractor>;
  ContractorInput: Partial<ContractorInput>;
  CreateAssetMaintenanceInput: Partial<CreateAssetMaintenanceInput>;
  CreateAttendanceInput: Partial<CreateAttendanceInput>;
  CreateBOMInput: Partial<CreateBomInput>;
  CreateClientInput: Partial<CreateClientInput>;
  CreateCustomerDepositInput: Partial<CreateCustomerDepositInput>;
  CreateCustomerInput: Partial<CreateCustomerInput>;
  CreateCustomerInvoiceInput: Partial<CreateCustomerInvoiceInput>;
  CreateCustomerPaymentInput: Partial<CreateCustomerPaymentInput>;
  CreateCustomerRefundInput: Partial<CreateCustomerRefundInput>;
  CreateDeliveryOrderInput: Partial<CreateDeliveryOrderInput>;
  CreateEmployeeMasterInput: Partial<CreateEmployeeMasterInput>;
  CreateFixedAssetInput: Partial<CreateFixedAssetInput>;
  CreateGRNInput: Partial<CreateGrnInput>;
  CreateHrMasterInput: Partial<CreateHrMasterInput>;
  CreateIntercompanyAllocationInput: Partial<CreateIntercompanyAllocationInput>;
  CreateIntercompanyJournalInput: Partial<CreateIntercompanyJournalInput>;
  CreateIntercompanyTransferInput: Partial<CreateIntercompanyTransferInput>;
  CreateItemInput: Partial<CreateItemInput>;
  CreateLeaveApplicationInput: Partial<CreateLeaveApplicationInput>;
  CreateLeaveEnrollmentInput: Partial<CreateLeaveEnrollmentInput>;
  CreateLeaveReinstatementInput: Partial<CreateLeaveReinstatementInput>;
  CreateLeaveTypeInput: Partial<CreateLeaveTypeInput>;
  CreateMaterialReceiptInput: Partial<CreateMaterialReceiptInput>;
  CreateModuleWorkspaceRecordInput: Partial<CreateModuleWorkspaceRecordInput>;
  CreateOrgAdminUserInput: Partial<CreateOrgAdminUserInput>;
  CreateOrganizationInput: Partial<CreateOrganizationInput>;
  CreateOrganizationWithOrgAdminInput: Partial<CreateOrganizationWithOrgAdminInput>;
  CreateProductInput: Partial<CreateProductInput>;
  CreateProjectInput: Partial<CreateProjectInput>;
  CreatePurchaseOrderInput: Partial<CreatePurchaseOrderInput>;
  CreateQCInspectionInput: Partial<CreateQcInspectionInput>;
  CreateQuotationInput: Partial<CreateQuotationInput>;
  CreateReturnAuthorizationInput: Partial<CreateReturnAuthorizationInput>;
  CreateRoleInput: Partial<CreateRoleInput>;
  CreateSalesEnquiryInput: Partial<CreateSalesEnquiryInput>;
  CreateSalesOrderInput: Partial<CreateSalesOrderInput>;
  CreateSalesQuotationInput: Partial<CreateSalesQuotationInput>;
  CreateStockAdjustmentInput: Partial<CreateStockAdjustmentInput>;
  CreateStockTransferInput: Partial<CreateStockTransferInput>;
  CreateTaxRateInput: Partial<CreateTaxRateInput>;
  CreateTimesheetEntryInput: Partial<CreateTimesheetEntryInput>;
  CreateUserInput: Partial<CreateUserInput>;
  CreateVendorBillInput: Partial<CreateVendorBillInput>;
  CreateVendorCreditInput: Partial<CreateVendorCreditInput>;
  CreateVendorInput: Partial<CreateVendorInput>;
  CreateVendorPaymentInput: Partial<CreateVendorPaymentInput>;
  CreateVendorPrepaymentInput: Partial<CreateVendorPrepaymentInput>;
  CurrencyRevaluation: Partial<CurrencyRevaluation>;
  CurrencyRevaluationInput: Partial<CurrencyRevaluationInput>;
  CurrencyRevaluationLine: Partial<CurrencyRevaluationLine>;
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
  DashboardPreferences: Partial<DashboardPreferences>;
  DashboardWidgetPreferences: Partial<DashboardWidgetPreferences>;
  DashboardWidgetPreferencesInput: Partial<DashboardWidgetPreferencesInput>;
  DeliveryChallan: Partial<DeliveryChallan>;
  DeliveryChallanInput: Partial<DeliveryChallanInput>;
  DeliveryItem: Partial<DeliveryItem>;
  DeliveryItemInput: Partial<DeliveryItemInput>;
  DeliveryOrder: Partial<DeliveryOrder>;
  DepreciationEntry: Partial<DepreciationEntry>;
  Document: Partial<Document>;
  DraftFinanceChargeAssessmentInput: Partial<DraftFinanceChargeAssessmentInput>;
  EPM: Partial<Epm>;
  EPMInput: Partial<EpmInput>;
  Education: Partial<Education>;
  EducationInput: Partial<EducationInput>;
  EmployeeBank: Partial<EmployeeBank>;
  EmployeeBankInput: Partial<EmployeeBankInput>;
  EmployeeEmergencyContact: Partial<EmployeeEmergencyContact>;
  EmployeeEmergencyContactInput: Partial<EmployeeEmergencyContactInput>;
  EmployeeMaster: Partial<EmployeeMaster>;
  ExciseInvoice: Partial<ExciseInvoice>;
  ExciseInvoiceInput: Partial<ExciseInvoiceInput>;
  Experience: Partial<Experience>;
  ExperienceInput: Partial<ExperienceInput>;
  Extraction: Partial<Extraction>;
  ExtractionInput: Partial<ExtractionInput>;
  FinanceChargeAssessment: Partial<FinanceChargeAssessment>;
  FinanceChargeLine: Partial<FinanceChargeLine>;
  FixedAsset: Partial<FixedAsset>;
  FixedAssetCategorySummary: Partial<FixedAssetCategorySummary>;
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
  HrMaster: Partial<HrMaster>;
  ICTLineItem: Partial<IctLineItem>;
  ICTLineItemInput: Partial<IctLineItemInput>;
  ID: Partial<Scalars['ID']['output']>;
  IPInspection: Partial<IpInspection>;
  IPInspectionInput: Partial<IpInspectionInput>;
  IndividualPriceList: Partial<IndividualPriceList>;
  IndividualPriceListLine: Partial<IndividualPriceListLine>;
  IndividualPriceListLineInput: Partial<IndividualPriceListLineInput>;
  Int: Partial<Scalars['Int']['output']>;
  IntercompanyAllocation: Partial<IntercompanyAllocation>;
  IntercompanyJournalEntry: Partial<IntercompanyJournalEntry>;
  IntercompanyJournalLine: Partial<IntercompanyJournalLine>;
  IntercompanyJournalLineInput: Partial<IntercompanyJournalLineInput>;
  IntercompanyTransfer: Partial<IntercompanyTransfer>;
  InternalOrder: Partial<InternalOrder>;
  InternalOrderInput: Partial<InternalOrderInput>;
  InventoryControl: Partial<InventoryControl>;
  InventoryControlInput: Partial<InventoryControlInput>;
  InventoryReturn: Partial<InventoryReturn>;
  InventoryReturnInput: Partial<InventoryReturnInput>;
  Item: Partial<Item>;
  JournalEntry: Partial<JournalEntry>;
  JournalEntryInput: Partial<JournalEntryInput>;
  JournalEntryLine: Partial<JournalEntryLine>;
  JournalEntryLineInput: Partial<JournalEntryLineInput>;
  Lead: Partial<Lead>;
  LeadInput: Partial<LeadInput>;
  LeaveApplication: Partial<LeaveApplication>;
  LeaveEnrollment: Partial<LeaveEnrollment>;
  LeaveReinstatement: Partial<LeaveReinstatement>;
  LeaveType: Partial<LeaveType>;
  LoanRepayment: Partial<LoanRepayment>;
  LoanRepaymentInput: Partial<LoanRepaymentInput>;
  LoginInput: Partial<LoginInput>;
  MRNLineItem: Partial<MrnLineItem>;
  MRNLineItemInput: Partial<MrnLineItemInput>;
  MaintenancePart: Partial<MaintenancePart>;
  MaintenancePartInput: Partial<MaintenancePartInput>;
  MaterialReceipt: Partial<MaterialReceipt>;
  Milestone: Partial<Milestone>;
  MilestoneInput: Partial<MilestoneInput>;
  ModulePermission: Partial<ModulePermission>;
  ModulePermissionInput: Partial<ModulePermissionInput>;
  ModuleWorkspaceRecord: Partial<ModuleWorkspaceRecord>;
  Mutation: {};
  Notification: Partial<Notification>;
  Opportunity: Partial<Opportunity>;
  OpportunityInput: Partial<OpportunityInput>;
  Organization: Partial<Organization>;
  OrganizationModuleApprover: Partial<OrganizationModuleApprover>;
  OrganizationModuleApproverInput: Partial<OrganizationModuleApproverInput>;
  POLineItem: Partial<PoLineItem>;
  POLineItemInput: Partial<PoLineItemInput>;
  PayrollManagement: Partial<PayrollManagement>;
  PayrollManagementInput: Partial<PayrollManagementInput>;
  PayrollUiRecord: Partial<PayrollUiRecord>;
  PayrollUiRecordInput: Partial<PayrollUiRecordInput>;
  Permission: Partial<Permission>;
  PermissionInput: Partial<PermissionInput>;
  PostDepreciationInput: Partial<PostDepreciationInput>;
  PriceList: Partial<PriceList>;
  PriceListLine: Partial<PriceListLine>;
  Product: Partial<Product>;
  ProductionPlanning: Partial<ProductionPlanning>;
  ProductionPlanningInput: Partial<ProductionPlanningInput>;
  Project: Partial<Project>;
  PurchaseOrder: Partial<PurchaseOrder>;
  QCDefect: Partial<QcDefect>;
  QCDefectInput: Partial<QcDefectInput>;
  QCInspection: Partial<QcInspection>;
  QCOutcomeSummary: Partial<QcOutcomeSummary>;
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
  SearchHit: Partial<SearchHit>;
  SendNotificationAudienceInput: Partial<SendNotificationAudienceInput>;
  SendNotificationInput: Partial<SendNotificationInput>;
  SendQuotationResult: Partial<SendQuotationResult>;
  SiteLocation: Partial<SiteLocation>;
  SiteLocationInput: Partial<SiteLocationInput>;
  StockAdjustment: Partial<StockAdjustment>;
  StockMovement: Partial<StockMovement>;
  StockMovementInput: Partial<StockMovementInput>;
  StockTransfer: Partial<StockTransfer>;
  String: Partial<Scalars['String']['output']>;
  Task: Partial<Task>;
  TaskInput: Partial<TaskInput>;
  TaxRate: Partial<TaxRate>;
  TimesheetEntry: Partial<TimesheetEntry>;
  TimesheetWeeklySummary: Partial<TimesheetWeeklySummary>;
  UpdateAssetMaintenanceInput: Partial<UpdateAssetMaintenanceInput>;
  UpdateAttendanceInput: Partial<UpdateAttendanceInput>;
  UpdateBOMInput: Partial<UpdateBomInput>;
  UpdateClientInput: Partial<UpdateClientInput>;
  UpdateCustomerInput: Partial<UpdateCustomerInput>;
  UpdateCustomerInvoiceInput: Partial<UpdateCustomerInvoiceInput>;
  UpdateCustomerPaymentInput: Partial<UpdateCustomerPaymentInput>;
  UpdateDeliveryOrderInput: Partial<UpdateDeliveryOrderInput>;
  UpdateEmployeeMasterInput: Partial<UpdateEmployeeMasterInput>;
  UpdateFixedAssetInput: Partial<UpdateFixedAssetInput>;
  UpdateGRNInput: Partial<UpdateGrnInput>;
  UpdateHrMasterInput: Partial<UpdateHrMasterInput>;
  UpdateIntercompanyAllocationInput: Partial<UpdateIntercompanyAllocationInput>;
  UpdateIntercompanyJournalInput: Partial<UpdateIntercompanyJournalInput>;
  UpdateIntercompanyTransferInput: Partial<UpdateIntercompanyTransferInput>;
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
  UpdateQCInspectionInput: Partial<UpdateQcInspectionInput>;
  UpdateQuotationInput: Partial<UpdateQuotationInput>;
  UpdateRoleInput: Partial<UpdateRoleInput>;
  UpdateSalesEnquiryInput: Partial<UpdateSalesEnquiryInput>;
  UpdateSalesOrderInput: Partial<UpdateSalesOrderInput>;
  UpdateSalesQuotationInput: Partial<UpdateSalesQuotationInput>;
  UpdateStockAdjustmentInput: Partial<UpdateStockAdjustmentInput>;
  UpdateStockTransferInput: Partial<UpdateStockTransferInput>;
  UpdateTaxRateInput: Partial<UpdateTaxRateInput>;
  UpdateTimesheetEntryInput: Partial<UpdateTimesheetEntryInput>;
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

export type AllocationLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AllocationLine'] = ResolversParentTypes['AllocationLine']> = ResolversObject<{
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  costCenter: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destinationAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  percentage: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  targetOrganizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  targetOrganizationName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AllocationScheduleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AllocationSchedule'] = ResolversParentTypes['AllocationSchedule']> = ResolversObject<{
  allocationMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['AllocationLine']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scheduleName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type ApprovalRequestResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ApprovalRequest'] = ResolversParentTypes['ApprovalRequest']> = ResolversObject<{
  assigneeApproverUserId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decidedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decidedByUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  entityId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  entityType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleKey: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requesterDisplayName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requesterUserId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolutionNote: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['ApprovalRequestStatus'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type AssetMaintenanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AssetMaintenance'] = ResolversParentTypes['AssetMaintenance']> = ResolversObject<{
  actionsTaken: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assetCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assetId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  assetName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assignedToName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assignedToUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  completedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  downtimeHours: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  findings: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  intervalDays: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  laborCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  laborHours: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  laborRate: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maintenanceType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextScheduledDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  partsCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  partsUsed: Resolver<Array<ResolversTypes['MaintenancePart']>, ParentType, ContextType>;
  priority: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scheduledDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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

export type AuditLogResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditLog'] = ResolversParentTypes['AuditLog']> = ResolversObject<{
  action: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  entityType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ipAddress: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  newValuesJson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oldValuesJson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userAgent: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuditLogPageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditLogPage'] = ResolversParentTypes['AuditLogPage']> = ResolversObject<{
  data: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType>;
  page: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pages: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  token: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BomComponentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BOMComponent'] = ResolversParentTypes['BOMComponent']> = ResolversObject<{
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  itemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  scrapPercent: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  standardCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type BillOfMaterialsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BillOfMaterials'] = ResolversParentTypes['BillOfMaterials']> = ResolversObject<{
  bomCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  components: Resolver<Array<ResolversTypes['BOMComponent']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  laborCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  overheadCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  parentItemId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentItemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantityProduced: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalMaterialCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BudgetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Budget'] = ResolversParentTypes['Budget']> = ResolversObject<{
  budgetName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fiscalYear: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['BudgetLine']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BudgetLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BudgetLine'] = ResolversParentTypes['BudgetLine']> = ResolversObject<{
  accountCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  period: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  accountNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  accountType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type ContractorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Contractor'] = ResolversParentTypes['Contractor']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactPerson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  specialty: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurrencyRevaluationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CurrencyRevaluation'] = ResolversParentTypes['CurrencyRevaluation']> = ResolversObject<{
  baseCurrency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['CurrencyRevaluationLine']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revaluationDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalGainLoss: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CurrencyRevaluationLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CurrencyRevaluationLine'] = ResolversParentTypes['CurrencyRevaluationLine']> = ResolversObject<{
  accountCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gainLoss: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  originalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revaluedAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
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

export type DashboardPreferencesResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardPreferences'] = ResolversParentTypes['DashboardPreferences']> = ResolversObject<{
  admin: Resolver<Maybe<ResolversTypes['DashboardWidgetPreferences']>, ParentType, ContextType>;
  erp: Resolver<Maybe<ResolversTypes['DashboardWidgetPreferences']>, ParentType, ContextType>;
  orgAdmin: Resolver<Maybe<ResolversTypes['DashboardWidgetPreferences']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DashboardWidgetPreferencesResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardWidgetPreferences'] = ResolversParentTypes['DashboardWidgetPreferences']> = ResolversObject<{
  hiddenWidgets: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  widgetOrder: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
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

export type DeliveryItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryItem'] = ResolversParentTypes['DeliveryItem']> = ResolversObject<{
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  itemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeliveryOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeliveryOrder'] = ResolversParentTypes['DeliveryOrder']> = ResolversObject<{
  actualArrival: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  carrier: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  customerName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveredAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveryDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dispatchedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  driverName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  driverPhone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expectedArrival: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items: Resolver<Array<ResolversTypes['DeliveryItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  salesOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  shippingAddress: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedBy: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalQuantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trackingNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vehicleNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DepreciationEntryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DepreciationEntry'] = ResolversParentTypes['DepreciationEntry']> = ResolversObject<{
  accumulatedDepreciation: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  amount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bookValue: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  method: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  periodEndDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = ResolversObject<{
  category: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  downloadUrl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mimeType: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentModule: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sizeBytes: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadedByUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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

export type EmployeeBankResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeBank'] = ResolversParentTypes['EmployeeBank']> = ResolversObject<{
  accountNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bankName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  branchName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ifscCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeEmergencyContactResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeEmergencyContact'] = ResolversParentTypes['EmployeeEmergencyContact']> = ResolversObject<{
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relation: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmployeeMasterResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EmployeeMaster'] = ResolversParentTypes['EmployeeMaster']> = ResolversObject<{
  aadhaarNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  alternatePhone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bankDetails: Resolver<Maybe<ResolversTypes['EmployeeBank']>, ParentType, ContextType>;
  basicSalary: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bloodGroup: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfBirth: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateOfConfirmation: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateOfJoining: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateOfRelieving: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  department: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  designation: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emergencyContact: Resolver<Maybe<ResolversTypes['EmployeeEmergencyContact']>, ParentType, ContextType>;
  employeeCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employmentType: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  esiNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maritalStatus: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nationality: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  panNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  personalEmail: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pincode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reportsToUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  shiftMasterId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  state: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uanNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  workEmail: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workLocation: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type FixedAssetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FixedAsset'] = ResolversParentTypes['FixedAsset']> = ResolversObject<{
  accumulatedDepreciation: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  acquisitionCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  assetCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  assignedToUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  barcode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bookValue: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commissionedDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  depreciationHistory: Resolver<Array<ResolversTypes['DepreciationEntry']>, ParentType, ContextType>;
  depreciationMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  depreciationRatePercent: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  disposalDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  purchaseDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  salvageValue: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  serialNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  siteLocationId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usefulLifeMonths: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  vendorId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  warrantyExpiryDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FixedAssetCategorySummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FixedAssetCategorySummary'] = ResolversParentTypes['FixedAssetCategorySummary']> = ResolversObject<{
  accumulatedDepreciation: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  acquisitionCost: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bookValue: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type HrMasterResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HrMaster'] = ResolversParentTypes['HrMaster']> = ResolversObject<{
  active: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadataJson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sortOrder: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IctLineItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ICTLineItem'] = ResolversParentTypes['ICTLineItem']> = ResolversObject<{
  itemDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  qty: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type IntercompanyAllocationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IntercompanyAllocation'] = ResolversParentTypes['IntercompanyAllocation']> = ResolversObject<{
  allocationMethod: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  basisAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  basisDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  journalEntryId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['AllocationLine']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postedByUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  scheduleCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sourceAccount: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAllocated: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IntercompanyJournalEntryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IntercompanyJournalEntry'] = ResolversParentTypes['IntercompanyJournalEntry']> = ResolversObject<{
  allocationId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entryDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['IntercompanyJournalLine']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originatingOrganizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postedByUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  reversalOfId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalCredit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalDebit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IntercompanyJournalLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IntercompanyJournalLine'] = ResolversParentTypes['IntercompanyJournalLine']> = ResolversObject<{
  account: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  costCenter: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  credit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  debit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IntercompanyTransferResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IntercompanyTransfer'] = ResolversParentTypes['IntercompanyTransfer']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromOrganizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fromOrganizationName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineItems: Resolver<Array<ResolversTypes['ICTLineItem']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toOrganizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  toOrganizationName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transferDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transferNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type JournalEntryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JournalEntry'] = ResolversParentTypes['JournalEntry']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entryDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entryNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines: Resolver<Array<ResolversTypes['JournalEntryLine']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postedBy: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referenceNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalCredit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalDebit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type JournalEntryLineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JournalEntryLine'] = ResolversParentTypes['JournalEntryLine']> = ResolversObject<{
  accountCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accountName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  credit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  debit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Lead'] = ResolversParentTypes['Lead']> = ResolversObject<{
  assignedTo: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  company: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedValue: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  expectedCloseDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  source: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type MaintenancePartResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MaintenancePart'] = ResolversParentTypes['MaintenancePart']> = ResolversObject<{
  costPerUnit: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  itemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lineTotal: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type MilestoneResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Milestone'] = ResolversParentTypes['Milestone']> = ResolversObject<{
  completedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dueDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ModulePermissionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ModulePermission'] = ResolversParentTypes['ModulePermission']> = ResolversObject<{
  canCreate: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  canDelete: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  canUpdate: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  canView: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  moduleKey: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ModuleWorkspaceRecordResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ModuleWorkspaceRecord'] = ResolversParentTypes['ModuleWorkspaceRecord']> = ResolversObject<{
  approvalModuleKey: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdByUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  detail: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  routePath: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  snapshot: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['ModuleWorkspaceStatus'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  activateBudget: Resolver<ResolversTypes['Budget'], ParentType, ContextType, RequireFields<MutationActivateBudgetArgs, 'id'>>;
  adjustStock: Resolver<ResolversTypes['InventoryControl'], ParentType, ContextType, RequireFields<MutationAdjustStockArgs, 'binLocation' | 'itemId' | 'quantity' | 'reason'>>;
  approveLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationApproveLeaveApplicationArgs, 'id'>>;
  approveLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationApproveLeaveReinstatementArgs, 'id'>>;
  approvePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationApprovePurchaseOrderArgs, 'id'>>;
  approveReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationApproveReturnAuthorizationArgs, 'id'>>;
  approveVendorBill: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationApproveVendorBillArgs, 'id'>>;
  archiveAllNotifications: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  archiveNotification: Resolver<ResolversTypes['Notification'], ParentType, ContextType, RequireFields<MutationArchiveNotificationArgs, 'id'>>;
  billPurchaseOrder: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationBillPurchaseOrderArgs, 'billDate' | 'dueDate' | 'id'>>;
  cancelCustomerDeposit: Resolver<ResolversTypes['CustomerDeposit'], ParentType, ContextType, RequireFields<MutationCancelCustomerDepositArgs, 'id'>>;
  cancelCustomerRefund: Resolver<ResolversTypes['CustomerRefund'], ParentType, ContextType, RequireFields<MutationCancelCustomerRefundArgs, 'id'>>;
  cancelFinanceChargeAssessment: Resolver<ResolversTypes['FinanceChargeAssessment'], ParentType, ContextType, RequireFields<MutationCancelFinanceChargeAssessmentArgs, 'id'>>;
  cancelIntercompanyTransfer: Resolver<ResolversTypes['IntercompanyTransfer'], ParentType, ContextType, RequireFields<MutationCancelIntercompanyTransferArgs, 'id'>>;
  cancelMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationCancelMaterialReceiptArgs, 'id'>>;
  cancelReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationCancelReturnAuthorizationArgs, 'id'>>;
  cancelStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationCancelStockAdjustmentArgs, 'id'>>;
  cancelStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationCancelStockTransferArgs, 'id'>>;
  completeAssetMaintenance: Resolver<ResolversTypes['AssetMaintenance'], ParentType, ContextType, RequireFields<MutationCompleteAssetMaintenanceArgs, 'id' | 'input'>>;
  confirmIntercompanyTransfer: Resolver<ResolversTypes['IntercompanyTransfer'], ParentType, ContextType, RequireFields<MutationConfirmIntercompanyTransferArgs, 'id'>>;
  confirmMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationConfirmMaterialReceiptArgs, 'id'>>;
  confirmStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationConfirmStockAdjustmentArgs, 'id'>>;
  confirmStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationConfirmStockTransferArgs, 'id'>>;
  convertLeadToOpportunity: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationConvertLeadToOpportunityArgs, 'id'>>;
  createAllocationSchedule: Resolver<ResolversTypes['AllocationSchedule'], ParentType, ContextType, RequireFields<MutationCreateAllocationScheduleArgs, 'input'>>;
  createApplicant: Resolver<ResolversTypes['Applicant'], ParentType, ContextType, RequireFields<MutationCreateApplicantArgs, 'input'>>;
  createAsset: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationCreateAssetArgs, 'input'>>;
  createAssetMaintenance: Resolver<ResolversTypes['AssetMaintenance'], ParentType, ContextType, RequireFields<MutationCreateAssetMaintenanceArgs, 'input'>>;
  createAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationCreateAttendanceArgs, 'input'>>;
  createBankAccount: Resolver<ResolversTypes['BankAccount'], ParentType, ContextType, RequireFields<MutationCreateBankAccountArgs, 'input'>>;
  createBankStatementLine: Resolver<ResolversTypes['BankStatementLine'], ParentType, ContextType, RequireFields<MutationCreateBankStatementLineArgs, 'input'>>;
  createBillOfMaterials: Resolver<ResolversTypes['BillOfMaterials'], ParentType, ContextType, RequireFields<MutationCreateBillOfMaterialsArgs, 'input'>>;
  createBudget: Resolver<ResolversTypes['Budget'], ParentType, ContextType, RequireFields<MutationCreateBudgetArgs, 'input'>>;
  createCareer: Resolver<ResolversTypes['Career'], ParentType, ContextType, RequireFields<MutationCreateCareerArgs, 'input'>>;
  createCashBank: Resolver<ResolversTypes['CashBank'], ParentType, ContextType, RequireFields<MutationCreateCashBankArgs, 'input'>>;
  createChartOfAccount: Resolver<ResolversTypes['ChartOfAccounts'], ParentType, ContextType, RequireFields<MutationCreateChartOfAccountArgs, 'input'>>;
  createClient: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createContractor: Resolver<ResolversTypes['Contractor'], ParentType, ContextType, RequireFields<MutationCreateContractorArgs, 'input'>>;
  createCurrencyRevaluation: Resolver<ResolversTypes['CurrencyRevaluation'], ParentType, ContextType, RequireFields<MutationCreateCurrencyRevaluationArgs, 'input'>>;
  createCustomer: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'input'>>;
  createCustomerDeposit: Resolver<ResolversTypes['CustomerDeposit'], ParentType, ContextType, RequireFields<MutationCreateCustomerDepositArgs, 'input'>>;
  createCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationCreateCustomerInvoiceArgs, 'input'>>;
  createCustomerPayment: Resolver<ResolversTypes['CustomerPayment'], ParentType, ContextType, RequireFields<MutationCreateCustomerPaymentArgs, 'input'>>;
  createCustomerRefund: Resolver<ResolversTypes['CustomerRefund'], ParentType, ContextType, RequireFields<MutationCreateCustomerRefundArgs, 'input'>>;
  createDVS: Resolver<ResolversTypes['DVS'], ParentType, ContextType, RequireFields<MutationCreateDvsArgs, 'input'>>;
  createDeliveryChallan: Resolver<ResolversTypes['DeliveryChallan'], ParentType, ContextType, RequireFields<MutationCreateDeliveryChallanArgs, 'input'>>;
  createDeliveryOrder: Resolver<ResolversTypes['DeliveryOrder'], ParentType, ContextType, RequireFields<MutationCreateDeliveryOrderArgs, 'input'>>;
  createEPM: Resolver<ResolversTypes['EPM'], ParentType, ContextType, RequireFields<MutationCreateEpmArgs, 'input'>>;
  createEmployeeMaster: Resolver<ResolversTypes['EmployeeMaster'], ParentType, ContextType, RequireFields<MutationCreateEmployeeMasterArgs, 'input'>>;
  createExciseInvoice: Resolver<ResolversTypes['ExciseInvoice'], ParentType, ContextType, RequireFields<MutationCreateExciseInvoiceArgs, 'input'>>;
  createExtraction: Resolver<ResolversTypes['Extraction'], ParentType, ContextType, RequireFields<MutationCreateExtractionArgs, 'input'>>;
  createFixedAsset: Resolver<ResolversTypes['FixedAsset'], ParentType, ContextType, RequireFields<MutationCreateFixedAssetArgs, 'input'>>;
  createGRN: Resolver<ResolversTypes['GRN'], ParentType, ContextType, RequireFields<MutationCreateGrnArgs, 'input'>>;
  createGeneralLedger: Resolver<ResolversTypes['GeneralLedger'], ParentType, ContextType, RequireFields<MutationCreateGeneralLedgerArgs, 'input'>>;
  createGoodsReceipt: Resolver<ResolversTypes['GoodsReceipt'], ParentType, ContextType, RequireFields<MutationCreateGoodsReceiptArgs, 'input'>>;
  createHrMaster: Resolver<ResolversTypes['HrMaster'], ParentType, ContextType, RequireFields<MutationCreateHrMasterArgs, 'input'>>;
  createIPInspection: Resolver<ResolversTypes['IPInspection'], ParentType, ContextType, RequireFields<MutationCreateIpInspectionArgs, 'input'>>;
  createIntercompanyAllocation: Resolver<ResolversTypes['IntercompanyAllocation'], ParentType, ContextType, RequireFields<MutationCreateIntercompanyAllocationArgs, 'input'>>;
  createIntercompanyJournalEntry: Resolver<ResolversTypes['IntercompanyJournalEntry'], ParentType, ContextType, RequireFields<MutationCreateIntercompanyJournalEntryArgs, 'input'>>;
  createIntercompanyTransfer: Resolver<ResolversTypes['IntercompanyTransfer'], ParentType, ContextType, RequireFields<MutationCreateIntercompanyTransferArgs, 'input'>>;
  createInternalOrder: Resolver<ResolversTypes['InternalOrder'], ParentType, ContextType, RequireFields<MutationCreateInternalOrderArgs, 'input'>>;
  createInventoryControl: Resolver<ResolversTypes['InventoryControl'], ParentType, ContextType, RequireFields<MutationCreateInventoryControlArgs, 'input'>>;
  createInventoryReturn: Resolver<ResolversTypes['InventoryReturn'], ParentType, ContextType, RequireFields<MutationCreateInventoryReturnArgs, 'input'>>;
  createItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationCreateItemArgs, 'input'>>;
  createJournalEntry: Resolver<ResolversTypes['JournalEntry'], ParentType, ContextType, RequireFields<MutationCreateJournalEntryArgs, 'input'>>;
  createLead: Resolver<ResolversTypes['Lead'], ParentType, ContextType, RequireFields<MutationCreateLeadArgs, 'input'>>;
  createLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationCreateLeaveApplicationArgs, 'input'>>;
  createLeaveEnrollment: Resolver<ResolversTypes['LeaveEnrollment'], ParentType, ContextType, RequireFields<MutationCreateLeaveEnrollmentArgs, 'input'>>;
  createLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationCreateLeaveReinstatementArgs, 'input'>>;
  createLeaveType: Resolver<ResolversTypes['LeaveType'], ParentType, ContextType, RequireFields<MutationCreateLeaveTypeArgs, 'input'>>;
  createLoanRepayment: Resolver<ResolversTypes['LoanRepayment'], ParentType, ContextType, RequireFields<MutationCreateLoanRepaymentArgs, 'input'>>;
  createMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationCreateMaterialReceiptArgs, 'input'>>;
  createModuleWorkspaceRecord: Resolver<ResolversTypes['ModuleWorkspaceRecord'], ParentType, ContextType, RequireFields<MutationCreateModuleWorkspaceRecordArgs, 'input'>>;
  createOpportunity: Resolver<ResolversTypes['Opportunity'], ParentType, ContextType, RequireFields<MutationCreateOpportunityArgs, 'input'>>;
  createOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'input'>>;
  createOrganizationWithOrgAdmin: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationCreateOrganizationWithOrgAdminArgs, 'input'>>;
  createPayrollManagement: Resolver<ResolversTypes['PayrollManagement'], ParentType, ContextType, RequireFields<MutationCreatePayrollManagementArgs, 'input'>>;
  createPayrollUiRecord: Resolver<ResolversTypes['PayrollUiRecord'], ParentType, ContextType, RequireFields<MutationCreatePayrollUiRecordArgs, 'input'>>;
  createProduct: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createProductionPlanning: Resolver<ResolversTypes['ProductionPlanning'], ParentType, ContextType, RequireFields<MutationCreateProductionPlanningArgs, 'input'>>;
  createProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  createPurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationCreatePurchaseOrderArgs, 'input'>>;
  createQCInspection: Resolver<ResolversTypes['QCInspection'], ParentType, ContextType, RequireFields<MutationCreateQcInspectionArgs, 'input'>>;
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
  createSiteLocation: Resolver<ResolversTypes['SiteLocation'], ParentType, ContextType, RequireFields<MutationCreateSiteLocationArgs, 'input'>>;
  createStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationCreateStockAdjustmentArgs, 'input'>>;
  createStockMovement: Resolver<ResolversTypes['StockMovement'], ParentType, ContextType, RequireFields<MutationCreateStockMovementArgs, 'input'>>;
  createStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationCreateStockTransferArgs, 'input'>>;
  createTaxRate: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType, RequireFields<MutationCreateTaxRateArgs, 'input'>>;
  createTimesheetEntry: Resolver<ResolversTypes['TimesheetEntry'], ParentType, ContextType, RequireFields<MutationCreateTimesheetEntryArgs, 'input'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVendor: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'input'>>;
  createVendorBill: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationCreateVendorBillArgs, 'input'>>;
  createVendorCredit: Resolver<ResolversTypes['VendorCredit'], ParentType, ContextType, RequireFields<MutationCreateVendorCreditArgs, 'input'>>;
  createVendorPayment: Resolver<ResolversTypes['VendorPayment'], ParentType, ContextType, RequireFields<MutationCreateVendorPaymentArgs, 'input'>>;
  createVendorPrepayment: Resolver<ResolversTypes['VendorPrepayment'], ParentType, ContextType, RequireFields<MutationCreateVendorPrepaymentArgs, 'input'>>;
  createWarehouse: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationCreateWarehouseArgs, 'input'>>;
  createWarehouseBin: Resolver<ResolversTypes['WarehouseBin'], ParentType, ContextType, RequireFields<MutationCreateWarehouseBinArgs, 'input'>>;
  createWorkOrder: Resolver<ResolversTypes['WorkOrder'], ParentType, ContextType, RequireFields<MutationCreateWorkOrderArgs, 'input'>>;
  deleteAllocationSchedule: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAllocationScheduleArgs, 'id'>>;
  deleteApplicant: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteApplicantArgs, 'id'>>;
  deleteAsset: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'id'>>;
  deleteAssetMaintenance: Resolver<ResolversTypes['AssetMaintenance'], ParentType, ContextType, RequireFields<MutationDeleteAssetMaintenanceArgs, 'id'>>;
  deleteAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationDeleteAttendanceArgs, 'id'>>;
  deleteBankStatementLine: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBankStatementLineArgs, 'id'>>;
  deleteBillOfMaterials: Resolver<ResolversTypes['BillOfMaterials'], ParentType, ContextType, RequireFields<MutationDeleteBillOfMaterialsArgs, 'id'>>;
  deleteBudget: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBudgetArgs, 'id'>>;
  deleteCareer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCareerArgs, 'id'>>;
  deleteChartOfAccount: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteChartOfAccountArgs, 'id'>>;
  deleteClient: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'id'>>;
  deleteContractor: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContractorArgs, 'id'>>;
  deleteCurrencyRevaluation: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCurrencyRevaluationArgs, 'id'>>;
  deleteCustomer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'id'>>;
  deleteCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationDeleteCustomerInvoiceArgs, 'id'>>;
  deleteCustomerPayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCustomerPaymentArgs, 'id'>>;
  deleteDVS: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDvsArgs, 'id'>>;
  deleteDeliveryChallan: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDeliveryChallanArgs, 'id'>>;
  deleteDeliveryOrder: Resolver<ResolversTypes['DeliveryOrder'], ParentType, ContextType, RequireFields<MutationDeleteDeliveryOrderArgs, 'id'>>;
  deleteDocument: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationDeleteDocumentArgs, 'id'>>;
  deleteEPM: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEpmArgs, 'id'>>;
  deleteEmployeeMaster: Resolver<ResolversTypes['EmployeeMaster'], ParentType, ContextType, RequireFields<MutationDeleteEmployeeMasterArgs, 'id'>>;
  deleteExciseInvoice: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteExciseInvoiceArgs, 'id'>>;
  deleteExtraction: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteExtractionArgs, 'id'>>;
  deleteFinanceChargeAssessment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteFinanceChargeAssessmentArgs, 'id'>>;
  deleteFixedAsset: Resolver<ResolversTypes['FixedAsset'], ParentType, ContextType, RequireFields<MutationDeleteFixedAssetArgs, 'id'>>;
  deleteGRN: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteGrnArgs, 'id'>>;
  deleteGoodsReceipt: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteGoodsReceiptArgs, 'id'>>;
  deleteHrMaster: Resolver<ResolversTypes['HrMaster'], ParentType, ContextType, RequireFields<MutationDeleteHrMasterArgs, 'id'>>;
  deleteIPInspection: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteIpInspectionArgs, 'id'>>;
  deleteIndividualPriceList: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteIndividualPriceListArgs, 'id'>>;
  deleteIntercompanyAllocation: Resolver<ResolversTypes['IntercompanyAllocation'], ParentType, ContextType, RequireFields<MutationDeleteIntercompanyAllocationArgs, 'id'>>;
  deleteIntercompanyJournalEntry: Resolver<ResolversTypes['IntercompanyJournalEntry'], ParentType, ContextType, RequireFields<MutationDeleteIntercompanyJournalEntryArgs, 'id'>>;
  deleteIntercompanyTransfer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteIntercompanyTransferArgs, 'id'>>;
  deleteInternalOrder: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteInternalOrderArgs, 'id'>>;
  deleteInventoryReturn: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteInventoryReturnArgs, 'id'>>;
  deleteItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationDeleteItemArgs, 'id'>>;
  deleteJournalEntry: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteJournalEntryArgs, 'id'>>;
  deleteLead: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteLeadArgs, 'id'>>;
  deleteLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationDeleteLeaveApplicationArgs, 'id'>>;
  deleteLeaveEnrollment: Resolver<ResolversTypes['LeaveEnrollment'], ParentType, ContextType, RequireFields<MutationDeleteLeaveEnrollmentArgs, 'id'>>;
  deleteLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationDeleteLeaveReinstatementArgs, 'id'>>;
  deleteLeaveType: Resolver<ResolversTypes['LeaveType'], ParentType, ContextType, RequireFields<MutationDeleteLeaveTypeArgs, 'id'>>;
  deleteLoanRepayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteLoanRepaymentArgs, 'id'>>;
  deleteMaterialReceipt: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMaterialReceiptArgs, 'id'>>;
  deleteOpportunity: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteOpportunityArgs, 'id'>>;
  deleteOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'id'>>;
  deletePayrollManagement: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePayrollManagementArgs, 'id'>>;
  deletePayrollUiRecord: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePayrollUiRecordArgs, 'id'>>;
  deleteProduct: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteProductionPlanning: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductionPlanningArgs, 'id'>>;
  deleteProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deletePurchaseOrder: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePurchaseOrderArgs, 'id'>>;
  deleteQCInspection: Resolver<ResolversTypes['QCInspection'], ParentType, ContextType, RequireFields<MutationDeleteQcInspectionArgs, 'id'>>;
  deleteQuotation: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteQuotationArgs, 'id'>>;
  deleteReconciliationRule: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteReconciliationRuleArgs, 'id'>>;
  deleteReturnAuthorization: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteReturnAuthorizationArgs, 'id'>>;
  deleteRole: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteSalaryProcessing: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSalaryProcessingArgs, 'id'>>;
  deleteSalesEnquiry: Resolver<ResolversTypes['SalesEnquiry'], ParentType, ContextType, RequireFields<MutationDeleteSalesEnquiryArgs, 'id'>>;
  deleteSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationDeleteSalesOrderArgs, 'id'>>;
  deleteSalesQuotation: Resolver<ResolversTypes['SalesQuotation'], ParentType, ContextType, RequireFields<MutationDeleteSalesQuotationArgs, 'id'>>;
  deleteSalesReturn: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSalesReturnArgs, 'id'>>;
  deleteSiteLocation: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSiteLocationArgs, 'id'>>;
  deleteStockAdjustment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStockAdjustmentArgs, 'id'>>;
  deleteStockTransfer: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStockTransferArgs, 'id'>>;
  deleteTaxRate: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType, RequireFields<MutationDeleteTaxRateArgs, 'id'>>;
  deleteTimesheetEntry: Resolver<ResolversTypes['TimesheetEntry'], ParentType, ContextType, RequireFields<MutationDeleteTimesheetEntryArgs, 'id'>>;
  deleteUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteVendor: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorArgs, 'id'>>;
  deleteVendorBill: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorBillArgs, 'id'>>;
  deleteVendorCredit: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorCreditArgs, 'id'>>;
  deleteVendorPayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorPaymentArgs, 'id'>>;
  deleteVendorPrepayment: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorPrepaymentArgs, 'id'>>;
  deleteWorkOrder: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteWorkOrderArgs, 'id'>>;
  disposeFixedAsset: Resolver<ResolversTypes['FixedAsset'], ParentType, ContextType, RequireFields<MutationDisposeFixedAssetArgs, 'disposalDate' | 'id'>>;
  draftFinanceChargeAssessment: Resolver<ResolversTypes['FinanceChargeAssessment'], ParentType, ContextType, RequireFields<MutationDraftFinanceChargeAssessmentArgs, 'input'>>;
  generatePriceList: Resolver<ResolversTypes['PriceList'], ParentType, ContextType, RequireFields<MutationGeneratePriceListArgs, 'input'>>;
  login: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  markAllNotificationsRead: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  markNotificationRead: Resolver<ResolversTypes['Notification'], ParentType, ContextType, RequireFields<MutationMarkNotificationReadArgs, 'id'>>;
  matchBankStatementLineToBook: Resolver<ResolversTypes['BankStatementLine'], ParentType, ContextType, RequireFields<MutationMatchBankStatementLineToBookArgs, 'bankStatementLineId' | 'cashBankId'>>;
  postCurrencyRevaluation: Resolver<ResolversTypes['CurrencyRevaluation'], ParentType, ContextType, RequireFields<MutationPostCurrencyRevaluationArgs, 'id'>>;
  postFinanceChargeAssessment: Resolver<ResolversTypes['FinanceChargeAssessment'], ParentType, ContextType, RequireFields<MutationPostFinanceChargeAssessmentArgs, 'id'>>;
  postFixedAssetDepreciation: Resolver<ResolversTypes['FixedAsset'], ParentType, ContextType, RequireFields<MutationPostFixedAssetDepreciationArgs, 'id' | 'input'>>;
  postIntercompanyAllocation: Resolver<ResolversTypes['IntercompanyAllocation'], ParentType, ContextType, RequireFields<MutationPostIntercompanyAllocationArgs, 'id'>>;
  postIntercompanyJournalEntry: Resolver<ResolversTypes['IntercompanyJournalEntry'], ParentType, ContextType, RequireFields<MutationPostIntercompanyJournalEntryArgs, 'id'>>;
  postJournalEntry: Resolver<ResolversTypes['JournalEntry'], ParentType, ContextType, RequireFields<MutationPostJournalEntryArgs, 'id'>>;
  receivePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationReceivePurchaseOrderArgs, 'id'>>;
  receiveReturnAuthorizationGoods: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationReceiveReturnAuthorizationGoodsArgs, 'input'>>;
  reconcileCashBank: Resolver<ResolversTypes['CashBank'], ParentType, ContextType, RequireFields<MutationReconcileCashBankArgs, 'id'>>;
  refundCashSale: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationRefundCashSaleArgs, 'input'>>;
  register: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  rejectLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationRejectLeaveApplicationArgs, 'id' | 'reason'>>;
  rejectLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationRejectLeaveReinstatementArgs, 'id'>>;
  rejectReturnAuthorization: Resolver<ResolversTypes['ReturnAuthorization'], ParentType, ContextType, RequireFields<MutationRejectReturnAuthorizationArgs, 'id'>>;
  resolveApprovalRequest: Resolver<ResolversTypes['ApprovalRequest'], ParentType, ContextType, RequireFields<MutationResolveApprovalRequestArgs, 'decision' | 'id'>>;
  resolveTimesheetEntry: Resolver<ResolversTypes['TimesheetEntry'], ParentType, ContextType, RequireFields<MutationResolveTimesheetEntryArgs, 'decision' | 'id'>>;
  reverseIntercompanyAllocation: Resolver<ResolversTypes['IntercompanyAllocation'], ParentType, ContextType, RequireFields<MutationReverseIntercompanyAllocationArgs, 'id'>>;
  reverseIntercompanyJournalEntry: Resolver<ResolversTypes['IntercompanyJournalEntry'], ParentType, ContextType, RequireFields<MutationReverseIntercompanyJournalEntryArgs, 'id'>>;
  seedIndividualPriceListFromCatalog: Resolver<ResolversTypes['IndividualPriceList'], ParentType, ContextType, RequireFields<MutationSeedIndividualPriceListFromCatalogArgs, 'customerId' | 'organizationId'>>;
  seedSystemRoles: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  sendNotification: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationSendNotificationArgs, 'input'>>;
  sendQuotation: Resolver<ResolversTypes['SendQuotationResult'], ParentType, ContextType, RequireFields<MutationSendQuotationArgs, 'id'>>;
  setOrganizationModuleApprovers: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationSetOrganizationModuleApproversArgs, 'assignments' | 'organizationId'>>;
  setQCInspectionOutcome: Resolver<ResolversTypes['QCInspection'], ParentType, ContextType, RequireFields<MutationSetQcInspectionOutcomeArgs, 'id' | 'outcome'>>;
  setUserModulePermissions: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSetUserModulePermissionsArgs, 'permissions' | 'userId'>>;
  startAssetMaintenance: Resolver<ResolversTypes['AssetMaintenance'], ParentType, ContextType, RequireFields<MutationStartAssetMaintenanceArgs, 'id'>>;
  submitCustomerInvoiceForApproval: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationSubmitCustomerInvoiceForApprovalArgs, 'id'>>;
  submitDeliveryChallanForApproval: Resolver<ResolversTypes['DeliveryChallan'], ParentType, ContextType, RequireFields<MutationSubmitDeliveryChallanForApprovalArgs, 'id'>>;
  submitGRNForApproval: Resolver<ResolversTypes['GRN'], ParentType, ContextType, RequireFields<MutationSubmitGrnForApprovalArgs, 'id'>>;
  submitLeadForApproval: Resolver<ResolversTypes['Lead'], ParentType, ContextType, RequireFields<MutationSubmitLeadForApprovalArgs, 'id'>>;
  submitMaterialReceiptForApproval: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationSubmitMaterialReceiptForApprovalArgs, 'id'>>;
  submitModuleWorkspaceRecordForApproval: Resolver<ResolversTypes['ModuleWorkspaceRecord'], ParentType, ContextType, RequireFields<MutationSubmitModuleWorkspaceRecordForApprovalArgs, 'id'>>;
  submitPayrollManagementForApproval: Resolver<ResolversTypes['PayrollManagement'], ParentType, ContextType, RequireFields<MutationSubmitPayrollManagementForApprovalArgs, 'id'>>;
  submitPayrollUiRecordForApproval: Resolver<ResolversTypes['PayrollUiRecord'], ParentType, ContextType, RequireFields<MutationSubmitPayrollUiRecordForApprovalArgs, 'id'>>;
  submitProjectForApproval: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationSubmitProjectForApprovalArgs, 'id'>>;
  submitPurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationSubmitPurchaseOrderArgs, 'id'>>;
  submitQuotationForApproval: Resolver<ResolversTypes['Quotation'], ParentType, ContextType, RequireFields<MutationSubmitQuotationForApprovalArgs, 'id'>>;
  submitSalesEnquiryForApproval: Resolver<ResolversTypes['SalesEnquiry'], ParentType, ContextType, RequireFields<MutationSubmitSalesEnquiryForApprovalArgs, 'id'>>;
  submitSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationSubmitSalesOrderArgs, 'id'>>;
  submitSalesReturnForApproval: Resolver<ResolversTypes['SalesReturn'], ParentType, ContextType, RequireFields<MutationSubmitSalesReturnForApprovalArgs, 'id'>>;
  submitTimesheetEntry: Resolver<ResolversTypes['TimesheetEntry'], ParentType, ContextType, RequireFields<MutationSubmitTimesheetEntryArgs, 'id'>>;
  submitVendorBillForApproval: Resolver<ResolversTypes['VendorBill'], ParentType, ContextType, RequireFields<MutationSubmitVendorBillForApprovalArgs, 'id'>>;
  submitVendorForApproval: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationSubmitVendorForApprovalArgs, 'id'>>;
  transferBankFunds: Resolver<ResolversTypes['BankTransferResult'], ParentType, ContextType, RequireFields<MutationTransferBankFundsArgs, 'input'>>;
  transitionDeliveryOrderStatus: Resolver<ResolversTypes['DeliveryOrder'], ParentType, ContextType, RequireFields<MutationTransitionDeliveryOrderStatusArgs, 'id' | 'status'>>;
  updateAllocationSchedule: Resolver<ResolversTypes['AllocationSchedule'], ParentType, ContextType, RequireFields<MutationUpdateAllocationScheduleArgs, 'id' | 'input'>>;
  updateApplicant: Resolver<ResolversTypes['Applicant'], ParentType, ContextType, RequireFields<MutationUpdateApplicantArgs, 'id' | 'input'>>;
  updateAsset: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationUpdateAssetArgs, 'id' | 'input'>>;
  updateAssetMaintenance: Resolver<ResolversTypes['AssetMaintenance'], ParentType, ContextType, RequireFields<MutationUpdateAssetMaintenanceArgs, 'id' | 'input'>>;
  updateAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationUpdateAttendanceArgs, 'id' | 'input'>>;
  updateBankAccount: Resolver<ResolversTypes['BankAccount'], ParentType, ContextType, RequireFields<MutationUpdateBankAccountArgs, 'id' | 'input'>>;
  updateBillOfMaterials: Resolver<ResolversTypes['BillOfMaterials'], ParentType, ContextType, RequireFields<MutationUpdateBillOfMaterialsArgs, 'id' | 'input'>>;
  updateBudget: Resolver<ResolversTypes['Budget'], ParentType, ContextType, RequireFields<MutationUpdateBudgetArgs, 'id' | 'input'>>;
  updateCareer: Resolver<ResolversTypes['Career'], ParentType, ContextType, RequireFields<MutationUpdateCareerArgs, 'id' | 'input'>>;
  updateChartOfAccount: Resolver<ResolversTypes['ChartOfAccounts'], ParentType, ContextType, RequireFields<MutationUpdateChartOfAccountArgs, 'id' | 'input'>>;
  updateClient: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  updateContractor: Resolver<ResolversTypes['Contractor'], ParentType, ContextType, RequireFields<MutationUpdateContractorArgs, 'id' | 'input'>>;
  updateCustomer: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'id' | 'input'>>;
  updateCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationUpdateCustomerInvoiceArgs, 'id' | 'input'>>;
  updateCustomerPayment: Resolver<ResolversTypes['CustomerPayment'], ParentType, ContextType, RequireFields<MutationUpdateCustomerPaymentArgs, 'id' | 'input'>>;
  updateDVS: Resolver<ResolversTypes['DVS'], ParentType, ContextType, RequireFields<MutationUpdateDvsArgs, 'id' | 'input'>>;
  updateDeliveryChallan: Resolver<ResolversTypes['DeliveryChallan'], ParentType, ContextType, RequireFields<MutationUpdateDeliveryChallanArgs, 'id' | 'input'>>;
  updateDeliveryOrder: Resolver<ResolversTypes['DeliveryOrder'], ParentType, ContextType, RequireFields<MutationUpdateDeliveryOrderArgs, 'id' | 'input'>>;
  updateEPM: Resolver<ResolversTypes['EPM'], ParentType, ContextType, RequireFields<MutationUpdateEpmArgs, 'id' | 'input'>>;
  updateEmployeeMaster: Resolver<ResolversTypes['EmployeeMaster'], ParentType, ContextType, RequireFields<MutationUpdateEmployeeMasterArgs, 'id' | 'input'>>;
  updateExciseInvoice: Resolver<ResolversTypes['ExciseInvoice'], ParentType, ContextType, RequireFields<MutationUpdateExciseInvoiceArgs, 'id' | 'input'>>;
  updateExtraction: Resolver<ResolversTypes['Extraction'], ParentType, ContextType, RequireFields<MutationUpdateExtractionArgs, 'id' | 'input'>>;
  updateFixedAsset: Resolver<ResolversTypes['FixedAsset'], ParentType, ContextType, RequireFields<MutationUpdateFixedAssetArgs, 'id' | 'input'>>;
  updateGRN: Resolver<ResolversTypes['GRN'], ParentType, ContextType, RequireFields<MutationUpdateGrnArgs, 'id' | 'input'>>;
  updateGoodsReceipt: Resolver<ResolversTypes['GoodsReceipt'], ParentType, ContextType, RequireFields<MutationUpdateGoodsReceiptArgs, 'id' | 'input'>>;
  updateHrMaster: Resolver<ResolversTypes['HrMaster'], ParentType, ContextType, RequireFields<MutationUpdateHrMasterArgs, 'id' | 'input'>>;
  updateIPInspection: Resolver<ResolversTypes['IPInspection'], ParentType, ContextType, RequireFields<MutationUpdateIpInspectionArgs, 'id' | 'input'>>;
  updateIntercompanyAllocation: Resolver<ResolversTypes['IntercompanyAllocation'], ParentType, ContextType, RequireFields<MutationUpdateIntercompanyAllocationArgs, 'id' | 'input'>>;
  updateIntercompanyJournalEntry: Resolver<ResolversTypes['IntercompanyJournalEntry'], ParentType, ContextType, RequireFields<MutationUpdateIntercompanyJournalEntryArgs, 'id' | 'input'>>;
  updateIntercompanyTransfer: Resolver<ResolversTypes['IntercompanyTransfer'], ParentType, ContextType, RequireFields<MutationUpdateIntercompanyTransferArgs, 'id' | 'input'>>;
  updateInternalOrder: Resolver<ResolversTypes['InternalOrder'], ParentType, ContextType, RequireFields<MutationUpdateInternalOrderArgs, 'id' | 'input'>>;
  updateInventoryControl: Resolver<ResolversTypes['InventoryControl'], ParentType, ContextType, RequireFields<MutationUpdateInventoryControlArgs, 'id' | 'input'>>;
  updateInventoryReturn: Resolver<ResolversTypes['InventoryReturn'], ParentType, ContextType, RequireFields<MutationUpdateInventoryReturnArgs, 'id' | 'input'>>;
  updateItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationUpdateItemArgs, 'id' | 'input'>>;
  updateJournalEntry: Resolver<ResolversTypes['JournalEntry'], ParentType, ContextType, RequireFields<MutationUpdateJournalEntryArgs, 'id' | 'input'>>;
  updateLead: Resolver<ResolversTypes['Lead'], ParentType, ContextType, RequireFields<MutationUpdateLeadArgs, 'id' | 'input'>>;
  updateLeaveApplication: Resolver<ResolversTypes['LeaveApplication'], ParentType, ContextType, RequireFields<MutationUpdateLeaveApplicationArgs, 'id' | 'input'>>;
  updateLeaveEnrollment: Resolver<ResolversTypes['LeaveEnrollment'], ParentType, ContextType, RequireFields<MutationUpdateLeaveEnrollmentArgs, 'id' | 'input'>>;
  updateLeaveReinstatement: Resolver<ResolversTypes['LeaveReinstatement'], ParentType, ContextType, RequireFields<MutationUpdateLeaveReinstatementArgs, 'id' | 'input'>>;
  updateLeaveType: Resolver<ResolversTypes['LeaveType'], ParentType, ContextType, RequireFields<MutationUpdateLeaveTypeArgs, 'id' | 'input'>>;
  updateLoanRepayment: Resolver<ResolversTypes['LoanRepayment'], ParentType, ContextType, RequireFields<MutationUpdateLoanRepaymentArgs, 'id' | 'input'>>;
  updateMaterialReceipt: Resolver<ResolversTypes['MaterialReceipt'], ParentType, ContextType, RequireFields<MutationUpdateMaterialReceiptArgs, 'id' | 'input'>>;
  updateModuleWorkspaceRecord: Resolver<ResolversTypes['ModuleWorkspaceRecord'], ParentType, ContextType, RequireFields<MutationUpdateModuleWorkspaceRecordArgs, 'id'>>;
  updateMyDashboardPreferences: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMyDashboardPreferencesArgs, 'dashboard' | 'input'>>;
  updateOpportunity: Resolver<ResolversTypes['Opportunity'], ParentType, ContextType, RequireFields<MutationUpdateOpportunityArgs, 'id' | 'input'>>;
  updateOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationArgs, 'id' | 'input'>>;
  updatePayrollManagement: Resolver<ResolversTypes['PayrollManagement'], ParentType, ContextType, RequireFields<MutationUpdatePayrollManagementArgs, 'id' | 'input'>>;
  updatePayrollUiRecord: Resolver<ResolversTypes['PayrollUiRecord'], ParentType, ContextType, RequireFields<MutationUpdatePayrollUiRecordArgs, 'id' | 'input'>>;
  updateProduct: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'id' | 'input'>>;
  updateProductionPlanning: Resolver<ResolversTypes['ProductionPlanning'], ParentType, ContextType, RequireFields<MutationUpdateProductionPlanningArgs, 'id' | 'input'>>;
  updateProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'id' | 'input'>>;
  updatePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationUpdatePurchaseOrderArgs, 'id' | 'input'>>;
  updateQCInspection: Resolver<ResolversTypes['QCInspection'], ParentType, ContextType, RequireFields<MutationUpdateQcInspectionArgs, 'id' | 'input'>>;
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
  updateSiteLocation: Resolver<ResolversTypes['SiteLocation'], ParentType, ContextType, RequireFields<MutationUpdateSiteLocationArgs, 'id' | 'input'>>;
  updateStockAdjustment: Resolver<ResolversTypes['StockAdjustment'], ParentType, ContextType, RequireFields<MutationUpdateStockAdjustmentArgs, 'id' | 'input'>>;
  updateStockTransfer: Resolver<ResolversTypes['StockTransfer'], ParentType, ContextType, RequireFields<MutationUpdateStockTransferArgs, 'id' | 'input'>>;
  updateTaxRate: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType, RequireFields<MutationUpdateTaxRateArgs, 'id' | 'input'>>;
  updateTimesheetEntry: Resolver<ResolversTypes['TimesheetEntry'], ParentType, ContextType, RequireFields<MutationUpdateTimesheetEntryArgs, 'id' | 'input'>>;
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

export type NotificationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = ResolversObject<{
  actorUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  archivedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRead: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  kind: Resolver<ResolversTypes['NotificationKind'], ParentType, ContextType>;
  link: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  moduleKey: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  readAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recipientUserId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  referenceId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  referenceModule: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  severity: Resolver<ResolversTypes['NotificationSeverity'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OpportunityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Opportunity'] = ResolversParentTypes['Opportunity']> = ResolversObject<{
  accountName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  amount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  assignedTo: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  closeDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leadSource: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextStep: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  probability: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stage: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleApprovers: Resolver<Array<ResolversTypes['OrganizationModuleApprover']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationModuleApproverResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrganizationModuleApprover'] = ResolversParentTypes['OrganizationModuleApprover']> = ResolversObject<{
  approverUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  moduleKey: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type PayrollUiRecordResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PayrollUiRecord'] = ResolversParentTypes['PayrollUiRecord']> = ResolversObject<{
  approvalStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  data: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  actualCost: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  budget: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  managerId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  milestones: Resolver<Maybe<Array<ResolversTypes['Milestone']>>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tasks: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = ResolversObject<{
  createdAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orgApprovalStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type QcDefectResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QCDefect'] = ResolversParentTypes['QCDefect']> = ResolversObject<{
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  correctiveAction: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rootCause: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  severity: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QcInspectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QCInspection'] = ResolversParentTypes['QCInspection']> = ResolversObject<{
  batchNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  defects: Resolver<Array<ResolversTypes['QCDefect']>, ParentType, ContextType>;
  docNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inspectionDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inspectorName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inspectorUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  itemId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  itemName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outcome: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantityFailed: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityInspected: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityPassed: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityReworked: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sourceId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  sourceModule: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QcOutcomeSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QCOutcomeSummary'] = ResolversParentTypes['QCOutcomeSummary']> = ResolversObject<{
  count: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  outcome: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantityFailed: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityInspected: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityPassed: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allocationSchedule: Resolver<Maybe<ResolversTypes['AllocationSchedule']>, ParentType, ContextType, RequireFields<QueryAllocationScheduleArgs, 'id'>>;
  allocationSchedules: Resolver<Array<ResolversTypes['AllocationSchedule']>, ParentType, ContextType, RequireFields<QueryAllocationSchedulesArgs, 'organizationId'>>;
  applicant: Resolver<Maybe<ResolversTypes['Applicant']>, ParentType, ContextType, RequireFields<QueryApplicantArgs, 'id'>>;
  applicants: Resolver<Array<ResolversTypes['Applicant']>, ParentType, ContextType, RequireFields<QueryApplicantsArgs, 'organizationId'>>;
  asset: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetArgs, 'id'>>;
  assetMaintenance: Resolver<Maybe<ResolversTypes['AssetMaintenance']>, ParentType, ContextType, RequireFields<QueryAssetMaintenanceArgs, 'id'>>;
  assetMaintenances: Resolver<Array<ResolversTypes['AssetMaintenance']>, ParentType, ContextType, RequireFields<QueryAssetMaintenancesArgs, 'organizationId'>>;
  assets: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetsArgs, 'organizationId'>>;
  attendance: Resolver<Maybe<ResolversTypes['Attendance']>, ParentType, ContextType, RequireFields<QueryAttendanceArgs, 'id'>>;
  attendances: Resolver<Array<ResolversTypes['Attendance']>, ParentType, ContextType, RequireFields<QueryAttendancesArgs, 'organizationId'>>;
  auditLogs: Resolver<ResolversTypes['AuditLogPage'], ParentType, ContextType, QueryAuditLogsArgs>;
  availableVendorCredits: Resolver<Array<ResolversTypes['VendorCredit']>, ParentType, ContextType, RequireFields<QueryAvailableVendorCreditsArgs, 'organizationId' | 'vendorId'>>;
  availableVendorPrepayments: Resolver<Array<ResolversTypes['VendorPrepayment']>, ParentType, ContextType, RequireFields<QueryAvailableVendorPrepaymentsArgs, 'organizationId' | 'vendorId'>>;
  bankAccount: Resolver<Maybe<ResolversTypes['BankAccount']>, ParentType, ContextType, RequireFields<QueryBankAccountArgs, 'id'>>;
  bankAccounts: Resolver<Array<ResolversTypes['BankAccount']>, ParentType, ContextType, RequireFields<QueryBankAccountsArgs, 'organizationId'>>;
  bankStatementLines: Resolver<Array<ResolversTypes['BankStatementLine']>, ParentType, ContextType, RequireFields<QueryBankStatementLinesArgs, 'bankAccount' | 'organizationId'>>;
  billOfMaterials: Resolver<Maybe<ResolversTypes['BillOfMaterials']>, ParentType, ContextType, RequireFields<QueryBillOfMaterialsArgs, 'id'>>;
  billsOfMaterials: Resolver<Array<ResolversTypes['BillOfMaterials']>, ParentType, ContextType, RequireFields<QueryBillsOfMaterialsArgs, 'organizationId'>>;
  budget: Resolver<Maybe<ResolversTypes['Budget']>, ParentType, ContextType, RequireFields<QueryBudgetArgs, 'id'>>;
  budgets: Resolver<Array<ResolversTypes['Budget']>, ParentType, ContextType, RequireFields<QueryBudgetsArgs, 'organizationId'>>;
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
  contractor: Resolver<Maybe<ResolversTypes['Contractor']>, ParentType, ContextType, RequireFields<QueryContractorArgs, 'id'>>;
  contractors: Resolver<Array<ResolversTypes['Contractor']>, ParentType, ContextType, RequireFields<QueryContractorsArgs, 'organizationId'>>;
  currencyRevaluation: Resolver<Maybe<ResolversTypes['CurrencyRevaluation']>, ParentType, ContextType, RequireFields<QueryCurrencyRevaluationArgs, 'id'>>;
  currencyRevaluations: Resolver<Array<ResolversTypes['CurrencyRevaluation']>, ParentType, ContextType, RequireFields<QueryCurrencyRevaluationsArgs, 'organizationId'>>;
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
  deliveryOrder: Resolver<Maybe<ResolversTypes['DeliveryOrder']>, ParentType, ContextType, RequireFields<QueryDeliveryOrderArgs, 'id'>>;
  deliveryOrders: Resolver<Array<ResolversTypes['DeliveryOrder']>, ParentType, ContextType, RequireFields<QueryDeliveryOrdersArgs, 'organizationId'>>;
  deliverychallan: Resolver<Maybe<ResolversTypes['DeliveryChallan']>, ParentType, ContextType, RequireFields<QueryDeliverychallanArgs, 'id'>>;
  deliverychallans: Resolver<Array<ResolversTypes['DeliveryChallan']>, ParentType, ContextType, RequireFields<QueryDeliverychallansArgs, 'organizationId'>>;
  document: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
  documents: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryDocumentsArgs, 'parentId' | 'parentModule'>>;
  dvs: Resolver<Maybe<ResolversTypes['DVS']>, ParentType, ContextType, RequireFields<QueryDvsArgs, 'id'>>;
  dvsRecords: Resolver<Array<ResolversTypes['DVS']>, ParentType, ContextType, RequireFields<QueryDvsRecordsArgs, 'organizationId'>>;
  employeeMaster: Resolver<Maybe<ResolversTypes['EmployeeMaster']>, ParentType, ContextType, RequireFields<QueryEmployeeMasterArgs, 'id'>>;
  employeeMasters: Resolver<Array<ResolversTypes['EmployeeMaster']>, ParentType, ContextType, RequireFields<QueryEmployeeMastersArgs, 'organizationId'>>;
  epm: Resolver<Maybe<ResolversTypes['EPM']>, ParentType, ContextType, RequireFields<QueryEpmArgs, 'id'>>;
  epms: Resolver<Array<ResolversTypes['EPM']>, ParentType, ContextType, RequireFields<QueryEpmsArgs, 'organizationId'>>;
  exciseinvoice: Resolver<Maybe<ResolversTypes['ExciseInvoice']>, ParentType, ContextType, RequireFields<QueryExciseinvoiceArgs, 'id'>>;
  exciseinvoices: Resolver<Array<ResolversTypes['ExciseInvoice']>, ParentType, ContextType, RequireFields<QueryExciseinvoicesArgs, 'organizationId'>>;
  extraction: Resolver<Maybe<ResolversTypes['Extraction']>, ParentType, ContextType, RequireFields<QueryExtractionArgs, 'id'>>;
  extractions: Resolver<Array<ResolversTypes['Extraction']>, ParentType, ContextType, RequireFields<QueryExtractionsArgs, 'organizationId'>>;
  financeChargeAssessment: Resolver<Maybe<ResolversTypes['FinanceChargeAssessment']>, ParentType, ContextType, RequireFields<QueryFinanceChargeAssessmentArgs, 'id'>>;
  financeChargeAssessments: Resolver<Array<ResolversTypes['FinanceChargeAssessment']>, ParentType, ContextType, RequireFields<QueryFinanceChargeAssessmentsArgs, 'organizationId'>>;
  fixedAsset: Resolver<Maybe<ResolversTypes['FixedAsset']>, ParentType, ContextType, RequireFields<QueryFixedAssetArgs, 'id'>>;
  fixedAssetSummaryByCategory: Resolver<Array<ResolversTypes['FixedAssetCategorySummary']>, ParentType, ContextType, RequireFields<QueryFixedAssetSummaryByCategoryArgs, 'organizationId'>>;
  fixedAssets: Resolver<Array<ResolversTypes['FixedAsset']>, ParentType, ContextType, RequireFields<QueryFixedAssetsArgs, 'organizationId'>>;
  generalLedger: Resolver<Maybe<ResolversTypes['GeneralLedger']>, ParentType, ContextType, RequireFields<QueryGeneralLedgerArgs, 'id'>>;
  generalLedgers: Resolver<Array<ResolversTypes['GeneralLedger']>, ParentType, ContextType, RequireFields<QueryGeneralLedgersArgs, 'organizationId'>>;
  generateCustomerStatement: Resolver<ResolversTypes['CustomerStatement'], ParentType, ContextType, RequireFields<QueryGenerateCustomerStatementArgs, 'customerId' | 'dateFrom' | 'dateTo' | 'organizationId'>>;
  globalSearch: Resolver<Array<ResolversTypes['SearchHit']>, ParentType, ContextType, RequireFields<QueryGlobalSearchArgs, 'organizationId' | 'query'>>;
  goodsreceipt: Resolver<Maybe<ResolversTypes['GoodsReceipt']>, ParentType, ContextType, RequireFields<QueryGoodsreceiptArgs, 'id'>>;
  goodsreceipts: Resolver<Array<ResolversTypes['GoodsReceipt']>, ParentType, ContextType, RequireFields<QueryGoodsreceiptsArgs, 'organizationId'>>;
  grn: Resolver<Maybe<ResolversTypes['GRN']>, ParentType, ContextType, RequireFields<QueryGrnArgs, 'id'>>;
  grns: Resolver<Array<ResolversTypes['GRN']>, ParentType, ContextType, RequireFields<QueryGrnsArgs, 'organizationId'>>;
  grnsByPO: Resolver<Array<ResolversTypes['GRN']>, ParentType, ContextType, RequireFields<QueryGrnsByPoArgs, 'purchaseOrderId'>>;
  hrMaster: Resolver<Maybe<ResolversTypes['HrMaster']>, ParentType, ContextType, RequireFields<QueryHrMasterArgs, 'id'>>;
  hrMasters: Resolver<Array<ResolversTypes['HrMaster']>, ParentType, ContextType, RequireFields<QueryHrMastersArgs, 'kind' | 'organizationId'>>;
  individualPriceList: Resolver<Maybe<ResolversTypes['IndividualPriceList']>, ParentType, ContextType, RequireFields<QueryIndividualPriceListArgs, 'id'>>;
  individualPriceListByCustomer: Resolver<Maybe<ResolversTypes['IndividualPriceList']>, ParentType, ContextType, RequireFields<QueryIndividualPriceListByCustomerArgs, 'customerId' | 'organizationId'>>;
  individualPriceLists: Resolver<Array<ResolversTypes['IndividualPriceList']>, ParentType, ContextType, RequireFields<QueryIndividualPriceListsArgs, 'organizationId'>>;
  intercompanyAllocation: Resolver<Maybe<ResolversTypes['IntercompanyAllocation']>, ParentType, ContextType, RequireFields<QueryIntercompanyAllocationArgs, 'id'>>;
  intercompanyAllocations: Resolver<Array<ResolversTypes['IntercompanyAllocation']>, ParentType, ContextType, RequireFields<QueryIntercompanyAllocationsArgs, 'organizationId'>>;
  intercompanyJournalEntries: Resolver<Array<ResolversTypes['IntercompanyJournalEntry']>, ParentType, ContextType, RequireFields<QueryIntercompanyJournalEntriesArgs, 'originatingOrganizationId'>>;
  intercompanyJournalEntry: Resolver<Maybe<ResolversTypes['IntercompanyJournalEntry']>, ParentType, ContextType, RequireFields<QueryIntercompanyJournalEntryArgs, 'id'>>;
  intercompanyTransfer: Resolver<Maybe<ResolversTypes['IntercompanyTransfer']>, ParentType, ContextType, RequireFields<QueryIntercompanyTransferArgs, 'id'>>;
  intercompanyTransfers: Resolver<Array<ResolversTypes['IntercompanyTransfer']>, ParentType, ContextType, RequireFields<QueryIntercompanyTransfersArgs, 'organizationId'>>;
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
  journalEntries: Resolver<Array<ResolversTypes['JournalEntry']>, ParentType, ContextType, RequireFields<QueryJournalEntriesArgs, 'organizationId'>>;
  journalEntry: Resolver<Maybe<ResolversTypes['JournalEntry']>, ParentType, ContextType, RequireFields<QueryJournalEntryArgs, 'id'>>;
  lead: Resolver<Maybe<ResolversTypes['Lead']>, ParentType, ContextType, RequireFields<QueryLeadArgs, 'id'>>;
  leads: Resolver<Array<ResolversTypes['Lead']>, ParentType, ContextType, RequireFields<QueryLeadsArgs, 'organizationId'>>;
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
  moduleWorkspaceRecords: Resolver<Array<ResolversTypes['ModuleWorkspaceRecord']>, ParentType, ContextType, RequireFields<QueryModuleWorkspaceRecordsArgs, 'organizationId' | 'routePath'>>;
  myApprovalRequests: Resolver<Array<ResolversTypes['ApprovalRequest']>, ParentType, ContextType, RequireFields<QueryMyApprovalRequestsArgs, 'limit' | 'role' | 'skip'>>;
  myNotifications: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType, QueryMyNotificationsArgs>;
  myPendingApprovalRequests: Resolver<Array<ResolversTypes['ApprovalRequest']>, ParentType, ContextType>;
  myUnreadNotificationCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  opportunities: Resolver<Array<ResolversTypes['Opportunity']>, ParentType, ContextType, RequireFields<QueryOpportunitiesArgs, 'organizationId'>>;
  opportunity: Resolver<Maybe<ResolversTypes['Opportunity']>, ParentType, ContextType, RequireFields<QueryOpportunityArgs, 'id'>>;
  organization: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationArgs, 'id'>>;
  organizationDocuments: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryOrganizationDocumentsArgs, 'organizationId'>>;
  organizations: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType, QueryOrganizationsArgs>;
  outstandingVendorBills: Resolver<Array<ResolversTypes['VendorBill']>, ParentType, ContextType, RequireFields<QueryOutstandingVendorBillsArgs, 'organizationId'>>;
  payrollmanagement: Resolver<Maybe<ResolversTypes['PayrollManagement']>, ParentType, ContextType, RequireFields<QueryPayrollmanagementArgs, 'id'>>;
  payrollmanagements: Resolver<Array<ResolversTypes['PayrollManagement']>, ParentType, ContextType, RequireFields<QueryPayrollmanagementsArgs, 'organizationId'>>;
  payrolluirecord: Resolver<Maybe<ResolversTypes['PayrollUiRecord']>, ParentType, ContextType, RequireFields<QueryPayrolluirecordArgs, 'id'>>;
  payrolluirecords: Resolver<Array<ResolversTypes['PayrollUiRecord']>, ParentType, ContextType, RequireFields<QueryPayrolluirecordsArgs, 'category' | 'organizationId'>>;
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
  qcInspection: Resolver<Maybe<ResolversTypes['QCInspection']>, ParentType, ContextType, RequireFields<QueryQcInspectionArgs, 'id'>>;
  qcInspections: Resolver<Array<ResolversTypes['QCInspection']>, ParentType, ContextType, RequireFields<QueryQcInspectionsArgs, 'organizationId'>>;
  qcOutcomeSummary: Resolver<Array<ResolversTypes['QCOutcomeSummary']>, ParentType, ContextType, RequireFields<QueryQcOutcomeSummaryArgs, 'organizationId'>>;
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
  siteLocation: Resolver<Maybe<ResolversTypes['SiteLocation']>, ParentType, ContextType, RequireFields<QuerySiteLocationArgs, 'id'>>;
  siteLocations: Resolver<Array<ResolversTypes['SiteLocation']>, ParentType, ContextType, RequireFields<QuerySiteLocationsArgs, 'organizationId'>>;
  stockMovement: Resolver<Maybe<ResolversTypes['StockMovement']>, ParentType, ContextType, RequireFields<QueryStockMovementArgs, 'id'>>;
  stockMovements: Resolver<Array<ResolversTypes['StockMovement']>, ParentType, ContextType, RequireFields<QueryStockMovementsArgs, 'organizationId'>>;
  stockadjustment: Resolver<Maybe<ResolversTypes['StockAdjustment']>, ParentType, ContextType, RequireFields<QueryStockadjustmentArgs, 'id'>>;
  stockadjustments: Resolver<Array<ResolversTypes['StockAdjustment']>, ParentType, ContextType, RequireFields<QueryStockadjustmentsArgs, 'organizationId'>>;
  stocktransfer: Resolver<Maybe<ResolversTypes['StockTransfer']>, ParentType, ContextType, RequireFields<QueryStocktransferArgs, 'id'>>;
  stocktransfers: Resolver<Array<ResolversTypes['StockTransfer']>, ParentType, ContextType, RequireFields<QueryStocktransfersArgs, 'organizationId'>>;
  systemRoles: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  taxRate: Resolver<Maybe<ResolversTypes['TaxRate']>, ParentType, ContextType, RequireFields<QueryTaxRateArgs, 'id'>>;
  taxRates: Resolver<Array<ResolversTypes['TaxRate']>, ParentType, ContextType, RequireFields<QueryTaxRatesArgs, 'organizationId'>>;
  timesheetEntries: Resolver<Array<ResolversTypes['TimesheetEntry']>, ParentType, ContextType, RequireFields<QueryTimesheetEntriesArgs, 'organizationId'>>;
  timesheetEntry: Resolver<Maybe<ResolversTypes['TimesheetEntry']>, ParentType, ContextType, RequireFields<QueryTimesheetEntryArgs, 'id'>>;
  timesheetWeeklySummary: Resolver<ResolversTypes['TimesheetWeeklySummary'], ParentType, ContextType, RequireFields<QueryTimesheetWeeklySummaryArgs, 'employeeUserId' | 'organizationId' | 'weekEnd' | 'weekStart'>>;
  upcomingMaintenance: Resolver<Array<ResolversTypes['AssetMaintenance']>, ParentType, ContextType, RequireFields<QueryUpcomingMaintenanceArgs, 'organizationId'>>;
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
  approvalRequestedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvalStatus: Resolver<ResolversTypes['RecordApprovalWorkflowStatus'], ParentType, ContextType>;
  approvedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedBy: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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

export type SearchHitResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SearchHit'] = ResolversParentTypes['SearchHit']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matchedField: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subtitle: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SendQuotationResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SendQuotationResult'] = ResolversParentTypes['SendQuotationResult']> = ResolversObject<{
  emailSent: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  quotation: Resolver<ResolversTypes['Quotation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SiteLocationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SiteLocation'] = ResolversParentTypes['SiteLocation']> = ResolversObject<{
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactPerson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type TaskResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  assignedTo: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  completedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dueDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaxRateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaxRate'] = ResolversParentTypes['TaxRate']> = ResolversObject<{
  appliesTo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveFrom: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveTo: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hsnSacCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompound: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isInclusive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ratePercent: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimesheetEntryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TimesheetEntry'] = ResolversParentTypes['TimesheetEntry']> = ResolversObject<{
  approvedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedByUserId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  billRate: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  billable: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  costRate: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  employeeUserId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  entryDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hours: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  rejectionReason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submittedAt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taskName: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimesheetWeeklySummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TimesheetWeeklySummary'] = ResolversParentTypes['TimesheetWeeklySummary']> = ResolversObject<{
  approvedHours: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  billableHours: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  draft: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pending: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalHours: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dashboardPreferences: Resolver<Maybe<ResolversTypes['DashboardPreferences']>, ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modulePermissions: Resolver<Maybe<Array<ResolversTypes['ModulePermission']>>, ParentType, ContextType>;
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
  orgApprovalStatus: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  AllocationLine: AllocationLineResolvers<ContextType>;
  AllocationSchedule: AllocationScheduleResolvers<ContextType>;
  Applicant: ApplicantResolvers<ContextType>;
  ApprovalRequest: ApprovalRequestResolvers<ContextType>;
  Asset: AssetResolvers<ContextType>;
  AssetMaintenance: AssetMaintenanceResolvers<ContextType>;
  Attendance: AttendanceResolvers<ContextType>;
  AuditLog: AuditLogResolvers<ContextType>;
  AuditLogPage: AuditLogPageResolvers<ContextType>;
  AuthPayload: AuthPayloadResolvers<ContextType>;
  BOMComponent: BomComponentResolvers<ContextType>;
  BankAccount: BankAccountResolvers<ContextType>;
  BankStatementLine: BankStatementLineResolvers<ContextType>;
  BankTransferResult: BankTransferResultResolvers<ContextType>;
  BillOfMaterials: BillOfMaterialsResolvers<ContextType>;
  Budget: BudgetResolvers<ContextType>;
  BudgetLine: BudgetLineResolvers<ContextType>;
  Career: CareerResolvers<ContextType>;
  CashBank: CashBankResolvers<ContextType>;
  ChartOfAccounts: ChartOfAccountsResolvers<ContextType>;
  Client: ClientResolvers<ContextType>;
  ClientRef: ClientRefResolvers<ContextType>;
  Competency: CompetencyResolvers<ContextType>;
  Contractor: ContractorResolvers<ContextType>;
  CurrencyRevaluation: CurrencyRevaluationResolvers<ContextType>;
  CurrencyRevaluationLine: CurrencyRevaluationLineResolvers<ContextType>;
  Customer: CustomerResolvers<ContextType>;
  CustomerDeposit: CustomerDepositResolvers<ContextType>;
  CustomerInvoice: CustomerInvoiceResolvers<ContextType>;
  CustomerPayment: CustomerPaymentResolvers<ContextType>;
  CustomerPaymentAllocation: CustomerPaymentAllocationResolvers<ContextType>;
  CustomerRefund: CustomerRefundResolvers<ContextType>;
  CustomerStatement: CustomerStatementResolvers<ContextType>;
  CustomerStatementLine: CustomerStatementLineResolvers<ContextType>;
  DVS: DvsResolvers<ContextType>;
  DashboardPreferences: DashboardPreferencesResolvers<ContextType>;
  DashboardWidgetPreferences: DashboardWidgetPreferencesResolvers<ContextType>;
  DeliveryChallan: DeliveryChallanResolvers<ContextType>;
  DeliveryItem: DeliveryItemResolvers<ContextType>;
  DeliveryOrder: DeliveryOrderResolvers<ContextType>;
  DepreciationEntry: DepreciationEntryResolvers<ContextType>;
  Document: DocumentResolvers<ContextType>;
  EPM: EpmResolvers<ContextType>;
  Education: EducationResolvers<ContextType>;
  EmployeeBank: EmployeeBankResolvers<ContextType>;
  EmployeeEmergencyContact: EmployeeEmergencyContactResolvers<ContextType>;
  EmployeeMaster: EmployeeMasterResolvers<ContextType>;
  ExciseInvoice: ExciseInvoiceResolvers<ContextType>;
  Experience: ExperienceResolvers<ContextType>;
  Extraction: ExtractionResolvers<ContextType>;
  FinanceChargeAssessment: FinanceChargeAssessmentResolvers<ContextType>;
  FinanceChargeLine: FinanceChargeLineResolvers<ContextType>;
  FixedAsset: FixedAssetResolvers<ContextType>;
  FixedAssetCategorySummary: FixedAssetCategorySummaryResolvers<ContextType>;
  GRN: GrnResolvers<ContextType>;
  GRNLineItem: GrnLineItemResolvers<ContextType>;
  GeneralLedger: GeneralLedgerResolvers<ContextType>;
  Goal: GoalResolvers<ContextType>;
  GoodsReceipt: GoodsReceiptResolvers<ContextType>;
  HrMaster: HrMasterResolvers<ContextType>;
  ICTLineItem: IctLineItemResolvers<ContextType>;
  IPInspection: IpInspectionResolvers<ContextType>;
  IndividualPriceList: IndividualPriceListResolvers<ContextType>;
  IndividualPriceListLine: IndividualPriceListLineResolvers<ContextType>;
  IntercompanyAllocation: IntercompanyAllocationResolvers<ContextType>;
  IntercompanyJournalEntry: IntercompanyJournalEntryResolvers<ContextType>;
  IntercompanyJournalLine: IntercompanyJournalLineResolvers<ContextType>;
  IntercompanyTransfer: IntercompanyTransferResolvers<ContextType>;
  InternalOrder: InternalOrderResolvers<ContextType>;
  InventoryControl: InventoryControlResolvers<ContextType>;
  InventoryReturn: InventoryReturnResolvers<ContextType>;
  Item: ItemResolvers<ContextType>;
  JournalEntry: JournalEntryResolvers<ContextType>;
  JournalEntryLine: JournalEntryLineResolvers<ContextType>;
  Lead: LeadResolvers<ContextType>;
  LeaveApplication: LeaveApplicationResolvers<ContextType>;
  LeaveEnrollment: LeaveEnrollmentResolvers<ContextType>;
  LeaveReinstatement: LeaveReinstatementResolvers<ContextType>;
  LeaveType: LeaveTypeResolvers<ContextType>;
  LoanRepayment: LoanRepaymentResolvers<ContextType>;
  MRNLineItem: MrnLineItemResolvers<ContextType>;
  MaintenancePart: MaintenancePartResolvers<ContextType>;
  MaterialReceipt: MaterialReceiptResolvers<ContextType>;
  Milestone: MilestoneResolvers<ContextType>;
  ModulePermission: ModulePermissionResolvers<ContextType>;
  ModuleWorkspaceRecord: ModuleWorkspaceRecordResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Notification: NotificationResolvers<ContextType>;
  Opportunity: OpportunityResolvers<ContextType>;
  Organization: OrganizationResolvers<ContextType>;
  OrganizationModuleApprover: OrganizationModuleApproverResolvers<ContextType>;
  POLineItem: PoLineItemResolvers<ContextType>;
  PayrollManagement: PayrollManagementResolvers<ContextType>;
  PayrollUiRecord: PayrollUiRecordResolvers<ContextType>;
  Permission: PermissionResolvers<ContextType>;
  PriceList: PriceListResolvers<ContextType>;
  PriceListLine: PriceListLineResolvers<ContextType>;
  Product: ProductResolvers<ContextType>;
  ProductionPlanning: ProductionPlanningResolvers<ContextType>;
  Project: ProjectResolvers<ContextType>;
  PurchaseOrder: PurchaseOrderResolvers<ContextType>;
  QCDefect: QcDefectResolvers<ContextType>;
  QCInspection: QcInspectionResolvers<ContextType>;
  QCOutcomeSummary: QcOutcomeSummaryResolvers<ContextType>;
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
  SearchHit: SearchHitResolvers<ContextType>;
  SendQuotationResult: SendQuotationResultResolvers<ContextType>;
  SiteLocation: SiteLocationResolvers<ContextType>;
  StockAdjustment: StockAdjustmentResolvers<ContextType>;
  StockMovement: StockMovementResolvers<ContextType>;
  StockTransfer: StockTransferResolvers<ContextType>;
  Task: TaskResolvers<ContextType>;
  TaxRate: TaxRateResolvers<ContextType>;
  TimesheetEntry: TimesheetEntryResolvers<ContextType>;
  TimesheetWeeklySummary: TimesheetWeeklySummaryResolvers<ContextType>;
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

