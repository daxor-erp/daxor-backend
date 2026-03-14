import { z } from 'zod';

export const applicantSchema = z.object({
  applicantNumber: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  nationality: z.string().min(1),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number(),
    grade: z.string().optional(),
  })),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    from: z.string().datetime(),
    to: z.string().datetime().optional(),
    current: z.boolean().default(false),
  })).optional(),
  skills: z.array(z.string()),
  resumeUrl: z.string().url().optional(),
  coverLetterUrl: z.string().url().optional(),
  applicationStatus: z.enum(['NEW', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN']).default('NEW'),
  source: z.enum(['WEBSITE', 'REFERRAL', 'JOB_PORTAL', 'SOCIAL_MEDIA', 'OTHER']),
  organizationId: z.string().uuid(),
});

export type ApplicantInput = z.infer<typeof applicantSchema>;
