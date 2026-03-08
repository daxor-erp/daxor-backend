import { z } from 'zod';

// Common validation patterns
export const uuidSchema = z.string().uuid('Invalid UUID format');
export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits');
export const dateSchema = z.coerce.date();
export const positiveNumberSchema = z.number().positive('Must be a positive number');
export const nonNegativeNumberSchema = z.number().min(0, 'Must be non-negative');

// User schemas
export const CreateUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.string().min(1, 'Role is required'),
  organizationId: uuidSchema,
  phoneNumber: phoneSchema.optional()
});

// Organization schemas
export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  website: z.string().url().optional(),
  taxNumber: z.string().optional(),
  registrationNumber: z.string().optional()
});

// Project schemas
export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  organizationId: uuidSchema,
  clientName: z.string().min(1, 'Client name is required'),
  clientContact: phoneSchema.optional(),
  clientEmail: emailSchema.optional(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  budget: positiveNumberSchema.optional(),
  managerId: uuidSchema.optional(),
  location: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

// Item schemas
export const CreateItemSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: positiveNumberSchema,
  stockQuantity: nonNegativeNumberSchema.default(0),
  minStockLevel: nonNegativeNumberSchema,
  maxStockLevel: nonNegativeNumberSchema.optional(),
  organizationId: uuidSchema,
  supplier: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  specifications: z.string().optional(),
  weight: positiveNumberSchema.optional(),
  dimensions: z.string().optional()
});

// Purchase Order schemas
export const CreatePurchaseOrderSchema = z.object({
  vendorId: uuidSchema,
  projectId: uuidSchema.optional(),
  organizationId: uuidSchema,
  orderDate: dateSchema,
  expectedDeliveryDate: dateSchema.optional(),
  items: z.array(z.object({
    itemId: uuidSchema,
    quantity: positiveNumberSchema,
    unitPrice: positiveNumberSchema,
    description: z.string().optional()
  })).min(1, 'At least one item is required'),
  notes: z.string().optional()
});

// Vendor schemas
export const CreateVendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  organizationId: uuidSchema,
  contactPerson: z.string().optional(),
  website: z.string().url().optional(),
  taxNumber: z.string().optional(),
  paymentTerms: z.string().optional()
});

// Attendance schemas
export const CreateAttendanceSchema = z.object({
  userId: uuidSchema,
  projectId: uuidSchema,
  date: dateSchema,
  checkIn: dateSchema,
  checkOut: dateSchema.optional(),
  status: z.enum(['present', 'absent', 'late', 'half-day']).default('present'),
  notes: z.string().optional()
});

// Invoice schemas
export const CreateCustomerInvoiceSchema = z.object({
  customerId: uuidSchema,
  projectId: uuidSchema.optional(),
  organizationId: uuidSchema,
  invoiceDate: dateSchema,
  dueDate: dateSchema,
  items: z.array(z.object({
    itemId: uuidSchema,
    quantity: positiveNumberSchema,
    unitPrice: positiveNumberSchema,
    description: z.string().optional()
  })).min(1, 'At least one item is required'),
  taxRate: z.number().min(0).max(100).default(0),
  discountAmount: nonNegativeNumberSchema.default(0)
});

// Payment schemas
export const CreatePaymentSchema = z.object({
  amount: positiveNumberSchema,
  paymentMethod: z.enum(['cash', 'check', 'bank-transfer', 'credit-card']),
  paymentDate: dateSchema,
  reference: z.string().optional(),
  notes: z.string().optional()
});

// Document schemas
export const CreateDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  category: z.string().min(1, 'Category is required'),
  projectId: uuidSchema.optional(),
  organizationId: uuidSchema,
  isPublic: z.boolean().default(false)
});

// Notification schemas
export const CreateNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['info', 'warning', 'error', 'success']).default('info'),
  userId: uuidSchema,
  data: z.any().optional()
});

// System Setting schemas
export const CreateSystemSettingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  isEditable: z.boolean().default(true),
  organizationId: uuidSchema.optional()
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  filters: z.string().optional()
});

// Export all schemas
export const ValidationSchemas = {
  CreateUserSchema,
  CreateOrganizationSchema,
  CreateProjectSchema,
  CreateItemSchema,
  CreatePurchaseOrderSchema,
  CreateVendorSchema,
  CreateAttendanceSchema,
  CreateCustomerInvoiceSchema,
  CreatePaymentSchema,
  CreateDocumentSchema,
  CreateNotificationSchema,
  CreateSystemSettingSchema,
  PaginationSchema
};