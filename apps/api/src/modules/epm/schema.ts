import { z } from 'zod';

export const epmSchema = z.object({
  employeeId: z.string().uuid(),
  reviewPeriod: z.string().min(1),
  reviewYear: z.number().int().positive(),
  reviewType: z.enum(['ANNUAL', 'QUARTERLY', 'PROBATION', 'PROJECT_BASED']),
  reviewDate: z.string().datetime(),
  reviewerId: z.string().uuid(),
  goals: z.array(z.object({
    goal: z.string(),
    weight: z.number(),
    achievement: z.number().optional(),
  })),
  competencies: z.array(z.object({
    competency: z.string(),
    rating: z.number().min(1).max(5),
  })),
  overallRating: z.number().min(1).max(5),
  strengths: z.string().optional(),
  areasOfImprovement: z.string().optional(),
  trainingRecommendations: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'COMPLETED']).default('DRAFT'),
  organizationId: z.string().uuid(),
});

export type EPMInput = z.infer<typeof epmSchema>;
