import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IApplicant extends IBaseEntity {
  applicantNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    grade?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    from: Date;
    to?: Date;
    current: boolean;
  }>;
  skills: string[];
  resumeUrl?: string;
  coverLetterUrl?: string;
  applicationStatus: string;
  source: string;
  organizationId: string;
  isDeleted: boolean;
}

const ApplicantSchema = new Schema<IApplicant>({
  applicantNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  alternatePhone: String,
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
    grade: String,
  }],
  experience: [{
    company: String,
    position: String,
    from: Date,
    to: Date,
    current: { type: Boolean, default: false },
  }],
  skills: [String],
  resumeUrl: String,
  coverLetterUrl: String,
  applicationStatus: { type: String, default: 'NEW' },
  source: { type: String, required: true },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Applicant = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
