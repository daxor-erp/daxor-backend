import { z } from 'zod';

export const extractionSchema = z.object({
  extractionNumber: z.string().min(1),
  extractionDate: z.string().datetime(),
  rawMaterialId: z.string().uuid(),
  rawMaterialName: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  sourceLocation: z.string().min(1),
  extractionType: z.enum(['MINING', 'QUARRYING', 'HARVESTING', 'COLLECTION', 'OTHER']),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PLANNED'),
  productionOrderId: z.string().uuid().optional(),
  requisitionId: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  createdBy: z.string().uuid(),
});

export const rawMaterialRequisitionSchema = z.object({
  requisitionNumber: z.string().min(1),
  requisitionDate: z.string().datetime(),
  requiredDate: z.string().datetime(),
  rawMaterialId: z.string().uuid(),
  requestedQuantity: z.number().positive(),
  unit: z.string().min(1),
  purpose: z.string().min(1),
  requestedBy: z.string().uuid(),
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'FULFILLED']).default('DRAFT'),
  organizationId: z.string().uuid(),
});

export type ExtractionInput = z.infer<typeof extractionSchema>;
export type RawMaterialRequisitionInput = z.infer<typeof rawMaterialRequisitionSchema>;
