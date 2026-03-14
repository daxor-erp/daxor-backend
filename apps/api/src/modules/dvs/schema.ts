import { z } from 'zod';

export const dvsSchema = z.object({
  applicantId: z.string().uuid(),
  documentType: z.enum(['IDENTITY', 'ADDRESS', 'EDUCATION', 'EMPLOYMENT', 'REFERENCE', 'OTHER']),
  documentName: z.string().min(1),
  documentNumber: z.string().optional(),
  issuingAuthority: z.string().optional(),
  issueDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  verificationStatus: z.enum(['PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED', 'EXPIRED']).default('PENDING'),
  verifiedBy: z.string().uuid().optional(),
  verificationDate: z.string().datetime().optional(),
  verificationNotes: z.string().optional(),
  documentUrl: z.string().url().optional(),
  organizationId: z.string().uuid(),
});

export type DVSInput = z.infer<typeof dvsSchema>;
