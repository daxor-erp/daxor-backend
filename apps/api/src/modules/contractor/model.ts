import mongoose, { Schema } from 'mongoose';
import { IBaseEntity } from '../base/mongo-repository';

export interface IContractor extends IBaseEntity {
  seqNo: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  specialty?: string;
  status: string;
  organizationId: string;
  createdBy: string;
  isDeleted: boolean;
}

const ContractorSchema = new Schema<IContractor>({
  seqNo: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  specialty: { type: String },
  status: { type: String, default: 'active' },
  organizationId: { type: String, required: true, index: true },
  createdBy: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

ContractorSchema.index({ name: 1, organizationId: 1 });

export const Contractor = mongoose.model<IContractor>('Contractor', ContractorSchema);
