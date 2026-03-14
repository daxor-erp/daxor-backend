import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ICareer extends IBaseEntity {
  jobTitle: string;
  jobCode: string;
  department: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  qualifications: string;
  skills: string[];
  jobDescription: string;
  responsibilities: string;
  salaryRange: { min: number; max: number };
  openings: number;
  postedDate: Date;
  closingDate: Date;
  status: string;
  organizationId: string;
  isDeleted: boolean;
}

export interface IRecruitment extends IBaseEntity {
  applicantId: string;
  jobId: string;
  applicationDate: Date;
  source: string;
  stage: string;
  interviewDate?: Date;
  interviewers?: string[];
  feedback?: string;
  offerAmount?: number;
  joiningDate?: Date;
  status: string;
  organizationId: string;
  isDeleted: boolean;
}

const CareerSchema = new Schema<ICareer>({
  jobTitle: { type: String, required: true },
  jobCode: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { type: String, required: true },
  experienceRequired: { type: String, required: true },
  qualifications: { type: String, required: true },
  skills: [String],
  jobDescription: { type: String, required: true },
  responsibilities: { type: String, required: true },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  openings: { type: Number, required: true },
  postedDate: { type: Date, required: true },
  closingDate: { type: Date, required: true },
  status: { type: String, default: 'OPEN' },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const RecruitmentSchema = new Schema<IRecruitment>({
  applicantId: { type: String, required: true },
  jobId: { type: String, required: true },
  applicationDate: { type: Date, required: true },
  source: { type: String, required: true },
  stage: { type: String, default: 'APPLIED' },
  interviewDate: Date,
  interviewers: [String],
  feedback: String,
  offerAmount: Number,
  joiningDate: Date,
  status: { type: String, default: 'ACTIVE' },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const Career = mongoose.model<ICareer>('Career', CareerSchema);
export const Recruitment = mongoose.model<IRecruitment>('Recruitment', RecruitmentSchema);
