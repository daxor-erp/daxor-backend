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

export type CreateAttendanceInput = {
  checkIn: InputMaybe<Scalars['String']['input']>;
  checkOut: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateCustomerInvoiceInput = {
  customerId: Scalars['ID']['input'];
  dueDate: InputMaybe<Scalars['String']['input']>;
  invoiceDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  salesOrderId: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateItemInput = {
  category: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  rate: InputMaybe<Scalars['Float']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrganizationInput = {
  address: InputMaybe<Scalars['String']['input']>;
  code: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  description: InputMaybe<Scalars['String']['input']>;
  endDate: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  startDate: InputMaybe<Scalars['String']['input']>;
};

export type CreatePurchaseOrderInput = {
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateSalesOrderInput = {
  customerId: Scalars['ID']['input'];
  orderDate: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  projectId: InputMaybe<Scalars['ID']['input']>;
  totalAmount: Scalars['Float']['input'];
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

export type CreateVendorInput = {
  address: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  phone: InputMaybe<Scalars['String']['input']>;
};

export type CustomerInvoice = {
  __typename?: 'CustomerInvoice';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  dueDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  paidAmount: Maybe<Scalars['Float']['output']>;
  salesOrderId: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
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
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  unit: Maybe<Scalars['String']['output']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAttendance: Attendance;
  createCustomerInvoice: CustomerInvoice;
  createItem: Item;
  createOrganization: Organization;
  createProject: Project;
  createPurchaseOrder: PurchaseOrder;
  createSalesOrder: SalesOrder;
  createUser: User;
  createVendor: Vendor;
  deleteAttendance: Attendance;
  deleteCustomerInvoice: CustomerInvoice;
  deleteItem: Item;
  deleteOrganization: Organization;
  deleteProject: Project;
  deletePurchaseOrder: PurchaseOrder;
  deleteSalesOrder: SalesOrder;
  deleteUser: User;
  deleteVendor: Vendor;
  login: AuthPayload;
  register: AuthPayload;
  updateAttendance: Attendance;
  updateCustomerInvoice: CustomerInvoice;
  updateItem: Item;
  updateOrganization: Organization;
  updateProject: Project;
  updatePurchaseOrder: PurchaseOrder;
  updateSalesOrder: SalesOrder;
  updateUser: User;
  updateVendor: Vendor;
};


export type MutationCreateAttendanceArgs = {
  input: CreateAttendanceInput;
};


export type MutationCreateCustomerInvoiceArgs = {
  input: CreateCustomerInvoiceInput;
};


export type MutationCreateItemArgs = {
  input: CreateItemInput;
};


export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreatePurchaseOrderArgs = {
  input: CreatePurchaseOrderInput;
};


export type MutationCreateSalesOrderArgs = {
  input: CreateSalesOrderInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSalesOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAttendanceInput;
};


export type MutationUpdateCustomerInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInvoiceInput;
};


export type MutationUpdateItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateItemInput;
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrganizationInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};


export type MutationUpdatePurchaseOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePurchaseOrderInput;
};


export type MutationUpdateSalesOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSalesOrderInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateVendorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
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

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  seqNo: Scalars['String']['output'];
  startDate: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  orderDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  projectId: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  vendorId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  attendance: Maybe<Attendance>;
  attendances: Array<Attendance>;
  customerinvoice: Maybe<CustomerInvoice>;
  customerinvoices: Array<CustomerInvoice>;
  item: Maybe<Item>;
  items: Array<Item>;
  me: Maybe<User>;
  organization: Maybe<Organization>;
  organizations: Array<Organization>;
  project: Maybe<Project>;
  projects: Array<Project>;
  purchaseorder: Maybe<PurchaseOrder>;
  purchaseorders: Array<PurchaseOrder>;
  salesorder: Maybe<SalesOrder>;
  salesorders: Array<SalesOrder>;
  user: Maybe<User>;
  userByEmail: Maybe<User>;
  usersByOrganization: UserList;
  usersByRole: Array<User>;
  vendor: Maybe<Vendor>;
  vendors: Array<Vendor>;
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


export type QueryCustomerinvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerinvoicesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
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


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
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


export type QuerySalesorderArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySalesordersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
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


export type QueryVendorsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
  page: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  organizationId: InputMaybe<Scalars['ID']['input']>;
  password: Scalars['String']['input'];
};

export type SalesOrder = {
  __typename?: 'SalesOrder';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  orderDate: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  projectId: Maybe<Scalars['ID']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type UpdateAttendanceInput = {
  checkIn: InputMaybe<Scalars['String']['input']>;
  checkOut: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
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

export type UpdateItemInput = {
  category: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  rate: InputMaybe<Scalars['Float']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  unit: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationInput = {
  address: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  description: InputMaybe<Scalars['String']['input']>;
  endDate: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  startDate: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePurchaseOrderInput = {
  projectId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
  vendorId: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateSalesOrderInput = {
  customerId: InputMaybe<Scalars['ID']['input']>;
  projectId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  totalAmount: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserInput = {
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  roles: InputMaybe<Array<Scalars['String']['input']>>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  address: InputMaybe<Scalars['String']['input']>;
  contactPerson: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  roles: Maybe<Array<Scalars['String']['output']>>;
  seqNo: Scalars['String']['output'];
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
  contactPerson: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  phone: Maybe<Scalars['String']['output']>;
  seqNo: Scalars['String']['output'];
  status: Scalars['String']['output'];
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
  Attendance: ResolverTypeWrapper<Partial<Attendance>>;
  AuthPayload: ResolverTypeWrapper<Partial<AuthPayload>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  CreateAttendanceInput: ResolverTypeWrapper<Partial<CreateAttendanceInput>>;
  CreateCustomerInvoiceInput: ResolverTypeWrapper<Partial<CreateCustomerInvoiceInput>>;
  CreateItemInput: ResolverTypeWrapper<Partial<CreateItemInput>>;
  CreateOrganizationInput: ResolverTypeWrapper<Partial<CreateOrganizationInput>>;
  CreateProjectInput: ResolverTypeWrapper<Partial<CreateProjectInput>>;
  CreatePurchaseOrderInput: ResolverTypeWrapper<Partial<CreatePurchaseOrderInput>>;
  CreateSalesOrderInput: ResolverTypeWrapper<Partial<CreateSalesOrderInput>>;
  CreateUserInput: ResolverTypeWrapper<Partial<CreateUserInput>>;
  CreateVendorInput: ResolverTypeWrapper<Partial<CreateVendorInput>>;
  CustomerInvoice: ResolverTypeWrapper<Partial<CustomerInvoice>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']['output']>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  Item: ResolverTypeWrapper<Partial<Item>>;
  LoginInput: ResolverTypeWrapper<Partial<LoginInput>>;
  Mutation: ResolverTypeWrapper<{}>;
  Organization: ResolverTypeWrapper<Partial<Organization>>;
  Project: ResolverTypeWrapper<Partial<Project>>;
  PurchaseOrder: ResolverTypeWrapper<Partial<PurchaseOrder>>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: ResolverTypeWrapper<Partial<RegisterInput>>;
  SalesOrder: ResolverTypeWrapper<Partial<SalesOrder>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  UpdateAttendanceInput: ResolverTypeWrapper<Partial<UpdateAttendanceInput>>;
  UpdateCustomerInvoiceInput: ResolverTypeWrapper<Partial<UpdateCustomerInvoiceInput>>;
  UpdateItemInput: ResolverTypeWrapper<Partial<UpdateItemInput>>;
  UpdateOrganizationInput: ResolverTypeWrapper<Partial<UpdateOrganizationInput>>;
  UpdateProjectInput: ResolverTypeWrapper<Partial<UpdateProjectInput>>;
  UpdatePurchaseOrderInput: ResolverTypeWrapper<Partial<UpdatePurchaseOrderInput>>;
  UpdateSalesOrderInput: ResolverTypeWrapper<Partial<UpdateSalesOrderInput>>;
  UpdateUserInput: ResolverTypeWrapper<Partial<UpdateUserInput>>;
  UpdateVendorInput: ResolverTypeWrapper<Partial<UpdateVendorInput>>;
  User: ResolverTypeWrapper<Partial<User>>;
  UserList: ResolverTypeWrapper<Partial<UserList>>;
  Vendor: ResolverTypeWrapper<Partial<Vendor>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Attendance: Partial<Attendance>;
  AuthPayload: Partial<AuthPayload>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  CreateAttendanceInput: Partial<CreateAttendanceInput>;
  CreateCustomerInvoiceInput: Partial<CreateCustomerInvoiceInput>;
  CreateItemInput: Partial<CreateItemInput>;
  CreateOrganizationInput: Partial<CreateOrganizationInput>;
  CreateProjectInput: Partial<CreateProjectInput>;
  CreatePurchaseOrderInput: Partial<CreatePurchaseOrderInput>;
  CreateSalesOrderInput: Partial<CreateSalesOrderInput>;
  CreateUserInput: Partial<CreateUserInput>;
  CreateVendorInput: Partial<CreateVendorInput>;
  CustomerInvoice: Partial<CustomerInvoice>;
  Float: Partial<Scalars['Float']['output']>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  Item: Partial<Item>;
  LoginInput: Partial<LoginInput>;
  Mutation: {};
  Organization: Partial<Organization>;
  Project: Partial<Project>;
  PurchaseOrder: Partial<PurchaseOrder>;
  Query: {};
  RegisterInput: Partial<RegisterInput>;
  SalesOrder: Partial<SalesOrder>;
  String: Partial<Scalars['String']['output']>;
  UpdateAttendanceInput: Partial<UpdateAttendanceInput>;
  UpdateCustomerInvoiceInput: Partial<UpdateCustomerInvoiceInput>;
  UpdateItemInput: Partial<UpdateItemInput>;
  UpdateOrganizationInput: Partial<UpdateOrganizationInput>;
  UpdateProjectInput: Partial<UpdateProjectInput>;
  UpdatePurchaseOrderInput: Partial<UpdatePurchaseOrderInput>;
  UpdateSalesOrderInput: Partial<UpdateSalesOrderInput>;
  UpdateUserInput: Partial<UpdateUserInput>;
  UpdateVendorInput: Partial<UpdateVendorInput>;
  User: Partial<User>;
  UserList: Partial<UserList>;
  Vendor: Partial<Vendor>;
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

export type CustomerInvoiceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerInvoice'] = ResolversParentTypes['CustomerInvoice']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  dueDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paidAmount: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  salesOrderId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
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
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationCreateAttendanceArgs, 'input'>>;
  createCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationCreateCustomerInvoiceArgs, 'input'>>;
  createItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationCreateItemArgs, 'input'>>;
  createOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'input'>>;
  createProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  createPurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationCreatePurchaseOrderArgs, 'input'>>;
  createSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationCreateSalesOrderArgs, 'input'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVendor: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'input'>>;
  deleteAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationDeleteAttendanceArgs, 'id'>>;
  deleteCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationDeleteCustomerInvoiceArgs, 'id'>>;
  deleteItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationDeleteItemArgs, 'id'>>;
  deleteOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'id'>>;
  deleteProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deletePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationDeletePurchaseOrderArgs, 'id'>>;
  deleteSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationDeleteSalesOrderArgs, 'id'>>;
  deleteUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteVendor: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationDeleteVendorArgs, 'id'>>;
  login: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  updateAttendance: Resolver<ResolversTypes['Attendance'], ParentType, ContextType, RequireFields<MutationUpdateAttendanceArgs, 'id' | 'input'>>;
  updateCustomerInvoice: Resolver<ResolversTypes['CustomerInvoice'], ParentType, ContextType, RequireFields<MutationUpdateCustomerInvoiceArgs, 'id' | 'input'>>;
  updateItem: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationUpdateItemArgs, 'id' | 'input'>>;
  updateOrganization: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationArgs, 'id' | 'input'>>;
  updateProject: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'id' | 'input'>>;
  updatePurchaseOrder: Resolver<ResolversTypes['PurchaseOrder'], ParentType, ContextType, RequireFields<MutationUpdatePurchaseOrderArgs, 'id' | 'input'>>;
  updateSalesOrder: Resolver<ResolversTypes['SalesOrder'], ParentType, ContextType, RequireFields<MutationUpdateSalesOrderArgs, 'id' | 'input'>>;
  updateUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
  updateVendor: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationUpdateVendorArgs, 'id' | 'input'>>;
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

export type ProjectResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurchaseOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PurchaseOrder'] = ResolversParentTypes['PurchaseOrder']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  vendorId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  attendance: Resolver<Maybe<ResolversTypes['Attendance']>, ParentType, ContextType, RequireFields<QueryAttendanceArgs, 'id'>>;
  attendances: Resolver<Array<ResolversTypes['Attendance']>, ParentType, ContextType, RequireFields<QueryAttendancesArgs, 'organizationId'>>;
  customerinvoice: Resolver<Maybe<ResolversTypes['CustomerInvoice']>, ParentType, ContextType, RequireFields<QueryCustomerinvoiceArgs, 'id'>>;
  customerinvoices: Resolver<Array<ResolversTypes['CustomerInvoice']>, ParentType, ContextType, RequireFields<QueryCustomerinvoicesArgs, 'organizationId'>>;
  item: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemArgs, 'id'>>;
  items: Resolver<Array<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemsArgs, 'organizationId'>>;
  me: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  organization: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationArgs, 'id'>>;
  organizations: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType, QueryOrganizationsArgs>;
  project: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>;
  projects: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectsArgs, 'organizationId'>>;
  purchaseorder: Resolver<Maybe<ResolversTypes['PurchaseOrder']>, ParentType, ContextType, RequireFields<QueryPurchaseorderArgs, 'id'>>;
  purchaseorders: Resolver<Array<ResolversTypes['PurchaseOrder']>, ParentType, ContextType, RequireFields<QueryPurchaseordersArgs, 'organizationId'>>;
  salesorder: Resolver<Maybe<ResolversTypes['SalesOrder']>, ParentType, ContextType, RequireFields<QuerySalesorderArgs, 'id'>>;
  salesorders: Resolver<Array<ResolversTypes['SalesOrder']>, ParentType, ContextType, RequireFields<QuerySalesordersArgs, 'organizationId'>>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userByEmail: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>;
  usersByOrganization: Resolver<ResolversTypes['UserList'], ParentType, ContextType, RequireFields<QueryUsersByOrganizationArgs, 'organizationId'>>;
  usersByRole: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersByRoleArgs, 'role'>>;
  vendor: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryVendorArgs, 'id'>>;
  vendors: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryVendorsArgs, 'organizationId'>>;
}>;

export type SalesOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SalesOrder'] = ResolversParentTypes['SalesOrder']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  contactPerson: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seqNo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Attendance: AttendanceResolvers<ContextType>;
  AuthPayload: AuthPayloadResolvers<ContextType>;
  CustomerInvoice: CustomerInvoiceResolvers<ContextType>;
  Item: ItemResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Organization: OrganizationResolvers<ContextType>;
  Project: ProjectResolvers<ContextType>;
  PurchaseOrder: PurchaseOrderResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  SalesOrder: SalesOrderResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  UserList: UserListResolvers<ContextType>;
  Vendor: VendorResolvers<ContextType>;
}>;

