import { z } from 'zod';

export const assetSchema = z.object({
  assetNumber: z.string().min(1),
  assetName: z.string().min(1),
  assetType: z.enum(['EQUIPMENT', 'VEHICLE', 'BUILDING', 'FURNITURE', 'IT', 'OTHER']),
  category: z.string().min(1),
  purchaseDate: z.string().datetime(),
  purchasePrice: z.number().positive(),
  currentValue: z.number().positive(),
  depreciationMethod: z.enum(['STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION']),
  usefulLife: z.number().positive(),
  location: z.string().min(1),
  assignedTo: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DISPOSED']).default('ACTIVE'),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  warrantyExpiry: z.string().datetime().optional(),
  organizationId: z.string().uuid(),
});

export type AssetInput = z.infer<typeof assetSchema>;
