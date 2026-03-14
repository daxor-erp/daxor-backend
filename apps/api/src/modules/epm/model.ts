import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IEPM extends IBaseEntity {
  employeeId: string;
  reviewPeriod: string;
  reviewYear: number;
  reviewType: string;
  reviewDate: Date;
  reviewerId: string;
  goals: Array<{ goal: string; weight: number; achievement?: number }>;
  competencies: Array<{ competency: string; rating: number }>;
  overallRating: number;
  strengths?: string;
  areasOfImprovement?: string;
  trainingRecommendations?: string;
  comments?: string;
  status: string;
  organizationId: string;
  isDeleted: boolean;
}

const EPMSchema = new Schema<IEPM>({
  employeeId: { type: String, required: true, index: true },
  reviewPeriod: { type: String, required: true },
  reviewYear: { type: Number, required: true },
  reviewType: { type: String, required: true },
  reviewDate: { type: Date, required: true },
  reviewerId: { type: String, required: true },
  goals: [{
    goal: String,
    weight: Number,
    achievement: Number,
  }],
  competencies: [{
    competency: String,
    rating: Number,
  }],
  overallRating: { type: Number, required: true },
  strengths: String,
  areasOfImprovement: String,
  trainingRecommendations: String,
  comments: String,
  status: { type: String, default: 'DRAFT' },
  organizationId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const EPM = mongoose.model<IEPM>('EPM', EPMSchema);
