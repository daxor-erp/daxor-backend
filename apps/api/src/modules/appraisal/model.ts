import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IAppraisalGoal {
  title: string;
  weight: number;        // 0-100
  selfRating?: number;   // 1-5
  managerRating?: number;
  comments?: string;
}

export interface IAppraisal extends IBaseEntity {
  organizationId: string;
  employeeId: string;
  reviewerId?: string;
  cycle: string;         // e.g. "FY2025-26-H1"
  periodStart: Date;
  periodEnd: Date;
  goals: IAppraisalGoal[];
  selfReview?: string;
  managerReview?: string;
  overallRating?: number;
  recommendedHikePercent?: number;
  status: 'DRAFT' | 'SELF_REVIEW' | 'MANAGER_REVIEW' | 'CALIBRATED' | 'FINALIZED';
  finalizedAt?: Date;
  createdBy: string;
  isDeleted: boolean;
}

const AppraisalGoalSchema = new Schema<IAppraisalGoal>({
  title: { type: String, required: true },
  weight: { type: Number, default: 0 },
  selfRating: { type: Number },
  managerRating: { type: Number },
  comments: { type: String },
}, { _id: false });

const AppraisalSchema = new Schema<IAppraisal>({
  organizationId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true, index: true },
  reviewerId: { type: String },
  cycle: { type: String, required: true, index: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  goals: { type: [AppraisalGoalSchema], default: [] },
  selfReview: { type: String },
  managerReview: { type: String },
  overallRating: { type: Number },
  recommendedHikePercent: { type: Number },
  status: {
    type: String,
    enum: ['DRAFT', 'SELF_REVIEW', 'MANAGER_REVIEW', 'CALIBRATED', 'FINALIZED'],
    default: 'DRAFT',
  },
  finalizedAt: { type: Date },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

AppraisalSchema.index({ organizationId: 1, cycle: 1, employeeId: 1 }, { unique: true });

export const Appraisal = mongoose.model<IAppraisal>('Appraisal', AppraisalSchema);
