import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IOpportunity extends IBaseEntity {
  seqNo: string;
  name: string;
  accountName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  amount?: number;
  closeDate?: Date;
  stage: string;
  probability?: number;
  leadSource?: string;
  nextStep?: string;
  description?: string;
  assignedTo?: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const OpportunitySchema = new Schema<IOpportunity>({
  seqNo: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  accountName: { type: String },
  contactName: { type: String },
  email: { type: String },
  phone: { type: String },
  amount: { type: Number },
  closeDate: { type: Date },
  stage: { type: String, default: 'prospecting', enum: ['prospecting', 'qualification', 'needs-analysis', 'proposal', 'negotiation', 'closed-won', 'closed-lost'] },
  probability: { type: Number, min: 0, max: 100 },
  leadSource: { type: String },
  nextStep: { type: String },
  description: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

OpportunitySchema.index({ stage: 1 });
OpportunitySchema.index({ assignedTo: 1 });
OpportunitySchema.index({ closeDate: 1 });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
