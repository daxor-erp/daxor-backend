import { z } from 'zod';

export const careerSchema = z.object({
  jobTitle: z.string().min(1),
  jobCode: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  experienceRequired: z.string().min(1),
  qualifications: z.string().min(1),
  skills: z.array(z.string()),
  jobDescription: z.string().min(1),
  responsibilities: z.string().min(1),
  salaryRange: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  openings: z.number().positive(),
  postedDate: z.string().datetime(),
  closingDate: z.string().datetime(),
  status: z.enum(['OPEN', 'CLOSED', 'ON_HOLD']).default('OPEN'),
  organizationId: z.string().uuid(),
});

export const recruitmentSchema = z.object({
  applicantId: z.string().uuid(),
  jobId: z.string().uuid(),
  applicationDate: z.string().datetime(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'JOB_PORTAL', 'SOCIAL_MEDIA', 'OTHER']),
  stage: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED']).default('APPLIED'),
  interviewDate: z.string().datetime().optional(),
  interviewers: z.array(z.string().uuid()).optional(),
  feedback: z.string().optional(),
  offerAmount: z.number().optional(),
  joiningDate: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'WITHDRAWN']).default('ACTIVE'),
  organizationId: z.string().uuid(),
});

export type CareerInput = z.infer<typeof careerSchema>;
export type RecruitmentInput = z.infer<typeof recruitmentSchema>;
