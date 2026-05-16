import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface ILead extends IBaseEntity {
  seqNo: string;
  firstName: string;
  lastName: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  rating?: string;
  estimatedValue?: number;
  expectedCloseDate?: Date;
  assignedTo?: string;
  notes?: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const LeadSchema = new Schema<ILead>({
  seqNo: { type: String, unique: true, sparse: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  title: { type: String },
  email: { type: String },
  phone: { type: String },
  source: { type: String },
  status: { type: String, default: 'new', enum: ['new', 'contacted', 'qualified', 'unqualified', 'converted', 'pending_approval', 'approval_rejected'] },
  rating: { type: String, enum: ['hot', 'warm', 'cold'] },
  estimatedValue: { type: Number },
  expectedCloseDate: { type: Date },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

LeadSchema.index({ email: 1, organizationId: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ assignedTo: 1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
